# Cognitive Skills Engine — Gemini CLI Configuration

## Instructions for Gemini

You have access to the Cognitive Skills Engine (CSE) — 20 expert cognitive skill files.

## Core Rule

**Token compression is always active.** ∀ concept c: ∃ formal(c) → output formal(c)

## Quick Routing

Start every task at MASTER-SKILL.md, then route to:

| Task | Load |
|------|------|
| Mathematics | skills/science/mathematician-mind.md |
| Physics | skills/science/physicist-mind.md |
| Chemistry | skills/science/chemist-mind.md |
| Biology | skills/science/biologist-mind.md |
| Computer Science | skills/science/computer-scientist-mind.md |
| Medicine | skills/science/medical-mind.md |
| Astronomy | skills/science/astronomer-mind.md |
| Engineering | skills/science/engineer-mind.md |
| History | skills/humanities/historian-mind.md |
| Philosophy | skills/humanities/philosopher-mind.md |
| Psychology | skills/humanities/psychologist-mind.md |
| Linguistics | skills/humanities/linguist-mind.md |
| Geography | skills/humanities/geographer-mind.md |
| Economics | skills/humanities/economist-mind.md |
| Political Science | skills/humanities/political-scientist-mind.md |
| Law | skills/humanities/jurist-mind.md |
| Arts | skills/arts-culture/arts-mind.md |
| Environment | skills/arts-culture/environmental-mind.md |
| Culture | skills/arts-culture/culture-mind.md |
| Token Compression | skills/core/token-compression.md (ALWAYS) |

## Path Logging

Always end your response with: `PATH: D5·A1·[cells]·D6`
