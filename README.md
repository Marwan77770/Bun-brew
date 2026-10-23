# BUN & BREW - Artisanal Roastery

React + Vite + Tailwind app. The **Coffee Expert** is a rule-based expert system
(`src/utils/expertMatcher.ts`, ported from `expert-system/coffee_expert_system.py`):

1. Knowledge base: drinks, pastries, derive rules (D1-D5), score rules (R1-R13)
2. Inference engine: forward chaining to a fixed point, then weighted scoring and hard-constraint pruning
3. Explanation: every card lists the exact rules that fired

## Run locally
    npm install
    npm run dev        # http://localhost:3000
    npm run build      # outputs dist/

## Python version of the expert system
    python expert-system/coffee_expert_system.py --demo
    python expert-system/coffee_expert_system.py --rules
    python expert-system/coffee_expert_system.py --selftest

## Deploy to GitHub Pages
1. Push this folder to a GitHub repository (branch `main`).
2. Settings > Pages > Source: **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push.
