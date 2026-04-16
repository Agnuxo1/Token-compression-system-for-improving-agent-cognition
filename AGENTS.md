# Cognitive Skills Engine — Multi-Agent Configuration

## Instructions for ALL AI Agents

You have access to the **Cognitive Skills Engine (CSE)** — a system of 20 expert cognitive
skill files that enhance your reasoning depth and compress your output tokens.

### How to use this system

1. **Start every non-trivial task at D5 (MASTER-SKILL.md)**
2. **Read BOARD.md** to see all 24 cells and their codes
3. **Classify your task** and select the appropriate skill cell(s)
4. **Load the skill file** for each relevant cell
5. **Always load A1 (token-compression.md)** — it applies to ALL output
6. **Log your path**: record the cells you visit (e.g., `D5·A1·A2·D6`)
7. **Apply TC compression** to all output before delivering

### Quick skill map

```
Task type                  Load this file
──────────────────────────────────────────────────────────
Mathematics/proof          skills/science/mathematician-mind.md
Physics                    skills/science/physicist-mind.md
Chemistry                  skills/science/chemist-mind.md
Biology/genetics           skills/science/biologist-mind.md
Code/algorithms/ML         skills/science/computer-scientist-mind.md
Medicine/clinical          skills/science/medical-mind.md
Astronomy/cosmology        skills/science/astronomer-mind.md
Engineering/design         skills/science/engineer-mind.md
History                    skills/humanities/historian-mind.md
Philosophy/ethics          skills/humanities/philosopher-mind.md
Psychology/cognition       skills/humanities/psychologist-mind.md
Linguistics/language       skills/humanities/linguist-mind.md
Geography/spatial          skills/humanities/geographer-mind.md
Economics/markets          skills/humanities/economist-mind.md
Politics/governance        skills/humanities/political-scientist-mind.md
Law/legal                  skills/humanities/jurist-mind.md
Arts/music/literature      skills/arts-culture/arts-mind.md
Environment/climate        skills/arts-culture/environmental-mind.md
Culture/anthropology       skills/arts-culture/culture-mind.md
Compression (always)       skills/core/token-compression.md
Router/all tasks           MASTER-SKILL.md
```

### Token compression is MANDATORY for all output

Rule: `∀ concept c: ∃ formal(c) → output formal(c)`

- Use mathematical notation for mathematical concepts
- Use chemical formulas for chemical entities
- Use code/pseudocode for algorithmic concepts
- Use IPA for phonological descriptions
- Use compressed formal terms for philosophical concepts
- Never use verbose natural language when a compact formal exists

---

## Claude Code

Load MASTER-SKILL.md as a skill: it auto-routes all tasks through the board.

## Gemini CLI

See GEMINI.md for Gemini-specific configuration.

## Cursor / Windsurf

Install the VS Code extension: search "Cognitive Skills Engine" in extensions panel.
Or add to `.cursorrules` / `.windsurfrules`:
```
@MASTER-SKILL.md
@skills/core/token-compression.md
```

## Cline

Add to `.clinerules/`:
```
Use MASTER-SKILL.md as the routing layer for all tasks.
Apply token-compression.md to all output.
Navigate the Cognition Board (BOARD.md) for domain selection.
```

## Codex / GitHub Copilot

Add MASTER-SKILL.md content to your system prompt or context window.
