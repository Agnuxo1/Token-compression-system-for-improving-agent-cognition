import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { BoardViewProvider } from './boardView';
import { SkillLoader } from './skillLoader';

// Cognition Board cell definitions
const BOARD_CELLS: Record<string, { name: string; file: string; symbol: string; row: string }> = {
    'A1': { name: 'Token Compression',        file: 'core/token-compression.md',             symbol: 'TC',  row: 'core'      },
    'A2': { name: 'Mathematician Mind',         file: 'science/mathematician-mind.md',         symbol: 'MM',  row: 'science'   },
    'A3': { name: 'Physicist Mind',             file: 'science/physicist-mind.md',             symbol: 'PH',  row: 'science'   },
    'A4': { name: 'Chemist Mind',               file: 'science/chemist-mind.md',               symbol: 'CH',  row: 'science'   },
    'A5': { name: 'Biologist Mind',             file: 'science/biologist-mind.md',             symbol: 'BIO', row: 'science'   },
    'A6': { name: 'Computer Scientist Mind',    file: 'science/computer-scientist-mind.md',    symbol: 'CS',  row: 'science'   },
    'B1': { name: 'Historian Mind',             file: 'humanities/historian-mind.md',          symbol: 'HIS', row: 'humanities'},
    'B2': { name: 'Philosopher Mind',           file: 'humanities/philosopher-mind.md',        symbol: 'PHI', row: 'humanities'},
    'B3': { name: 'Psychologist Mind',          file: 'humanities/psychologist-mind.md',       symbol: 'PSY', row: 'humanities'},
    'B4': { name: 'Linguist Mind',              file: 'humanities/linguist-mind.md',           symbol: 'LIN', row: 'humanities'},
    'B5': { name: 'Geographer Mind',            file: 'humanities/geographer-mind.md',         symbol: 'GEO', row: 'humanities'},
    'B6': { name: 'Economist Mind',             file: 'humanities/economist-mind.md',          symbol: 'ECO', row: 'humanities'},
    'C1': { name: 'Political Scientist Mind',   file: 'humanities/political-scientist-mind.md',symbol: 'POL', row: 'humanities'},
    'C2': { name: 'Jurist Mind',                file: 'humanities/jurist-mind.md',             symbol: 'LAW', row: 'humanities'},
    'C3': { name: 'Medical Mind',               file: 'science/medical-mind.md',               symbol: 'MED', row: 'science'   },
    'C4': { name: 'Astronomer Mind',            file: 'science/astronomer-mind.md',            symbol: 'AST', row: 'science'   },
    'C5': { name: 'Engineer Mind',              file: 'science/engineer-mind.md',              symbol: 'ENG', row: 'science'   },
    'C6': { name: 'Arts Mind',                  file: 'arts-culture/arts-mind.md',             symbol: 'ART', row: 'culture'   },
    'D1': { name: 'Environmental Mind',         file: 'arts-culture/environmental-mind.md',    symbol: 'ENV', row: 'culture'   },
    'D2': { name: 'Culture Mind',               file: 'arts-culture/culture-mind.md',          symbol: 'CUL', row: 'culture'   },
    'D5': { name: 'Master Skill',               file: '../../MASTER-SKILL.md',                symbol: 'MST', row: 'core'      },
};

// Session path state
let sessionPath: string[] = ['D5'];
let pathStatusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    const skillLoader = new SkillLoader(context.extensionPath);
    const boardProvider = new BoardViewProvider(context.extensionUri, BOARD_CELLS, skillLoader);

    // Register webview provider for the board
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('cse.boardView', boardProvider)
    );

    // Status bar: shows current path
    pathStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    pathStatusBar.command = 'cse.showPath';
    pathStatusBar.tooltip = 'Cognitive Skills Engine — Current Session Path';
    updatePathStatusBar();
    pathStatusBar.show();
    context.subscriptions.push(pathStatusBar);

    // Register tree view for skill tree
    const skillTreeProvider = new SkillTreeProvider(BOARD_CELLS, skillLoader);
    vscode.window.registerTreeDataProvider('cse.skillTree', skillTreeProvider);

    // Register tree view for path log
    const pathTreeProvider = new PathTreeProvider(sessionPath);
    vscode.window.registerTreeDataProvider('cse.pathLog', pathTreeProvider);

    // ── Commands ──────────────────────────────────────────────────────────

    context.subscriptions.push(
        vscode.commands.registerCommand('cse.openBoard', () => {
            vscode.commands.executeCommand('workbench.view.extension.cognitiveSkillsEngine');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('cse.injectMasterSkill', async () => {
            const content = await skillLoader.loadMasterSkill();
            await deliverContent(content, 'MASTER-SKILL (Full System)');
            addToPath('D5');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('cse.injectTokenCompression', async () => {
            const content = await skillLoader.loadSkill('A1');
            await deliverContent(content, 'Token Compression [A1]');
            addToPath('A1');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('cse.injectSkill', async () => {
            const items = Object.entries(BOARD_CELLS).map(([code, cell]) => ({
                label: `[${code}] ${cell.symbol} — ${cell.name}`,
                description: cell.row,
                code,
            }));

            const picked = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select a skill to inject into context',
                matchOnDescription: true,
            });

            if (picked) {
                const content = await skillLoader.loadSkill(picked.code);
                await deliverContent(content, picked.label);
                addToPath(picked.code);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('cse.injectByCode', async () => {
            const code = await vscode.window.showInputBox({
                prompt: 'Enter board cell code (e.g. A2, B3, C1)',
                placeHolder: 'A2',
                validateInput: (v) => BOARD_CELLS[v.toUpperCase()] ? null : 'Invalid cell code. Use A1-D6.',
            });

            if (code) {
                const upperCode = code.toUpperCase();
                const content = await skillLoader.loadSkill(upperCode);
                await deliverContent(content, `[${upperCode}] ${BOARD_CELLS[upperCode].name}`);
                addToPath(upperCode);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('cse.routeTask', async () => {
            const editor = vscode.window.activeTextEditor;
            const selectedText = editor?.document.getText(editor.selection) ?? '';

            const task = selectedText || await vscode.window.showInputBox({
                prompt: 'Describe your task to auto-route to appropriate skill(s)',
                placeHolder: 'e.g. "prove that Nash equilibria exist" or "analyze the French Revolution"',
            });

            if (!task) { return; }

            const route = autoRoute(task);
            const cells = ['D5', 'A1', ...route, 'D6'];

            const confirm = await vscode.window.showQuickPick(
                [`Inject: ${cells.join('·')}`, 'Cancel'],
                { placeHolder: `Auto-routed path: ${cells.join('·')}` }
            );

            if (confirm && confirm !== 'Cancel') {
                for (const cell of cells.filter(c => c !== 'D5' && c !== 'D6')) {
                    const content = await skillLoader.loadSkill(cell);
                    addToPath(cell);
                    await deliverContent(content, `[${cell}] ${BOARD_CELLS[cell]?.name ?? cell}`);
                }
                addToPath('D6');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('cse.showPath', () => {
            const pathStr = sessionPath.join('·');
            vscode.window.showInformationMessage(`Session Path: ${pathStr}`, 'Copy', 'Reset').then(action => {
                if (action === 'Copy') {
                    vscode.env.clipboard.writeText(pathStr);
                } else if (action === 'Reset') {
                    vscode.commands.executeCommand('cse.resetPath');
                }
            });
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('cse.resetPath', () => {
            sessionPath = ['D5'];
            updatePathStatusBar();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('cse.copyPath', () => {
            vscode.env.clipboard.writeText(sessionPath.join('·'));
            vscode.window.showInformationMessage(`Path copied: ${sessionPath.join('·')}`);
        })
    );

    // Show board on startup if configured
    const config = vscode.workspace.getConfiguration('cse');
    if (config.get('showBoardOnStartup')) {
        vscode.commands.executeCommand('cse.openBoard');
    }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function addToPath(cell: string) {
    if (sessionPath[sessionPath.length - 1] !== cell) {
        sessionPath.push(cell);
        updatePathStatusBar();
    }
}

function updatePathStatusBar() {
    const pathStr = sessionPath.join('·');
    pathStatusBar.text = `$(circuit-board) ${pathStr}`;
}

async function deliverContent(content: string, label: string) {
    const config = vscode.workspace.getConfiguration('cse');
    const mode = config.get<string>('insertMode', 'clipboard');

    if (mode === 'clipboard') {
        await vscode.env.clipboard.writeText(content);
        vscode.window.showInformationMessage(`✓ ${label} copied to clipboard — paste into your chat`);
    } else if (mode === 'cursor') {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.edit(editBuilder => {
                editBuilder.insert(editor.selection.active, content);
            });
        }
    } else if (mode === 'newFile') {
        const doc = await vscode.workspace.openTextDocument({
            content,
            language: 'markdown',
        });
        vscode.window.showTextDocument(doc);
    }
}

// Simple keyword-based auto-router
function autoRoute(task: string): string[] {
    const t = task.toLowerCase();
    const cells: Set<string> = new Set();

    const routes: [RegExp, string][] = [
        [/\b(prove|theorem|lemma|bound|algebra|topology|combinatorics|number theory|geometry|analysis|optimize|diophantine)\b/, 'A2'],
        [/\b(physics|quantum|relativity|mechanics|thermodynamics|electromagnetism|entropy|wave|particle)\b/, 'A3'],
        [/\b(chemi|reaction|molecule|synthesis|organic|catalyst|polymer|crystal|spectroscopy)\b/, 'A4'],
        [/\b(biolog|genetics|evolution|cell|protein|dna|rna|crispr|ecology|metabolism)\b/, 'A5'],
        [/\b(algorithm|code|ml|machine learning|neural|complexity|data structure|distributed|cryptograph)\b/, 'A6'],
        [/\b(histor|ancient|medieval|revolution|war|civilization|empire|dynasty)\b/, 'B1'],
        [/\b(philosoph|ethics|moral|epistemolog|metaphysics|kant|plato|aristotle|ontolog)\b/, 'B2'],
        [/\b(psycholog|cognit|behavior|emotion|memory|personality|therapy|freud|jung)\b/, 'B3'],
        [/\b(linguist|language|grammar|syntax|phonolog|semantics|translation|discourse)\b/, 'B4'],
        [/\b(geograph|climate|geopolitic|cartograph|landscape|spatial|urban|territory)\b/, 'B5'],
        [/\b(econom|market|finance|trade|game theory|gdp|micro|macro|behavioral)\b/, 'B6'],
        [/\b(politic|democrac|governance|international|state|power|institution|diplomacy)\b/, 'C1'],
        [/\b(law|legal|contract|constitutional|criminal|tort|jurisdiction|statute|rights)\b/, 'C2'],
        [/\b(medic|disease|diagnos|treatment|pharmacolog|anatomy|clinical|patholog)\b/, 'C3'],
        [/\b(astronom|astrophys|galaxy|star|black hole|telescope|exoplanet|cosmolog)\b/, 'C4'],
        [/\b(engineer|design|structure|circuit|materials|systems|manufactur|control|robotics)\b/, 'C5'],
        [/\b(art|music|literature|painting|architecture|theater|cinema|poetry|aesthetic)\b/, 'C6'],
        [/\b(environment|ecology|sustainab|pollution|biodiversity|carbon|climate change|ecosystem)\b/, 'D1'],
        [/\b(culture|society|anthropolog|ritual|identity|tradition|myth|semiotic|globali)\b/, 'D2'],
    ];

    for (const [pattern, cell] of routes) {
        if (pattern.test(t)) { cells.add(cell); }
    }

    if (cells.size === 0) { cells.add('A1'); } // default to TC only

    const arr = [...cells];

    // Add synthesis cell if multi-domain
    const scienceCells = new Set(['A2','A3','A4','A5','A6','C3','C4','C5','D1']);
    const humanCells   = new Set(['B1','B2','B3','B4','B5','B6','C1','C2','C6','D2']);
    const hasSci  = arr.some(c => scienceCells.has(c));
    const hasHum  = arr.some(c => humanCells.has(c));

    if (arr.length > 1 && hasSci && !hasHum)  { arr.push('D3'); }
    if (arr.length > 1 && hasHum && !hasSci)  { arr.push('D4'); }

    return arr;
}

// ── Tree Providers ─────────────────────────────────────────────────────────

class SkillTreeProvider implements vscode.TreeDataProvider<SkillItem> {
    constructor(
        private readonly cells: typeof BOARD_CELLS,
        private readonly loader: SkillLoader
    ) {}

    getTreeItem(element: SkillItem): vscode.TreeItem { return element; }

    getChildren(element?: SkillItem): SkillItem[] {
        if (!element) {
            return ['Core', 'Science', 'Humanities', 'Arts & Culture'].map(
                group => new SkillItem(group, vscode.TreeItemCollapsibleState.Collapsed, group)
            );
        }
        const rowMap: Record<string, string> = {
            'Core': 'core', 'Science': 'science', 'Humanities': 'humanities', 'Arts & Culture': 'culture'
        };
        const row = rowMap[element.label as string];
        return Object.entries(this.cells)
            .filter(([, c]) => c.row === row)
            .map(([code, c]) => new SkillItem(
                `[${code}] ${c.symbol} — ${c.name}`,
                vscode.TreeItemCollapsibleState.None,
                row,
                code
            ));
    }
}

class SkillItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly row: string,
        public readonly cellCode?: string
    ) {
        super(label, collapsibleState);
        if (cellCode) {
            this.command = {
                command: 'cse.injectByCode',
                title: 'Inject Skill',
                arguments: [cellCode],
            };
            this.tooltip = `Click to inject skill [${cellCode}] into context`;
            this.contextValue = 'skill';
        }
    }
}

class PathTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    constructor(private readonly path: string[]) {}
    getTreeItem(e: vscode.TreeItem) { return e; }
    getChildren(): vscode.TreeItem[] {
        return this.path.map((cell, i) => {
            const item = new vscode.TreeItem(`${i + 1}. ${cell} — ${BOARD_CELLS[cell]?.name ?? 'Synthesis/Output'}`);
            item.iconPath = new vscode.ThemeIcon(i === 0 ? 'home' : i === this.path.length - 1 ? 'check' : 'arrow-right');
            return item;
        });
    }
}

export function deactivate() {}
