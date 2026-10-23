#!/usr/bin/env python3
"""
Bun & Brew - Coffee Expert System
=================================
A rule-based expert system with three classic components:

  1. Knowledge base     -> DRINKS, PASTRIES, DERIVE_RULES, SCORE_RULES
  2. Inference engine   -> forward chaining to a fixed point (derived facts),
                           then weighted rule scoring + hard-constraint pruning
  3. Explanation module -> every recommendation lists the exact rules that fired

Run:
  python coffee_expert_system.py              # interactive questionnaire
  python coffee_expert_system.py --demo       # three ready-made profiles
  python coffee_expert_system.py --rules      # print the whole rule base
  python coffee_expert_system.py --selftest   # run the built-in tests
  python coffee_expert_system.py --demo --json
Requires Python 3.9+ and no third-party packages.
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Tuple

Memory = Dict[str, object]  # the "working memory": facts known about the customer


# --------------------------------------------------------------------------- #
# 1. KNOWLEDGE BASE
# --------------------------------------------------------------------------- #
@dataclass(frozen=True)
class Item:
    id: int
    name: str
    price: float
    temp: str          # hot | iced | any
    caffeine: int      # 0..3
    sweetness: int     # 0..3
    milk: str          # dairy | oat | none
    tags: frozenset


def _i(id, name, price, temp, caf, sw, milk, tags):
    return Item(id, name, price, temp, caf, sw, milk, frozenset(tags.split()))


DRINKS: List[Item] = [
    _i(1, "Espresso", 3.50, "hot", 3, 0, "none", "bitter"),
    _i(2, "Americano", 3.80, "hot", 3, 0, "none", "bitter"),
    _i(3, "Cappuccino", 4.50, "hot", 2, 1, "dairy", "creamy"),
    _i(4, "Caffe Latte", 4.80, "hot", 2, 1, "dairy", "creamy"),
    _i(5, "Flat White", 4.75, "hot", 3, 1, "dairy", "bitter creamy"),
    _i(6, "Spanish Latte", 5.50, "hot", 2, 3, "dairy", "sweet creamy"),
    _i(7, "Caramel Macchiato", 5.25, "hot", 2, 3, "dairy", "sweet creamy"),
    _i(8, "Mocha", 5.20, "hot", 2, 3, "dairy", "sweet creamy"),
    _i(9, "Iced Latte", 4.95, "iced", 2, 1, "dairy", "creamy"),
    _i(10, "Cold Brew", 4.85, "iced", 3, 0, "none", "bitter fruity"),
    _i(11, "Matcha Latte", 5.20, "hot", 1, 2, "oat", "nutty creamy"),
    _i(12, "Chocolate Frappe", 5.80, "iced", 2, 3, "dairy", "sweet creamy"),
]
PASTRIES: List[Item] = [
    _i(13, "Butter Croissant", 3.75, "any", 0, 1, "dairy", "sweet"),
    _i(14, "Blueberry Muffin", 3.95, "any", 0, 2, "dairy", "fruity sweet"),
    _i(15, "Smoked Turkey & Cheese Bagel", 6.50, "any", 0, 0, "dairy", "savory"),
]

CHOICES = {
    "temp": ["hot", "iced", "any"],
    "taste": ["sweet", "bitter", "fruity", "nutty", "creamy"],
    "caffeine": [1, 2, 3],
    "milk": ["any", "oat", "none"],
    "sweetness": [0, 1, 2, 3],
    "mood": ["energise", "relax", "treat"],
    "time": ["morning", "afternoon", "evening"],
}
LABELS = {
    "caffeine": {1: "low", 2: "medium", 3: "high"},
    "sweetness": {0: "none", 1: "light", 2: "sweet", 3: "very sweet"},
    "milk": {"any": "any milk", "oat": "oat milk", "none": "dairy-free"},
}


@dataclass(frozen=True)
class DeriveRule:
    """Phase 1 rule: IF condition THEN add/refine facts (chained until stable)."""
    id: str
    text: str
    cond: Callable[[Memory], bool]
    then: Dict[str, object]


@dataclass(frozen=True)
class ScoreRule:
    """Phase 2 rule: IF condition(facts, drink) THEN weight (or hard exclusion)."""
    id: str
    name: str
    text: str
    weight: int
    cond: Callable[[Memory, Item], bool]
    applies: Callable[[Memory], bool] = lambda m: True  # used to normalise %
    hard: bool = False


DERIVE_RULES: List[DeriveRule] = [
    DeriveRule("D1", "time = evening  =>  max_caffeine <= 1",
               lambda m: m["time"] == "evening", {"max_caffeine": 1}),
    DeriveRule("D2", "mood = relax  =>  max_caffeine <= 2",
               lambda m: m["mood"] == "relax", {"max_caffeine": 2}),
    DeriveRule("D3", "milk = none  =>  avoid_dairy",
               lambda m: m["milk"] == "none", {"avoid_dairy": True}),
    DeriveRule("D4", "max_caffeine < wanted caffeine  =>  wanted caffeine lowered to the cap",
               lambda m: "max_caffeine" in m and m["caffeine"] > m["max_caffeine"],
               {"caffeine": "@max_caffeine"}),  # chained: depends on D1/D2
    DeriveRule("D5", "mood = energise AND time = evening  =>  warn about sleep",
               lambda m: m["mood"] == "energise" and m["time"] == "evening",
               {"warning": "Late-day caffeine can affect sleep; we capped the caffeine level."}),
]

SCORE_RULES: List[ScoreRule] = [
    ScoreRule("R1", "Temperature conflict", "preferred temp is set AND drink temp differs",
              -100, lambda m, d: m["temp"] != "any" and d.temp != m["temp"], hard=True),
    ScoreRule("R2", "Dairy-free conflict", "avoid_dairy AND drink contains dairy",
              -100, lambda m, d: bool(m.get("avoid_dairy")) and d.milk == "dairy", hard=True),
    ScoreRule("R3", "Caffeine over cap", "drink caffeine > max_caffeine",
              -100, lambda m, d: d.caffeine > m.get("max_caffeine", 3), hard=True),
    ScoreRule("R4", "Temperature match", "drink temp = preferred temp",
              30, lambda m, d: m["temp"] != "any" and d.temp == m["temp"],
              applies=lambda m: m["temp"] != "any"),
    ScoreRule("R5", "Taste match", "preferred taste is in the drink's tags",
              25, lambda m, d: m["taste"] in d.tags),
    ScoreRule("R6", "Caffeine match", "drink caffeine = wanted caffeine",
              20, lambda m, d: d.caffeine == m["caffeine"]),
    ScoreRule("R7", "Caffeine far off", "caffeine differs by 2+ levels",
              -25, lambda m, d: abs(d.caffeine - m["caffeine"]) >= 2),
    ScoreRule("R8", "Oat milk preferred", "milk = oat AND drink uses oat milk",
              20, lambda m, d: m["milk"] == "oat" and d.milk == "oat",
              applies=lambda m: m["milk"] == "oat"),
    ScoreRule("R9", "Sweetness match", "drink sweetness = preferred sweetness",
              20, lambda m, d: d.sweetness == m["sweetness"]),
    ScoreRule("R10", "Sweetness far off", "sweetness differs by 2+ levels",
              -20, lambda m, d: abs(d.sweetness - m["sweetness"]) >= 2),
    ScoreRule("R11", "Energise mood", "mood = energise AND drink caffeine = 3",
              10, lambda m, d: m["mood"] == "energise" and d.caffeine == 3,
              applies=lambda m: m["mood"] == "energise" and m.get("max_caffeine", 3) >= 3),
    ScoreRule("R12", "Relax mood", "mood = relax AND (caffeine <= 1 OR creamy)",
              10, lambda m, d: m["mood"] == "relax" and (d.caffeine <= 1 or "creamy" in d.tags),
              applies=lambda m: m["mood"] == "relax"),
    ScoreRule("R13", "Treat mood", "mood = treat AND drink sweetness = 3",
              10, lambda m, d: m["mood"] == "treat" and d.sweetness == 3,
              applies=lambda m: m["mood"] == "treat"),
]


# --------------------------------------------------------------------------- #
# 2. INFERENCE ENGINE
# --------------------------------------------------------------------------- #
@dataclass
class Recommendation:
    item: Item
    score: int
    percent: int
    fired: List[ScoreRule] = field(default_factory=list)


@dataclass
class Result:
    facts: Memory
    derived: Dict[str, object]
    trace: List[str]
    ranked: List[Recommendation]
    excluded: List[Tuple[Item, List[str]]]
    pairing: Optional[Item]


def validate(facts: Memory) -> Memory:
    """Reject missing keys / illegal values early so the rules can stay simple."""
    clean: Memory = {}
    for key, allowed in CHOICES.items():
        if key not in facts:
            raise ValueError(f"missing fact: {key!r}")
        if facts[key] not in allowed:
            raise ValueError(f"invalid {key!r}: {facts[key]!r}; allowed: {allowed}")
        clean[key] = facts[key]
    return clean


def forward_chain(memory: Memory, trace: List[str]) -> Memory:
    """Fire DERIVE_RULES repeatedly until no rule changes working memory."""
    fired_once = set()
    changed = True
    while changed:
        changed = False
        for rule in DERIVE_RULES:
            if rule.id in fired_once or not rule.cond(memory):
                continue
            updates = {}
            for k, v in rule.then.items():
                v = memory[v[1:]] if isinstance(v, str) and v.startswith("@") else v
                if k == "max_caffeine" and k in memory:
                    v = min(v, memory[k])          # caps only ever tighten
                if memory.get(k) != v:
                    updates[k] = v
            if updates:
                memory.update(updates)
                fired_once.add(rule.id)
                changed = True
                trace.append(f"{rule.id}: {rule.text}  ->  {updates}")
    return memory


def pick_pairing(top: Item) -> Item:
    if top.sweetness >= 3:
        return PASTRIES[0]        # neutral croissant balances very sweet drinks
    if "bitter" in top.tags:
        return PASTRIES[1]        # fruity muffin lifts bitter coffee
    return PASTRIES[2]            # savory bagel for light/creamy drinks


def recommend(raw_facts: Memory, top: int = 3) -> Result:
    memory = validate(dict(raw_facts))
    original = dict(memory)
    trace: List[str] = []
    memory = forward_chain(memory, trace)
    derived = {k: v for k, v in memory.items() if original.get(k) != v}

    max_score = sum(r.weight for r in SCORE_RULES if r.weight > 0 and r.applies(memory)) or 1
    ranked, excluded = [], []
    for drink in DRINKS:
        score, fired, why = 0, [], []
        for rule in SCORE_RULES:
            if rule.cond(memory, drink):
                fired.append(rule)
                score += rule.weight
                if rule.hard:
                    why.append(f"{rule.id} {rule.name}")
        if why:
            excluded.append((drink, why))
            continue
        pct = max(0, min(99, round(score / max_score * 100)))
        ranked.append(Recommendation(drink, score, pct, fired))
    ranked.sort(key=lambda r: (-r.score, r.item.price, r.item.name))
    ranked = ranked[:top]
    return Result(memory, derived, trace, ranked, excluded,
                  pick_pairing(ranked[0].item) if ranked else None)


# --------------------------------------------------------------------------- #
# 3. EXPLANATION / OUTPUT
# --------------------------------------------------------------------------- #
def describe(facts: Memory) -> str:
    lab = lambda k: LABELS.get(k, {}).get(facts[k], facts[k])
    return (f"{facts['temp']}, {facts['taste']}, {lab('caffeine')} caffeine, {lab('milk')}, "
            f"{lab('sweetness')} sweetness, mood={facts['mood']}, time={facts['time']}")


def render(res: Result, verbose: bool = True) -> str:
    out = ["", "=" * 64, "Customer profile: " + describe(res.facts)]
    if res.trace:
        out.append("\nForward chaining derived new facts:")
        out += [f"  * {t}" for t in res.trace]
    if "warning" in res.facts:
        out.append(f"  ! {res.facts['warning']}")
    if not res.ranked:
        out.append("\nNo drink satisfies all hard rules. Relax the milk, temperature or caffeine choice.")
        return "\n".join(out)
    out.append("\nTop matches:")
    for n, r in enumerate(res.ranked, 1):
        out.append(f"\n  #{n} {r.item.name}  ${r.item.price:.2f}   {r.percent}% match   (score {r.score})")
        if verbose:
            for rule in r.fired:
                sign = "+" if rule.weight > 0 else ""
                out.append(f"       {rule.id:<4} IF {rule.text}  =>  {sign}{rule.weight}")
    if res.pairing:
        out.append(f"\nPairs well with: {res.pairing.name} (${res.pairing.price:.2f})")
    if verbose and res.excluded:
        out.append(f"\nExcluded by hard rules ({len(res.excluded)}): " +
                   "; ".join(f"{d.name} [{', '.join(w)}]" for d, w in res.excluded))
    return "\n".join(out)


def to_json(res: Result) -> dict:
    return {
        "facts": res.facts,
        "derived": res.derived,
        "recommendations": [
            {"id": r.item.id, "name": r.item.name, "price": r.item.price, "percent": r.percent,
             "score": r.score, "rules": [x.id for x in r.fired]} for r in res.ranked],
        "pairing": res.pairing.name if res.pairing else None,
        "excluded": [{"name": d.name, "rules": w} for d, w in res.excluded],
    }


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #
QUESTIONS = [
    ("temp", "Temperature"), ("taste", "Taste you want"), ("caffeine", "Caffeine level"),
    ("milk", "Milk preference"), ("sweetness", "Sweetness"), ("mood", "Your mood"),
    ("time", "Time of day"),
]


def ask(key: str, title: str) -> object:
    options = CHOICES[key]
    while True:
        print(f"\n{title}:")
        for n, o in enumerate(options, 1):
            print(f"  {n}) {LABELS.get(key, {}).get(o, o)}")
        try:
            raw = input("> ").strip()
        except EOFError:
            sys.exit("\nInput closed.")
        if raw.isdigit() and 1 <= int(raw) <= len(options):
            return options[int(raw) - 1]
        print("Please type one of the numbers above.")


DEMOS = [
    dict(temp="iced", taste="creamy", caffeine=2, milk="oat", sweetness=1, mood="relax", time="afternoon"),
    dict(temp="hot", taste="bitter", caffeine=3, milk="none", sweetness=0, mood="energise", time="evening"),
    dict(temp="any", taste="sweet", caffeine=2, milk="any", sweetness=3, mood="treat", time="morning"),
]


def selftest() -> None:
    # hard rules
    r = recommend(dict(temp="iced", taste="bitter", caffeine=3, milk="none", sweetness=0, mood="energise", time="morning"))
    assert r.ranked[0].item.name == "Cold Brew", r.ranked[0].item.name
    assert all(x.item.temp == "iced" and x.item.milk != "dairy" for x in r.ranked)
    # forward chaining chain D1 -> D4 and caffeine cap hard rule
    r = recommend(DEMOS[1])
    assert r.facts["max_caffeine"] == 1 and r.facts["caffeine"] == 1 and "warning" in r.facts
    assert all(x.item.caffeine <= 1 for x in r.ranked)
    # sweet-tooth profile
    r = recommend(DEMOS[2])
    assert r.ranked[0].item.sweetness == 3 and r.ranked[0].percent >= 80
    assert r.pairing and r.pairing.name == "Butter Croissant"
    # percentages stay in range, ordering is stable
    for d in DEMOS:
        res = recommend(d, top=12)
        assert all(0 <= x.percent <= 99 for x in res.ranked)
        assert [x.score for x in res.ranked] == sorted((x.score for x in res.ranked), reverse=True)
    # validation
    for bad in (dict(DEMOS[0], temp="warm"), {k: v for k, v in DEMOS[0].items() if k != "mood"}):
        try:
            recommend(bad)
        except ValueError:
            continue
        raise AssertionError("validation did not reject bad input")
    print("selftest: all checks passed")


def main(argv: Optional[List[str]] = None) -> int:
    p = argparse.ArgumentParser(description="Bun & Brew coffee expert system")
    p.add_argument("--demo", action="store_true", help="run three sample profiles")
    p.add_argument("--rules", action="store_true", help="print the rule base")
    p.add_argument("--selftest", action="store_true", help="run built-in tests")
    p.add_argument("--json", action="store_true", help="machine-readable output")
    p.add_argument("--top", type=int, default=3, help="how many matches to show")
    p.add_argument("--brief", action="store_true", help="hide the rule explanations")
    a = p.parse_args(argv)

    if a.selftest:
        selftest()
        return 0
    if a.rules:
        for r in DERIVE_RULES:
            print(f"{r.id:<4} (derive) {r.text}")
        for r in SCORE_RULES:
            print(f"{r.id:<4} ({'HARD ' if r.hard else 'score'}) {r.name}: IF {r.text}  [{r.weight:+d}]")
        return 0

    profiles = DEMOS if a.demo else [{k: ask(k, t) for k, t in QUESTIONS}]
    results = [recommend(f, a.top) for f in profiles]
    if a.json:
        print(json.dumps([to_json(r) for r in results], indent=2, ensure_ascii=False))
    else:
        for r in results:
            print(render(r, verbose=not a.brief))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
