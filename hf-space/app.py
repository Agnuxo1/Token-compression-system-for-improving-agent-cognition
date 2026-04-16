"""
Cognitive Skills Engine — Hugging Face Space
Gradio demo: interactive Cognition Board + skill injection
"""
import gradio as gr
import os
import pathlib

REPO_ROOT = pathlib.Path(__file__).parent.parent

BOARD = {
    "A1": ("TC", "Token Compression", "core/token-compression.md"),
    "A2": ("MM", "Mathematician", "science/mathematician-mind.md"),
    "A3": ("PH", "Physicist", "science/physicist-mind.md"),
    "A4": ("CH", "Chemist", "science/chemist-mind.md"),
    "A5": ("BIO", "Biologist", "science/biologist-mind.md"),
    "A6": ("CS", "Computer Scientist", "science/computer-scientist-mind.md"),
    "B1": ("HIS", "Historian", "humanities/historian-mind.md"),
    "B2": ("PHI", "Philosopher", "humanities/philosopher-mind.md"),
    "B3": ("PSY", "Psychologist", "humanities/psychologist-mind.md"),
    "B4": ("LIN", "Linguist", "humanities/linguist-mind.md"),
    "B5": ("GEO", "Geographer", "humanities/geographer-mind.md"),
    "B6": ("ECO", "Economist", "humanities/economist-mind.md"),
    "C1": ("POL", "Political Scientist", "humanities/political-scientist-mind.md"),
    "C2": ("LAW", "Jurist", "humanities/jurist-mind.md"),
    "C3": ("MED", "Medical Expert", "science/medical-mind.md"),
    "C4": ("AST", "Astronomer", "science/astronomer-mind.md"),
    "C5": ("ENG", "Engineer", "science/engineer-mind.md"),
    "C6": ("ART", "Arts Expert", "arts-culture/arts-mind.md"),
    "D1": ("ENV", "Environmentalist", "arts-culture/environmental-mind.md"),
    "D2": ("CUL", "Cultural Anthropologist", "arts-culture/culture-mind.md"),
    "D5": ("MST★", "Master Router", "../MASTER-SKILL.md"),
}

KEYWORDS = {
    "A2": ["math","proof","theorem","algebra","geometry","calculus","number theory","combinatorics"],
    "A3": ["physics","quantum","relativity","force","energy","wave","field","mechanics","thermodynamics"],
    "A4": ["chemistry","molecule","reaction","organic","acid","base","synthesis","compound","bond"],
    "A5": ["biology","gene","cell","evolution","protein","DNA","RNA","ecology","species"],
    "A6": ["code","algorithm","complexity","software","program","debug","data structure","machine learning","AI"],
    "B1": ["history","historical","century","civilization","war","empire","dynasty","revolution","ancient"],
    "B2": ["philosophy","ethics","logic","mind","consciousness","metaphysics","epistemology","moral","ontology"],
    "B3": ["psychology","behavior","cognitive","mental","therapy","emotion","personality","memory","perception"],
    "B4": ["language","grammar","syntax","linguistics","meaning","phonology","morphology","semantics","discourse"],
    "B5": ["geography","map","climate","spatial","territory","region","landform","migration","urban"],
    "B6": ["economics","market","trade","gdp","finance","price","supply","demand","monetary","fiscal"],
    "C1": ["politics","government","policy","democracy","power","state","election","party","governance"],
    "C2": ["law","legal","rights","court","justice","contract","statute","constitution","crime"],
    "C3": ["medicine","diagnosis","treatment","disease","clinical","symptom","drug","patient","therapy"],
    "C4": ["astronomy","star","galaxy","cosmology","universe","planet","black hole","telescope","orbit"],
    "C5": ["engineering","design","structure","system","circuit","material","mechanics","control","thermal"],
    "C6": ["art","music","aesthetic","culture","creative","literature","painting","architecture","film"],
    "D1": ["environment","climate change","ecology","biodiversity","carbon","ecosystem","species","pollution"],
    "D2": ["culture","anthropology","society","ritual","myth","identity","tradition","ethnography"],
}

def load_skill(code: str) -> str:
    if code not in BOARD:
        return f"# Cell {code} not found"
    _, _, path = BOARD[code]
    full = REPO_ROOT / "skills" / path
    if full.exists():
        return full.read_text(encoding="utf-8")
    master = REPO_ROOT / "MASTER-SKILL.md"
    if code == "D5" and master.exists():
        return master.read_text(encoding="utf-8")
    return f"# {code} skill content\n(File not found at {full})"

def auto_route(task: str) -> list[str]:
    task_l = task.lower()
    path = ["D5", "A1"]
    for code, kws in KEYWORDS.items():
        if any(kw in task_l for kw in kws):
            path.append(code)
    sci = [c for c in path if c[0] in ("A","C")]
    hum = [c for c in path if c[0] == "B"]
    if len(sci) > 2 and "D3" not in path:
        path.append("D3")
    if len(hum) > 2 and "D4" not in path:
        path.append("D4")
    path.append("D6")
    return path

def route_and_build(task: str):
    if not task.strip():
        return "Enter a task above.", "D5·A1·D6"
    path = auto_route(task)
    cells = [c for c in path if c not in ("D5","D6")]
    content_parts = [f"# COGNITIVE SKILLS ENGINE — Routed to: {' + '.join(path)}\n"]
    for c in cells:
        content_parts.append(load_skill(c))
        content_parts.append("\n---\n")
    path_str = "·".join(path)
    content_parts.append(f"\nPATH: {path_str}")
    return "\n".join(content_parts), path_str

def inject_cell(code: str):
    if not code:
        return "Select a cell code", "D5·A1·D6"
    content = "# Token Compression [A1]\n" + load_skill("A1") + "\n---\n"
    if code != "A1":
        content += f"# {code} — {BOARD.get(code, ('?','?','?'))[1]}\n"
        content += load_skill(code)
    content += f"\n\nPATH: D5·A1·{code}·D6"
    return content, f"D5·A1·{code}·D6"

BOARD_HTML = """
<style>
.cse-board { display:grid; grid-template-columns:repeat(6,1fr); gap:4px; max-width:400px; margin:8px 0; }
.cse-cell { padding:6px 2px; border-radius:6px; text-align:center; font-size:11px; font-weight:600; cursor:default; }
.row-a { background:#1a3a4a; color:#4fc3f7; }
.row-b { background:#3a2a0a; color:#ffb74d; }
.row-c { background:#1a3a1a; color:#81c784; }
.row-d { background:#2a1a3a; color:#ce93d8; }
.master { background:#3a2a5a; color:#fff; font-size:13px; }
</style>
<div class="cse-board">
<div class="cse-cell row-a">TC<br><small>∞</small></div>
<div class="cse-cell row-a">MM<br><small>math</small></div>
<div class="cse-cell row-a">PH<br><small>phys</small></div>
<div class="cse-cell row-a">CH<br><small>chem</small></div>
<div class="cse-cell row-a">BIO<br><small>bio</small></div>
<div class="cse-cell row-a">CS<br><small>code</small></div>
<div class="cse-cell row-b">HIS<br><small>hist</small></div>
<div class="cse-cell row-b">PHI<br><small>phil</small></div>
<div class="cse-cell row-b">PSY<br><small>psyc</small></div>
<div class="cse-cell row-b">LIN<br><small>ling</small></div>
<div class="cse-cell row-b">GEO<br><small>geo</small></div>
<div class="cse-cell row-b">ECO<br><small>econ</small></div>
<div class="cse-cell row-c">POL<br><small>poli</small></div>
<div class="cse-cell row-c">LAW<br><small>law</small></div>
<div class="cse-cell row-c">MED<br><small>med</small></div>
<div class="cse-cell row-c">AST<br><small>ast</small></div>
<div class="cse-cell row-c">ENG<br><small>eng</small></div>
<div class="cse-cell row-c">ART<br><small>art</small></div>
<div class="cse-cell row-d">ENV<br><small>env</small></div>
<div class="cse-cell row-d">CUL<br><small>cult</small></div>
<div class="cse-cell row-d">SCI⊕<br><small>synth</small></div>
<div class="cse-cell row-d">HUM⊕<br><small>synth</small></div>
<div class="cse-cell master">★MST<br><small>start</small></div>
<div class="cse-cell row-d">OUT→<br><small>end</small></div>
</div>
"""

with gr.Blocks(
    title="Cognitive Skills Engine",
    theme=gr.themes.Base(primary_hue="blue", neutral_hue="slate"),
    css=".gradio-container { max-width: 900px !important; }"
) as demo:
    gr.Markdown("""
# Cognitive Skills Engine v1.0
**20 expert cognitive skills for LLM agents. Token compression 2.7×.**

[GitHub](https://github.com/Agnuxo1/Token-compression-system-for-improving-agent-cognition) · [VS Code](https://marketplace.visualstudio.com/items?itemName=agnuxo1.cognitive-skills-engine) · `npx cognitive-skills-engine` · `ollama create cognitive-skills -f Modelfile`
""")

    gr.HTML(BOARD_HTML)

    with gr.Tabs():
        with gr.Tab("Auto-Route Task"):
            task_in = gr.Textbox(label="Describe your task", placeholder="e.g. Prove that there are infinitely many primes using topology", lines=3)
            route_btn = gr.Button("Route & Build System Prompt", variant="primary")
            path_out = gr.Textbox(label="Session Path", interactive=False)
            skill_out = gr.Code(label="System Prompt (copy into your LLM)", language="markdown", lines=20)
            route_btn.click(route_and_build, inputs=task_in, outputs=[skill_out, path_out])

        with gr.Tab("Inject Single Skill"):
            cell_dd = gr.Dropdown(
                choices=[(f"{c} — {v[1]}", c) for c, v in BOARD.items()],
                label="Select Skill Cell",
                value="A1"
            )
            inject_btn = gr.Button("Inject Skill", variant="secondary")
            path_out2 = gr.Textbox(label="Session Path", interactive=False)
            skill_out2 = gr.Code(label="Skill Content", language="markdown", lines=20)
            inject_btn.click(inject_cell, inputs=cell_dd, outputs=[skill_out2, path_out2])

        with gr.Tab("About"):
            gr.Markdown("""
## What is CSE?

The **Cognitive Skills Engine** is a system prompt framework that gives LLM agents access to 20 expert cognitive domains, organized on a 6×4 **Cognition Board**.

### How it works
1. Every task starts at **D5 (Master Router)**
2. **A1 (Token Compression)** is always loaded — compresses output ~2.7×
3. The router selects the right expert skill cell(s)
4. Navigation path = compressed session memory: `D5·A1·A2·D6`

### Token Compression Law
```
∀ concept c: ∃ formal(c) → output formal(c)
```
- "for all" → ∀ | "water molecule" → H₂O | "O(n²)" direct
- Two budgets: **thinking=free** | **output=compress aggressively**

### Install
```bash
# VS Code / Cursor / Windsurf
ext install agnuxo1.cognitive-skills-engine

# CLI
npx cognitive-skills-engine board

# Ollama
ollama create cognitive-skills -f Modelfile
ollama run cognitive-skills

# npm
npm install -g cognitive-skills-engine
```
""")

if __name__ == "__main__":
    demo.launch()
