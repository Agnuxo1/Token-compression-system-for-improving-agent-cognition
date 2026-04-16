"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardViewProvider = void 0;
const vscode = __importStar(require("vscode"));
class BoardViewProvider {
    constructor(extensionUri, cells, loader) {
        this.extensionUri = extensionUri;
        this.cells = cells;
        this.loader = loader;
    }
    resolveWebviewView(webviewView) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri],
        };
        webviewView.webview.html = this.getHtml(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (msg) => {
            if (msg.command === 'injectCell') {
                vscode.commands.executeCommand('cse.injectByCode', msg.code);
            }
            else if (msg.command === 'previewCell') {
                const content = await this.loader.loadSkill(msg.code);
                vscode.workspace.openTextDocument({ content, language: 'markdown' })
                    .then(doc => vscode.window.showTextDocument(doc, vscode.ViewColumn.Two));
            }
            else if (msg.command === 'routeTask') {
                vscode.commands.executeCommand('cse.routeTask');
            }
        });
    }
    getHtml(webview) {
        const nonce = getNonce();
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy"
      content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cognition Board</title>
<style nonce="${nonce}">
  body { font-family: var(--vscode-font-family); font-size: 11px;
         background: var(--vscode-editor-background); color: var(--vscode-editor-foreground);
         margin: 0; padding: 8px; }
  h3 { font-size: 12px; margin: 0 0 8px; color: var(--vscode-titleBar-activeForeground); letter-spacing: 1px; }
  .board { display: grid; grid-template-columns: 20px repeat(6, 1fr); gap: 2px; margin-bottom: 8px; }
  .header-row { display: contents; }
  .col-label { display: flex; align-items: center; justify-content: center;
               font-weight: bold; color: var(--vscode-descriptionForeground); font-size: 9px; }
  .row-label { display: flex; align-items: center; justify-content: center;
               font-weight: bold; color: var(--vscode-descriptionForeground); font-size: 10px; }
  .cell { padding: 4px 2px; border: 1px solid var(--vscode-widget-border);
          border-radius: 3px; cursor: pointer; text-align: center; transition: all 0.15s;
          background: var(--vscode-editor-inactiveSelectionBackground); }
  .cell:hover { background: var(--vscode-list-hoverBackground); border-color: var(--vscode-focusBorder); }
  .cell.core   { border-left: 2px solid #4fc3f7; }
  .cell.science { border-left: 2px solid #81c784; }
  .cell.humanities { border-left: 2px solid #ffb74d; }
  .cell.culture { border-left: 2px solid #ce93d8; }
  .cell.master { border: 2px solid var(--vscode-focusBorder); background: var(--vscode-editor-selectionBackground); }
  .cell.synth  { border-left: 2px dashed var(--vscode-descriptionForeground); }
  .code { font-weight: bold; font-size: 9px; color: var(--vscode-textPreformat-foreground); }
  .sym  { font-size: 11px; font-weight: bold; display: block; margin: 1px 0; }
  .desc { font-size: 8px; color: var(--vscode-descriptionForeground); line-height: 1.2; }
  .controls { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px; }
  button { background: var(--vscode-button-background); color: var(--vscode-button-foreground);
           border: none; padding: 4px 8px; border-radius: 2px; cursor: pointer; font-size: 10px; }
  button:hover { background: var(--vscode-button-hoverBackground); }
  .legend { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; font-size: 9px; }
  .legend-item { display: flex; align-items: center; gap: 3px; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
  .path-display { margin-top: 6px; padding: 4px 6px;
                  background: var(--vscode-textBlockQuote-background);
                  border-left: 3px solid var(--vscode-focusBorder);
                  font-family: monospace; font-size: 10px; border-radius: 0 2px 2px 0; }
</style>
</head>
<body>
<h3>⬡ COGNITION BOARD v1.0</h3>
<div class="board" id="board"></div>
<div class="legend">
  <span class="legend-item"><span class="legend-dot" style="background:#4fc3f7"></span>Core</span>
  <span class="legend-item"><span class="legend-dot" style="background:#81c784"></span>Science</span>
  <span class="legend-item"><span class="legend-dot" style="background:#ffb74d"></span>Humanities</span>
  <span class="legend-item"><span class="legend-dot" style="background:#ce93d8"></span>Culture</span>
</div>
<div class="controls">
  <button onclick="routeTask()">⚡ Auto-Route Task</button>
  <button onclick="injectMaster()">★ Master Skill</button>
  <button onclick="injectTC()">⊗ Token Compression</button>
</div>
<div class="path-display" id="pathDisplay">Path: D5</div>

<script nonce="${nonce}">
const vscode = acquireVsCodeApi();
const state = vscode.getState() || { path: ['D5'] };
let sessionPath = state.path;

const CELLS = ${JSON.stringify(this.cells)};

const BOARD_LAYOUT = [
  ['', '1',  '2',  '3',  '4',  '5',  '6'],
  ['A','A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
  ['B','B1', 'B2', 'B3', 'B4', 'B5', 'B6'],
  ['C','C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
  ['D','D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
];

const SPECIAL = {
  'D3': { sym: 'SCI⊕', desc: 'Science Synthesis', cls: 'synth' },
  'D4': { sym: 'HUM⊕', desc: 'Humanities Synth.', cls: 'synth' },
  'D5': { sym: '★MST', desc: 'MASTER (start here)', cls: 'master' },
  'D6': { sym: '□OUT', desc: 'Output (end here)', cls: 'synth' },
};

function buildBoard() {
  const board = document.getElementById('board');
  for (const row of BOARD_LAYOUT) {
    for (const cell of row) {
      const el = document.createElement('div');
      if (!cell || (cell.length === 1 && isNaN(Number(cell)))) {
        // Row label
        el.className = 'row-label';
        el.textContent = cell;
      } else if (!isNaN(Number(cell))) {
        // Col label
        el.className = 'col-label';
        el.textContent = cell;
      } else if (SPECIAL[cell]) {
        const s = SPECIAL[cell];
        el.className = 'cell ' + s.cls;
        el.innerHTML = \`<span class="code">\${cell}</span><span class="sym">\${s.sym}</span><span class="desc">\${s.desc}</span>\`;
        if (cell !== 'D6') {
          el.onclick = () => injectCell(cell);
          el.title = 'Click to inject';
        }
      } else if (CELLS[cell]) {
        const c = CELLS[cell];
        el.className = 'cell ' + c.row;
        el.innerHTML = \`<span class="code">\${cell}</span><span class="sym">\${c.symbol}</span><span class="desc">\${c.name.replace(' Mind','')}</span>\`;
        el.onclick = () => injectCell(cell);
        el.ondblclick = () => previewCell(cell);
        el.title = \`Click: inject | Dblclick: preview — \${c.name}\`;
      } else {
        el.className = 'row-label';
      }
      board.appendChild(el);
    }
  }
}

function injectCell(code) {
  vscode.postMessage({ command: 'injectCell', code });
  if (sessionPath[sessionPath.length-1] !== code) {
    sessionPath.push(code);
    vscode.setState({ path: sessionPath });
    updatePathDisplay();
  }
}

function previewCell(code) {
  vscode.postMessage({ command: 'previewCell', code });
}

function injectMaster() { injectCell('D5'); }
function injectTC()     { injectCell('A1'); }
function routeTask()    { vscode.postMessage({ command: 'routeTask' }); }

function updatePathDisplay() {
  document.getElementById('pathDisplay').textContent = 'Path: ' + sessionPath.join('·');
}

buildBoard();
updatePathDisplay();
</script>
</body>
</html>`;
    }
}
exports.BoardViewProvider = BoardViewProvider;
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
