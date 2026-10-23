import test from 'node:test';
import assert from 'node:assert/strict';
import { runExpertInference, recommend } from './expertMatcher';
import type { ExpertPreferences } from '../types';

const base: ExpertPreferences = {
  temperature: 'iced', tasteProfile: 'creamy', caffeineLevel: 'medium',
  milkPreference: 'oat', sweetnessPreference: 'light', vibe: 'smooth', budget: 'mid',
};

test('iced + creamy + oat milk -> Iced Latte first, caffeine cap removes Cold Brew', () => {
  const r = runExpertInference(base, 'afternoon');
  // mood "smooth" => relax => rule D2 caps caffeine at 2, so Cold Brew (3) is excluded by hard rule R3
  assert.deepEqual(r.map(x => x.id), ['iced-latte', 'chocolate-frappe']);
  assert.equal(r[0].id, 'iced-latte');
  assert.ok(r[0].compatibility >= 80);
  assert.ok(r[0].rulesFired.length > 0);
});

test('evening caffeine cap chains D1 -> D4 and excludes strong drinks', () => {
  const res = recommend({ temp: 'hot', taste: 'bitter', caffeine: 3, milk: 'none', sweetness: 0, mood: 'energise', time: 'evening' });
  assert.equal(res.facts.max_caffeine, 1);
  assert.equal(res.facts.caffeine, 1);
  assert.ok(res.facts.warning);
  assert.ok(res.ranked.every(x => x.item.caffeine <= 1));
});

test('sweet tooth profile pairs with a croissant', () => {
  const res = recommend({ temp: 'any', taste: 'sweet', caffeine: 2, milk: 'any', sweetness: 3, mood: 'treat', time: 'morning' });
  assert.equal(res.ranked[0].item.sweetness, 3);
  assert.equal(res.pairing?.name, 'Butter Croissant');
});

test('invalid facts are rejected', () => {
  assert.throws(() => recommend({ temp: 'warm' } as never));
});
