#!/usr/bin/env node
/**
 * Cognitive Skills Engine CLI
 * Usage: npx cognitive-skills-engine <command> [args]
 */

const fs   = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const MASTER     = path.join(__dirname, '..', 'MASTER-SKILL.md');
const BOARD      = path.join(__dirname, '..', 'BOARD.md');

const CELL_MAP = {
    'A1': 'core/token-compression.md',
    'A2': 'science/mathematician-mind.md',
    'A3': 'science/physicist-mind.md',
    'A4': 'science/chemist-mind.md',
    'A5': 'science/biologist-mind.md',
    'A6': 'science/computer-scientist-mind.md',
    'B1': 'humanities/historian-mind.md',
    'B2': 'humanities/philosopher-mind.md',
    'B3': 'humanities/psychologist-mind.md',
    'B4': 'humanities/linguist-mind.md',
    'B5': 'humanities/geographer-mind.md',
    'B6': 'humanities/economist-mind.md',
    'C1': 'humanities/political-scientist-mind.md',
    'C2': 'humanities/jurist-mind.md',
    'C3': 'science/medical-mind.md',
    'C4': 'science/astronomer-mind.md',
    'C5': 'science/engineer-mind.md',
    'C6': 'arts-culture/arts-mind.md',
    'D1': 'arts-culture/environmental-mind.md',
    'D2': 'arts-culture/culture-mind.md',
    'D5': '../MASTER-SKILL.md',
};

const SYMBOL_MAP = {
    TC: 'A1', MM: 'A2', PH: 'A3', CH: 'A4', BIO: 'A5', CS: 'A6',
    HIS: 'B1', PHI: 'B2', PSY: 'B3', LIN: 'B4', GEO: 'B5', ECO: 'B6',
    POL: 'C1', LAW: 'C2', MED: 'C3', AST: 'C4', ENG: 'C5', ART: 'C6',
    ENV: 'D1', CUL: 'D2', MST: 'D5',
};

function readSkill(cell) {
    const code = SYMBOL_MAP[cell.toUpperCase()] || cell.toUpperCase();
    const rel  = CELL_MAP[code];
    if (!rel) { return `# Error: Unknown skill "${cell}"\nValid codes: ${Object.keys(CELL_MAP).join(', ')}`; }
    const fullPath = rel.startsWith('../')
        ? path.join(SKILLS_DIR, '..', rel.replace('../', ''))
        : path.join(SKILLS_DIR, rel);
    try { return fs.readFileSync(fullPath, 'utf-8'); }
    catch { return `# Error: Could not read skill file at ${fullPath}`; }
}

function autoRoute(task) {
    const t = task.toLowerCase();
    const cells = new Set();
    const routes = [
        [/\b(prove|theorem|algebra|topology|combinatorics|number theory|geometry|analysis|bound)\b/, 'A2'],
        [/\b(physics|quantum|relativity|mechanics|thermodynamics|entropy|wave|particle)\b/, 'A3'],
        [/\b(chemi|reaction|molecule|synthesis|organic|catalyst|polymer)\b/, 'A4'],
        [/\b(biolog|genetics|evolution|cell|protein|dna|rna|crispr|ecology)\b/, 'A5'],
        [/\b(algorithm|code|ml|machine learning|neural|complexity|data structure)\b/, 'A6'],
        [/\b(histor|ancient|medieval|revolution|war|civilization)\b/, 'B1'],
        [/\b(philosoph|ethics|moral|epistemolog|metaphysics|kant|plato)\b/, 'B2'],
        [/\b(psycholog|cognit|behavior|emotion|memory|personality|therapy)\b/, 'B3'],
        [/\b(linguist|language|grammar|syntax|phonolog|semantics|translation)\b/, 'B4'],
        [/\b(geograph|climate|geopolitic|cartograph|spatial|urban)\b/, 'B5'],
        [/\b(econom|market|finance|trade|game theory|gdp)\b/, 'B6'],
        [/\b(politic|democrac|governance|international|state|diplomacy)\b/, 'C1'],
        [/\b(law|legal|contract|constitutional|criminal|tort)\b/, 'C2'],
        [/\b(medic|disease|diagnos|treatment|pharmacolog|anatomy|clinical)\b/, 'C3'],
        [/\b(astronom|astrophys|galaxy|star|black hole|cosmolog)\b/, 'C4'],
        [/\b(engineer|design|structure|circuit|materials|systems)\b/, 'C5'],
        [/\b(art|music|literature|painting|architecture|theater|aesthetic)\b/, 'C6'],
        [/\b(environment|ecology|sustainab|pollution|biodiversity|carbon)\b/, 'D1'],
        [/\b(culture|society|anthropolog|ritual|identity|semiotic)\b/, 'D2'],
    ];
    for (const [pattern, cell] of routes) {
        if (pattern.test(t)) cells.add(cell);
    }
    if (cells.size === 0) cells.add('A1');
    return ['D5', 'A1', ...cells, 'D6'];
}

const [,, cmd, ...args] = process.argv;

switch (cmd) {
    case 'board':
        console.log(fs.readFileSync(BOARD, 'utf-8'));
        break;

    case 'master':
        console.log(fs.readFileSync(MASTER, 'utf-8'));
        break;

    case 'inject': {
        const cell = args[0];
        if (!cell) { console.error('Usage: cse inject <cell-code|symbol>\nExample: cse inject A2\nExample: cse inject MM'); process.exit(1); }
        const tc = readSkill('A1');
        const skill = readSkill(cell);
        console.log('<!-- A1: Token Compression (always active) -->\n\n' + tc + '\n\n---\n\n<!-- Skill: ' + cell.toUpperCase() + ' -->\n\n' + skill);
        break;
    }

    case 'route': {
        const task = args.join(' ');
        if (!task) { console.error('Usage: cse route "<task description>"'); process.exit(1); }
        const path_arr = autoRoute(task);
        console.log('Auto-route path: ' + path_arr.join('·'));
        console.log('Loading skills for: ' + path_arr.filter(c => c !== 'D5' && c !== 'D6').join(', '));
        for (const cell of path_arr.filter(c => c !== 'D5' && c !== 'D6')) {
            const rel = CELL_MAP[cell];
            if (rel) { console.log('\n' + '='.repeat(60)); console.log(readSkill(cell)); }
        }
        break;
    }

    case 'list':
        console.log('Available skills:');
        for (const [code, rel] of Object.entries(CELL_MAP)) {
            const name = path.basename(rel, '.md').replace('-mind', ' Mind').replace(/-/g, ' ');
            console.log(`  ${code.padEnd(4)} ${name}`);
        }
        break;

    case 'path': {
        // Show a path and its meaning
        const p = args[0] || 'D5·A1·A2·D6';
        const cells = p.split('·');
        console.log('Path: ' + p);
        for (const cell of cells) {
            const rel = CELL_MAP[cell] || CELL_MAP[SYMBOL_MAP[cell]];
            const name = rel ? path.basename(rel, '.md') : cell;
            console.log(`  ${cell} → ${name}`);
        }
        break;
    }

    default:
        console.log(`
Cognitive Skills Engine CLI v1.0
Usage: npx cognitive-skills-engine <command> [args]

Commands:
  board              Show the full Cognition Board
  master             Show the Master Skill (router)
  inject <cell>      Inject skill by cell code (e.g. A2, MM, PH)
  route "<task>"     Auto-route a task to skills and show them
  list               List all available skills
  path [path-str]    Explain a path (e.g. D5·A1·A2·D6)

Examples:
  npx cognitive-skills-engine inject A2
  npx cognitive-skills-engine inject MM
  npx cognitive-skills-engine route "prove the Collatz conjecture"
  npx cognitive-skills-engine route "analyze the French Revolution"
  npx cognitive-skills-engine path D5·A1·A2·A3·D3·D6
`);
}
