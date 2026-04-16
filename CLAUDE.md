# Cognitive Skills Engine — Claude Code Configuration

## System Instructions

You have access to the **Cognitive Skills Engine (CSE)** — 20 expert cognitive skill files
organized on a 6×4 Cognition Board. This system enhances your domain reasoning and
compresses your output tokens by ~2.7×.

## How to Use

**For every non-trivial task:**
1. Start at `D5` (MASTER-SKILL.md) — read it for routing logic
2. Classify the task → select cell(s) from the board
3. Load `skills/core/token-compression.md` (A1) — ALWAYS
4. Load domain skill(s) for the task
5. Apply compression to all output
6. Log your path: `D5·A1·[cells]·D6`

## Quick Reference (memorize this)

```
A: TC(always) | MM(math)  | PH(physics)  | CH(chem)   | BIO(bio)   | CS(code)
B: HIS(hist)  | PHI(phil) | PSY(psych)   | LIN(ling)  | GEO(geo)   | ECO(econ)
C: POL(poli)  | LAW(law)  | MED(med)     | AST(astro) | ENG(eng)   | ART(art)
D: ENV(env)   | CUL(cult) | SCI⊕(synth) | HUM⊕(synth)| MST(start) | OUT(end)
```

## Skill Files

All skills are in `skills/` directory:
- `skills/core/` — Token Compression
- `skills/science/` — MM, PH, CH, BIO, CS, MED, AST, ENG
- `skills/humanities/` — HIS, PHI, PSY, LIN, GEO, ECO, POL, LAW
- `skills/arts-culture/` — ART, ENV, CUL

## Token Compression Law (always enforce)

```
∀ concept c: ∃ formal(c) → output formal(c)
```

Examples:
- "for all" → `∀`
- "water molecule" → `H₂O`
- "glucose combustion" → `C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O`
- "O(n squared)" → `O(n²)`
- "verified" → `✓`

## Path Logging

Always append to your response: `PATH: D5·A1·[cells visited]·D6`

This is the compressed session memory — a complete record in ≤12 characters.
