import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const BOARD_CELL_FILES: Record<string, string> = {
    'A1': 'skills/core/token-compression.md',
    'A2': 'skills/science/mathematician-mind.md',
    'A3': 'skills/science/physicist-mind.md',
    'A4': 'skills/science/chemist-mind.md',
    'A5': 'skills/science/biologist-mind.md',
    'A6': 'skills/science/computer-scientist-mind.md',
    'B1': 'skills/humanities/historian-mind.md',
    'B2': 'skills/humanities/philosopher-mind.md',
    'B3': 'skills/humanities/psychologist-mind.md',
    'B4': 'skills/humanities/linguist-mind.md',
    'B5': 'skills/humanities/geographer-mind.md',
    'B6': 'skills/humanities/economist-mind.md',
    'C1': 'skills/humanities/political-scientist-mind.md',
    'C2': 'skills/humanities/jurist-mind.md',
    'C3': 'skills/science/medical-mind.md',
    'C4': 'skills/science/astronomer-mind.md',
    'C5': 'skills/science/engineer-mind.md',
    'C6': 'skills/arts-culture/arts-mind.md',
    'D1': 'skills/arts-culture/environmental-mind.md',
    'D2': 'skills/arts-culture/culture-mind.md',
    'D5': 'MASTER-SKILL.md',
};

export class SkillLoader {
    private readonly skillsRoot: string;
    private readonly customPath: string | undefined;

    constructor(extensionPath: string) {
        this.skillsRoot = extensionPath;
        const config = vscode.workspace.getConfiguration('cse');
        this.customPath = config.get<string>('skillsPath') || undefined;
    }

    async loadSkill(cellCode: string): Promise<string> {
        const relativePath = BOARD_CELL_FILES[cellCode];
        if (!relativePath) {
            return `# Skill [${cellCode}] not found\n\nThis cell has no associated skill file.`;
        }

        // Try custom path first, then extension bundled path
        const searchRoots = [
            this.customPath,
            this.skillsRoot,
            // Also try workspace root
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
        ].filter(Boolean) as string[];

        for (const root of searchRoots) {
            const fullPath = path.join(root, relativePath);
            try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const config = vscode.workspace.getConfiguration('cse');
                if (cellCode !== 'A1' && config.get<boolean>('alwaysInjectTC', true)) {
                    const tcContent = await this.loadSkill('A1');
                    return `<!-- COGNITIVE SKILLS ENGINE: [A1] Token Compression (always active) -->\n\n${tcContent}\n\n---\n\n<!-- SKILL: [${cellCode}] -->\n\n${content}`;
                }
                return content;
            } catch {
                // try next root
            }
        }

        return this.getFallbackContent(cellCode);
    }

    async loadMasterSkill(): Promise<string> {
        return this.loadSkill('D5');
    }

    async loadSkillBundle(cells: string[]): Promise<string> {
        const parts: string[] = [];
        for (const cell of cells) {
            const content = await this.loadSkill(cell);
            parts.push(`<!-- === SKILL [${cell}] === -->\n\n${content}`);
        }
        return parts.join('\n\n---\n\n');
    }

    private getFallbackContent(cellCode: string): string {
        const FALLBACKS: Record<string, string> = {
            'D3': '# Science Synthesis [D3]\n\nMulti-science synthesis cell. Load and chain relevant science skills (A2-A6, C3-C5, D1).',
            'D4': '# Humanities Synthesis [D4]\n\nMulti-humanities synthesis cell. Load and chain relevant humanities skills (B1-B6, C1-C2, C6, D2).',
            'D6': '# Output [D6]\n\nApply Token Compression (A1) to all output. Format and deliver response. Log session path.',
        };
        return FALLBACKS[cellCode] ?? `# Skill [${cellCode}]\n\nSkill file not found. Check skills/ directory.`;
    }
}
