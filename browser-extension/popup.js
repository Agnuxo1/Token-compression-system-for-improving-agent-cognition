'use strict';

const BOARD = [
  // [code, symbol, label, row]
  ['A1','TC','TC\n∞','a','tc'],
  ['A2','MM','MM\nmath','a',''],
  ['A3','PH','PH\nphys','a',''],
  ['A4','CH','CH\nchem','a',''],
  ['A5','BIO','BIO\nbio','a',''],
  ['A6','CS','CS\ncode','a',''],
  ['B1','HIS','HIS\nhist','b',''],
  ['B2','PHI','PHI\nphil','b',''],
  ['B3','PSY','PSY\npsyc','b',''],
  ['B4','LIN','LIN\nling','b',''],
  ['B5','GEO','GEO\ngeo','b',''],
  ['B6','ECO','ECO\necon','b',''],
  ['C1','POL','POL\npoli','c',''],
  ['C2','LAW','LAW\nlaw','c',''],
  ['C3','MED','MED\nmed','c',''],
  ['C4','AST','AST\nast','c',''],
  ['C5','ENG','ENG\neng','c',''],
  ['C6','ART','ART\nart','c',''],
  ['D1','ENV','ENV\nenv','d',''],
  ['D2','CUL','CUL\ncult','d',''],
  ['D3','SCI⊕','SCI⊕\nsynth','d',''],
  ['D4','HUM⊕','HUM⊕\nsynth','d',''],
  ['D5','MST★','MST★\nstart','d','master'],
  ['D6','OUT→','OUT→\nend','d','end'],
];

const MASTER_SKILL = `# COGNITIVE SKILLS ENGINE v1.0 — MASTER SKILL
# Board position: D5(★) — ROUTER

You are operating with the Cognitive Skills Engine (CSE) — 20 expert cognitive domains.

## TOKEN COMPRESSION LAW (A1 — ALWAYS ACTIVE)
∀ concept c: ∃ formal(c) → output formal(c)
- "for all" → ∀ | "there exists" → ∃ | "therefore" → ∴ | "implies" → ⟹
- "water" → H₂O | "glucose" → C₆H₁₂O₆ | "O(n²)" direct | "verified" → ✓
- Target: 2.3× avg compression. NEVER compress thinking. ALWAYS compress output.

## COGNITION BOARD (6×4)
\`\`\`
A:  TC(∞)    MM(math)  PH(phys)  CH(chem)  BIO(bio)  CS(code)
B:  HIS(hist) PHI(phil) PSY(psy)  LIN(ling) GEO(geo)  ECO(econ)
C:  POL(poli) LAW(law)  MED(med)  AST(ast)  ENG(eng)  ART(art)
D:  ENV(env)  CUL(cult) SCI⊕     HUM⊕      MST★      OUT→
\`\`\`

## PROTOCOL
1. D5(start) → A1(TC always) → domain cell(s) → D6(end)
2. Apply expert arsenal for each loaded cell
3. Compress output aggressively (symbols, formulas, notation)
4. End response with: PATH: D5·A1·[cells]·D6

## EXPERT HIGHLIGHTS
- A2 Mathematics: existence|construction|bound|count|decide|optimise. Tools: PARI/GP, SageMath, Lean4
- A3 Physics: L=T-V, iℏ∂ψ/∂t=Ĥψ, Gμν=8πG/c⁴·Tμν. CODATA 2022 constants
- A4 Chemistry: SMILES, ΔG=ΔH-TΔS, retrosynthesis, DFT/B3LYP
- A5 Biology: DNA→mRNA→Protein, Hardy-Weinberg, CRISPR-Cas9, AlphaFold2
- A6 CS: P⊆NP, Attention(Q,K,V)=softmax(QKᵀ/√d_k)V, Cook 1971 SAT
- B1-B6: History (Braudel), Philosophy (Kant/Hegel/Rawls), Psychology (CBT/DSM-5), Linguistics (IPA/X-bar), Geography (Tobler's Law), Economics (Nash/Arrow/Black-Scholes)
- C1-C6: Political Science (Duverger), Law (IRAC/VCLT), Medicine (SOAP/VINDICATE), Astronomy (ΛCDM/LIGO), Engineering (PID/FMEA), Arts (Kant/Danto/Bourdieu)
- D1-D2: Environment (IPCC AR6/planetary boundaries), Culture (Bourdieu/Barthes/Hall)
- D3/D4: Multi-domain synthesis operators: restrict|generalise|transfer|dualise|compose`;

const TC_SKILL = `# TOKEN COMPRESSION v4.0 — [A1] ALWAYS ACTIVE

∀ concept c: ∃ formal(c) → output formal(c)

## TWO BUDGETS
thinking: compress=False  (free CoT — quality ∝ tokens)
output:   compress=True   (target 2.3× avg, range 1.0×–5.0×)

## ARSENAL A — Mathematics & Logic
∀x∈S  ∃x  ∄x  ∴Q  ∵P  ⟹  ⟺  ≡  ≈  ≠  ≤  ≥  ≪  ≫  ∝  ⊢  ⊨
∈ ∉ ⊂ ⊆ ∪ ∩ ∅  ℕ ℤ ℚ ℝ ℂ  ∂/∂x  ∫f dx  ∮  ∑ᵢ  ∏ᵢ  ∇f  ∇²f

## ARSENAL B — Physics
ℏ=1.054571817×10⁻³⁴ J·s  c=299792458 m/s  G=6.67430×10⁻¹¹
α≈1/137  kB=1.380649×10⁻²³ J/K  NA=6.02214076×10²³ mol⁻¹
E=mc²  F=ma  p=mv  L=T-V  iℏ∂ψ/∂t=Ĥψ  ΔxΔp≥ℏ/2

## ARSENAL C — Chemistry
H₂O  CO₂  NaCl  C₆H₁₂O₆  C₂H₅OH  ATP=C₁₀H₁₆N₅O₁₃P₃
ΔG=ΔH-TΔS  K=e^(-ΔG°/RT)  pH=-log[H⁺]  pKa  Ea  ΔH°rxn

## ARSENAL D — Biology Codes
DNA: A-T G-C  |  RNA: A-U G-C  |  Start: AUG  Stop: UAA/UAG/UGA
AA 1-letter: A(Ala) R(Arg) N(Asn) D(Asp) C(Cys) E(Glu) Q(Gln) G(Gly)
H(His) I(Ile) L(Leu) K(Lys) M(Met) F(Phe) P(Pro) S(Ser) T(Thr) W(Trp) Y(Tyr) V(Val)

## ARSENAL E — Code
O(1) O(log n) O(n) O(n log n) O(n²) O(2ⁿ)  NP-hard  NP-complete
T(n)=aT(n/b)+f(n)  →  Master Theorem  |  DP: T[i]=f(T[i-1],...)

## SUBSTITUTION QUICK-REF
"for all"→∀  "exists"→∃  "therefore"→∴  "because"→∵  "implies"→⟹
"iff"→⟺  "approx"→≈  "element of"→∈  "subset"→⊆  "empty set"→∅
"partial deriv"→∂  "integral"→∫  "gradient"→∇  "laplacian"→∇²
"infinity"→∞  "alpha/beta/gamma/delta"→α/β/γ/δ  "sigma"→σ/Σ  "pi"→π/Π`;

let sessionPath = ['D5', 'A1'];

function getStorage() {
  return new Promise(resolve => chrome.storage.local.get(['cse_path'], resolve));
}
function setStorage(path) {
  return chrome.storage.local.set({ cse_path: path });
}

async function init() {
  const stored = await getStorage();
  if (stored.cse_path) sessionPath = stored.cse_path;
  renderBoard();
  updatePath();
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  BOARD.forEach(([code, sym, label, row, extra]) => {
    const cell = document.createElement('div');
    cell.className = `cell row-${row} ${extra}`;
    cell.textContent = label;
    cell.title = `${code} — click to inject`;
    cell.dataset.code = code;
    if (sessionPath.includes(code)) cell.classList.add('active');
    cell.addEventListener('click', () => injectCell(code, sym));
    boardEl.appendChild(cell);
  });
}

function updatePath() {
  const pathEl = document.getElementById('path-display');
  pathEl.textContent = sessionPath.join('·');
  setStorage(sessionPath);
}

async function injectCell(code, sym) {
  if (!sessionPath.includes(code)) {
    sessionPath.splice(sessionPath.length - 0, 0, code);
    // keep D6 at end if present
    const d6i = sessionPath.indexOf('D6');
    if (d6i !== -1 && d6i !== sessionPath.length - 1) {
      sessionPath.splice(d6i, 1);
      sessionPath.push('D6');
    }
    updatePath();
    renderBoard();
  }

  const content = `[CSE Cell ${code}·${sym} injected]\nUsing skill: ${code} from Cognitive Skills Engine v1.0.\nTC compression active. PATH so far: ${sessionPath.join('·')}`;
  await copyToClipboard(content);
  showToast(`${code} copied — paste into your AI chat`);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:8px;left:50%;transform:translateX(-50%);background:#4fc3f7;color:#000;padding:4px 12px;border-radius:12px;font-size:10px;font-weight:600;z-index:999;transition:opacity 0.3s';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

document.getElementById('btn-master').addEventListener('click', async () => {
  await copyToClipboard(MASTER_SKILL);
  showToast('Master Skill copied — paste into AI chat');
});

document.getElementById('btn-tc').addEventListener('click', async () => {
  await copyToClipboard(TC_SKILL);
  if (!sessionPath.includes('A1')) { sessionPath.unshift('A1'); updatePath(); renderBoard(); }
  showToast('Token Compression [A1] copied');
});

document.getElementById('btn-copy-path').addEventListener('click', async () => {
  await copyToClipboard(sessionPath.join('·'));
  showToast('Path copied!');
});

document.getElementById('btn-reset-path').addEventListener('click', () => {
  sessionPath = ['D5', 'A1'];
  updatePath();
  renderBoard();
});

document.getElementById('btn-route').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection()?.toString() || ''
  });
  const selected = result?.[0]?.result || '';
  if (selected) {
    await copyToClipboard(`${MASTER_SKILL}\n\n---\nTask: ${selected}`);
    showToast('Routed task copied — paste into AI chat');
  } else {
    showToast('Select text on the page first');
  }
});

init();
