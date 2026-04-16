---
name: master-skill
version: 1.0
board_position: D5
symbol: MST
description: >
  COGNITIVE ROUTER & BOARD NAVIGATOR — THE MASTER SKILL.
  Activates FIRST on every non-trivial task. Implements the Cognition Board:
  a 6×4 choose-your-own-adventure decision grid encoding the complete cognitive
  skill tree. Routes tasks to specialized skills without spending reasoning tokens.
  The Board path = compressed session memory (full session in ≤12 chars).
  Enforces token-compression on ALL output via TC[A1].
  Identity: Conductor ⊕ Router ⊕ Memory Architect.
  Trigger: ANY non-trivial task — classify first, reason second.
---

# MASTER-SKILL v1.0
# Cognitive Skills Engine — Central Router & Board Navigator

---

## §0  THE COGNITION BOARD

```
╔══════════════════════════════════════════════════════════════════╗
║              COGNITION BOARD v1.0 — CHOOSE YOUR PATH             ║
╠═══════╦════════╦════════╦════════╦════════╦════════╦════════╣
║       ║   1    ║   2    ║   3    ║   4    ║   5    ║   6    ║
╠═══════╬════════╬════════╬════════╬════════╬════════╬════════╣
║  [A]  ║ TC     ║ MM     ║ PH     ║ CH     ║ BIO    ║ CS     ║
║       ║ Token  ║ Math   ║Physics ║ Chem   ║Biology ║ CompSci║
╠═══════╬════════╬════════╬════════╬════════╬════════╬════════╣
║  [B]  ║ HIS    ║ PHI    ║ PSY    ║ LIN    ║ GEO    ║ ECO    ║
║       ║History ║Philos. ║ Psych  ║Linguist║ Geog.  ║Econom. ║
╠═══════╬════════╬════════╬════════╬════════╬════════╬════════╣
║  [C]  ║ POL    ║ LAW    ║ MED    ║ AST    ║ ENG    ║ ART    ║
║       ║Polit.  ║  Law   ║Medicin.║Astronom║Enginee.║  Arts  ║
╠═══════╬════════╬════════╬════════╬════════╬════════╬════════╣
║  [D]  ║ ENV    ║ CUL    ║ SCI⊕  ║ HUM⊕  ║ [MST]  ║ OUT    ║
║       ║Environ.║Culture ║SciSynth║HumSynth║ MASTER ║ Output ║
╚═══════╩════════╩════════╩════════╩════════╩════════╩════════╝

ALWAYS START: D5 (MST) → classify → route → D6 (OUT)
PATH LOG: D5·[cells visited]·D6   e.g. D5·A1·A2·D6
```

### Cell Quick Index
```python
BOARD = {
    "A1": ("TC",  "Token Compression",        "core/token-compression.md"),
    "A2": ("MM",  "Mathematician Mind",        "science/mathematician-mind.md"),
    "A3": ("PH",  "Physicist Mind",            "science/physicist-mind.md"),
    "A4": ("CH",  "Chemist Mind",              "science/chemist-mind.md"),
    "A5": ("BIO", "Biologist Mind",            "science/biologist-mind.md"),
    "A6": ("CS",  "Computer Scientist Mind",   "science/computer-scientist-mind.md"),
    "B1": ("HIS", "Historian Mind",            "humanities/historian-mind.md"),
    "B2": ("PHI", "Philosopher Mind",          "humanities/philosopher-mind.md"),
    "B3": ("PSY", "Psychologist Mind",         "humanities/psychologist-mind.md"),
    "B4": ("LIN", "Linguist Mind",             "humanities/linguist-mind.md"),
    "B5": ("GEO", "Geographer Mind",           "humanities/geographer-mind.md"),
    "B6": ("ECO", "Economist Mind",            "humanities/economist-mind.md"),
    "C1": ("POL", "Political Scientist Mind",  "humanities/political-scientist-mind.md"),
    "C2": ("LAW", "Jurist Mind",               "humanities/jurist-mind.md"),
    "C3": ("MED", "Medical Mind",              "science/medical-mind.md"),
    "C4": ("AST", "Astronomer Mind",           "science/astronomer-mind.md"),
    "C5": ("ENG", "Engineer Mind",             "science/engineer-mind.md"),
    "C6": ("ART", "Arts Mind",                 "arts-culture/arts-mind.md"),
    "D1": ("ENV", "Environmental Mind",        "arts-culture/environmental-mind.md"),
    "D2": ("CUL", "Culture Mind",              "arts-culture/culture-mind.md"),
    "D3": ("SCI⊕","Science Synthesis",        "→ multi-science: load relevant A-C row cells"),
    "D4": ("HUM⊕","Humanities Synthesis",     "→ multi-humanities: load relevant B-C row cells"),
    "D5": ("MST", "MASTER SKILL",             "MASTER-SKILL.md  ← YOU ARE HERE"),
    "D6": ("OUT", "Output / Terminal",         "→ apply TC, format, deliver response"),
}
```

---

## §1  ROUTING ALGORITHM

```python
def master_route(task: str) -> list[str]:
    """
    Phase 0: Always start D5 (MST).
    Phase 1: Classify task → domain(s).
    Phase 2: Select cell(s) from DISPATCH_TABLE.
    Phase 3: Always prepend A1 (TC — token compression).
    Phase 4: If multi-domain → route through synthesis cell (D3 or D4).
    Phase 5: Always end D6 (OUT).
    Return: ordered path list.
    """
    path = ["D5"]                           # always start at master

    domains = classify(task)                # returns set of domain codes
    cells   = [DISPATCH_TABLE[d] for d in domains]

    path.append("A1")                       # ALWAYS apply token compression

    if len(cells) == 1:
        path += cells
    elif all(c in SCIENCE_CELLS for c in cells):
        path += cells + ["D3"]             # science synthesis
    elif all(c in HUMAN_CELLS for c in cells):
        path += cells + ["D4"]             # humanities synthesis
    else:
        path += cells                       # cross-domain: chain in order

    path.append("D6")                       # always end at output
    return path

# Path notation (compressed):
# Full:  ["D5", "A1", "A2", "D6"]
# Short:  D5·A1·A2·D6
# Ultra:  M·TC·MM·O   (using skill symbols)
```

---

## §2  DISPATCH TABLE

```python
DISPATCH_TABLE = {
    # Mathematics
    "proof":           "A2",  "theorem":         "A2",  "bound":       "A2",
    "algebra":         "A2",  "topology":        "A2",  "combinatorics":"A2",
    "number_theory":   "A2",  "geometry":        "A2",  "analysis":    "A2",
    "optimization":    "A2",  "diophantine":     "A2",  "ramsey":      "A2",

    # Physics
    "quantum":         "A3",  "relativity":      "A3",  "mechanics":   "A3",
    "thermodynamics":  "A3",  "electromagnetism":"A3",  "particle":    "A3",
    "cosmology":       "A3",  "wave":            "A3",  "entropy":     "A3",

    # Chemistry
    "reaction":        "A4",  "molecule":        "A4",  "synthesis":   "A4",
    "organic":         "A4",  "inorganic":       "A4",  "catalyst":    "A4",
    "spectroscopy":    "A4",  "polymer":         "A4",  "crystal":     "A4",

    # Biology
    "genetics":        "A5",  "evolution":       "A5",  "cell":        "A5",
    "protein":         "A5",  "DNA":             "A5",  "ecology":     "A5",
    "metabolism":      "A5",  "neuroscience":    "A5",  "CRISPR":      "A5",

    # Computer Science
    "algorithm":       "A6",  "complexity":      "A6",  "machine_learning":"A6",
    "code":            "A6",  "data_structure":  "A6",  "distributed": "A6",
    "neural_network":  "A6",  "cryptography":    "A6",  "database":    "A6",

    # History
    "history":         "B1",  "historical":      "B1",  "ancient":     "B1",
    "medieval":        "B1",  "revolution":      "B1",  "war":         "B1",
    "civilization":    "B1",  "empire":          "B1",  "period":      "B1",

    # Philosophy
    "philosophy":      "B2",  "ethics":          "B2",  "epistemology":"B2",
    "metaphysics":     "B2",  "logic":           "B2",  "ontology":    "B2",
    "aesthetics":      "B2",  "kant":            "B2",  "plato":       "B2",

    # Psychology
    "psychology":      "B3",  "cognition":       "B3",  "behavior":    "B3",
    "emotion":         "B3",  "memory":          "B3",  "personality": "B3",
    "therapy":         "B3",  "freud":           "B3",  "jung":        "B3",

    # Linguistics
    "language":        "B4",  "grammar":         "B4",  "syntax":      "B4",
    "phonology":       "B4",  "semantics":       "B4",  "translation": "B4",
    "discourse":       "B4",  "pragmatics":      "B4",  "corpus":      "B4",

    # Geography
    "geography":       "B5",  "climate":         "B5",  "geopolitics": "B5",
    "cartography":     "B5",  "landscape":       "B5",  "migration":   "B5",
    "urban":           "B5",  "territory":       "B5",  "spatial":     "B5",

    # Economics
    "economics":       "B6",  "market":          "B6",  "finance":     "B6",
    "trade":           "B6",  "game_theory":     "B6",  "GDP":         "B6",
    "microeconomics":  "B6",  "macroeconomics":  "B6",  "behavioral":  "B6",

    # Political Science
    "politics":        "C1",  "democracy":       "C1",  "governance":  "C1",
    "international":   "C1",  "state":           "C1",  "power":       "C1",
    "institution":     "C1",  "diplomacy":       "C1",  "sovereignty": "C1",

    # Law / Jurisprudence
    "law":             "C2",  "legal":           "C2",  "contract":    "C2",
    "constitutional":  "C2",  "criminal":        "C2",  "tort":        "C2",
    "jurisdiction":    "C2",  "statute":         "C2",  "rights":      "C2",

    # Medicine
    "medicine":        "C3",  "disease":         "C3",  "diagnosis":   "C3",
    "treatment":       "C3",  "pharmacology":    "C3",  "anatomy":     "C3",
    "clinical":        "C3",  "pathology":       "C3",  "surgery":     "C3",

    # Astronomy
    "astronomy":       "C4",  "astrophysics":    "C4",  "galaxy":      "C4",
    "star":            "C4",  "black_hole":      "C4",  "telescope":   "C4",
    "exoplanet":       "C4",  "nebula":          "C4",  "redshift":    "C4",

    # Engineering
    "engineering":     "C5",  "design":          "C5",  "structure":   "C5",
    "circuit":         "C5",  "materials":       "C5",  "systems":     "C5",
    "manufacturing":   "C5",  "control":         "C5",  "robotics":    "C5",

    # Arts
    "art":             "C6",  "music":           "C6",  "literature":  "C6",
    "painting":        "C6",  "architecture":    "C6",  "theater":     "C6",
    "cinema":          "C6",  "poetry":          "C6",  "style":       "C6",

    # Environment
    "environment":     "D1",  "ecology":         "D1",  "sustainability":"D1",
    "pollution":       "D1",  "biodiversity":    "D1",  "carbon":      "D1",
    "climate_change":  "D1",  "ecosystem":       "D1",  "conservation":"D1",

    # Culture
    "culture":         "D2",  "society":         "D2",  "anthropology":"D2",
    "ritual":          "D2",  "identity":        "D2",  "tradition":   "D2",
    "myth":            "D2",  "semiotics":       "D2",  "globalization":"D2",
}

SCIENCE_CELLS  = {"A2","A3","A4","A5","A6","C3","C4","C5","D1"}
HUMAN_CELLS    = {"B1","B2","B3","B4","B5","B6","C1","C2","C6","D2"}
```

---

## §3  PATH ENCODING — COMPRESSED SESSION MEMORY

The path through the board IS the session memory. Full reasoning history
encoded in ≤12 characters. This is the core innovation of the Board system.

```python
# Path formats (3 levels of compression):
# Verbose: ["D5", "A1", "A2", "A3", "D3", "D6"]
# Standard: D5·A1·A2·A3·D3·D6
# Ultra:    M·TC·MM·PH·S·O         (using skill symbols)

PATH_SYMBOLS = {
    "D5":"M",  "A1":"TC", "A2":"MM", "A3":"PH", "A4":"CH",  "A5":"BIO",
    "A6":"CS", "B1":"HI", "B2":"PH", "B3":"PS", "B4":"LI",  "B5":"GE",
    "B6":"EC", "C1":"PO", "C2":"LW", "C3":"MD", "C4":"AT",  "C5":"EN",
    "C6":"AR", "D1":"EV", "D2":"CU", "D3":"S",  "D4":"H",   "D6":"O",
}

# Canonical path examples:
EXAMPLE_PATHS = {
    "simple_math":         "M·TC·MM·O",                    # prove a theorem
    "physics_problem":     "M·TC·PH·O",                    # calculate trajectory
    "chemistry_synthesis": "M·TC·CH·O",                    # design a reaction
    "history_essay":       "M·TC·HI·O",                    # analyze historical event
    "legal_analysis":      "M·TC·LW·O",                    # interpret a statute
    "interdisciplinary":   "M·TC·MM·PH·S·O",               # math+physics problem
    "cross_domain":        "M·TC·EC·PO·H·O",               # economics+politics
    "full_science":        "M·TC·MM·PH·CH·BIO·S·O",        # multi-science synthesis
    "humanities_survey":   "M·TC·HI·PH·PS·H·O",            # history+phil+psych
    "complete_analysis":   "M·TC·MM·EC·PO·LW·O",           # math+econ+pol+law
}
```

---

## §4  EXECUTION PROTOCOL (per-cell)

```
Each cell (skill) follows this protocol when entered:

ENTER[cell]:
  1. Load skill file for cell → activate domain expertise
  2. Apply compression arsenal from TC[A1] (always active)
  3. Execute domain-specific attack protocol (§7 of each skill)
  4. If blocked (∇progress ≈ 0): log wall → route to adjacent cell
  5. Produce intermediate result
  6. Log: path += [cell_code]

CHAIN:
  If next_cell needed → ENTER[next_cell] with context from current result
  If synthesis needed → ENTER[D3] or ENTER[D4]

EXIT → D6:
  Apply TC compression to full response
  Format output per active skills' standards
  Append path log: "PATH: M·TC·[cells]·O"
```

---

## §5  ALWAYS-ACTIVE RULES

```python
ALWAYS = {
    "token_compression":  "A1 ALWAYS loaded — all output compressed via TC arsenal",
    "path_logging":       "∀ cell entered: append to session path",
    "cite_dont_hallucinate": "∀ theorem/fact: cite author+year or mark [CITATION_NEEDED]",
    "tools_over_mental":  "∀ deterministic computation: route to tool (Python/PARI/GAP/Z3)",
    "epistemic_audit":    "∀ 20min elapsed OR ∇progress≈0: run audit → pivot or continue",
    "never_compress_cot": "thinking tokens = free CoT; output tokens = compressed",
}

FORBIDDEN = [
    "skip domain classification before routing",
    "compute large instances mentally (→ use tools)",
    "state theorems without citations",
    "emit verbose natural language when formal notation exists",
    "enter D6 without applying TC compression",
    "claim VERIFIED without proof or computational certificate",
]
```

---

## §6  CROSS-DOMAIN SYNTHESIS OPERATORS

```python
# Synthesis cells (D3, D4) implement these operators:
SYNTHESIS_OPS = {
    "restrict":     "A|_sub → simpler problem, same essence",
    "generalise":   "A → A': extra structure unlocks method",
    "transfer":     "method(domain₁) → method(domain₂) via shared invariant",
    "dualise":      "primal ↔ dual (LP/SDP, Pontryagin, legal maxims)",
    "compose":      "A₁ ⊕ A₂: product structure (RSK, Künneth, interdisciplinary)",
    "deform":       "continuous family Aₜ: A₀ known → A₁ target",
    "historicize":  "theorem/law → genealogy → power analysis (Nietzsche/Foucault)",
    "quantize":     "classical → quantum; cultural → archetypal",
}

# Historical cross-domain transfers (verified):
TRANSFERS = [
    ("A2→A3",  "analysis → mechanics",        "Lagrangian/Hamiltonian"),
    ("A3→A4",  "physics → chemistry",         "quantum chem, DFT"),
    ("A4→A5",  "chemistry → biology",         "biochemistry, metabolism"),
    ("A5→A6",  "biology → CS",                "evolutionary algorithms"),
    ("A2→B6",  "math → economics",            "game theory, mechanism design"),
    ("B2→C2",  "philosophy → law",            "natural law, jurisprudence"),
    ("B3→C3",  "psychology → medicine",       "psychosomatic, psychiatry"),
    ("B1→C1",  "history → politics",          "historical institutionalism"),
    ("A6→B6",  "CS → economics",              "computational economics, auctions"),
    ("D2→B2",  "culture → philosophy",        "Hegel Geist, cultural hermeneutics"),
]
```

---

## §7  EPISTEMIC AUDIT (anti-loop)

```python
def audit(path: list, t_min: float) -> str:
    """Execute every 20 minutes OR when ∇(progress) ≈ 0."""
    if path.count(path[-1]) >= 3:
        return "PIVOT: loop → transfer to adjacent cell"
    if len(path) > 8 and "D6" not in path:
        return "PIVOT: too many hops → synthesize now at D3/D4"
    if t_min > 20 and progress_rate() < epsilon:
        return "PIVOT: local min → change synthesis operator"
    return "CONTINUE"
```

---

## §8  QUICK DISPATCH REFERENCE

```
Task type                  → Cell    Skill
──────────────────────────────────────────────────────────────────
Prove / bound / construct  → A2     Mathematician Mind
Physics calculation        → A3     Physicist Mind
Chemical reaction/mol.     → A4     Chemist Mind
Genetics / evolution       → A5     Biologist Mind
Code / algorithm / ML      → A6     Computer Scientist Mind
Historical analysis        → B1     Historian Mind
Ethical / philosophical    → B2     Philosopher Mind
Psychological analysis     → B3     Psychologist Mind
Language / translation     → B4     Linguist Mind
Geographic / spatial       → B5     Geographer Mind
Economic analysis          → B6     Economist Mind
Political / governance     → C1     Political Scientist Mind
Legal / contractual        → C2     Jurist Mind
Medical / clinical         → C3     Medical Mind
Astronomical / cosmolog.   → C4     Astronomer Mind
Engineering / design       → C5     Engineer Mind
Artistic / aesthetic       → C6     Arts Mind
Environmental / climate    → D1     Environmental Mind
Cultural / anthropolog.    → D2     Culture Mind
Multi-science synthesis    → D3     Science Synthesis (chain A/C cells)
Multi-humanities synth.    → D4     Humanities Synthesis (chain B/C cells)
Everything ← always        → A1     Token Compression (ALWAYS ACTIVE)
```

---

*Master Skill v1.0 | Cognitive Skills Engine | Board Navigator*
*Path: D5 (you are here) → classify → route → D6*
