#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function exists(p) { try { return fs.existsSync(p); } catch { return false } }

const repoRoot = process.cwd();
const specDir = path.join(repoRoot, '.specify');

function findFeatureDir() {
  // 1) SPECIFY_FEATURE_DIRECTORY env
  if (process.env.SPECIFY_FEATURE_DIRECTORY) {
    const d = process.env.SPECIFY_FEATURE_DIRECTORY;
    return path.isAbsolute(d) ? d : path.join(repoRoot, d);
  }
  // 2) .specify/feature.json
  const fj = path.join(specDir, 'feature.json');
  if (exists(fj)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(fj, 'utf8'));
      if (cfg.feature_directory) {
        const d = cfg.feature_directory;
        return path.isAbsolute(d) ? d : path.join(repoRoot, d);
      }
    } catch (e) {}
  }
  // 3) try to find a candidate under specs/
  const specsDir = path.join(repoRoot, 'specs');
  if (exists(specsDir)) {
    const children = fs.readdirSync(specsDir, { withFileTypes: true }).filter(x=>x.isDirectory()).map(d=>path.join(specsDir,d.name));
    for (const c of children) {
      if (exists(path.join(c,'spec.md'))) return c;
    }
  }
  return null;
}

const FEATURE_DIR = findFeatureDir();
if (!FEATURE_DIR) {
  console.error('ERROR: Feature directory not found. Set SPECIFY_FEATURE_DIRECTORY or create .specify/feature.json');
  process.exit(1);
}

const FEATURE_SPEC = path.join(FEATURE_DIR, 'spec.md');
const IMPL_PLAN = path.join(FEATURE_DIR, 'plan.md');
const TASKS = path.join(FEATURE_DIR, 'tasks.md');
const RESEARCH = path.join(FEATURE_DIR, 'research.md');
const DATA_MODEL = path.join(FEATURE_DIR, 'data-model.md');
const QUICKSTART = path.join(FEATURE_DIR, 'quickstart.md');
const CONTRACTS_DIR = path.join(FEATURE_DIR, 'contracts');

const argv = process.argv.slice(2);
const opts = {
  json: argv.includes('--json') || argv.includes('-Json'),
  requireTasks: argv.includes('--require-tasks') || argv.includes('-RequireTasks'),
  includeTasks: argv.includes('--include-tasks') || argv.includes('-IncludeTasks'),
  pathsOnly: argv.includes('--paths-only') || argv.includes('-PathsOnly')
};

if (!exists(IMPL_PLAN)) {
  console.error(`ERROR: plan.md not found in ${FEATURE_DIR}`);
  console.error('Run /speckit.plan first to create the implementation plan.');
  process.exit(1);
}

if (opts.requireTasks && !exists(TASKS)) {
  console.error(`ERROR: tasks.md not found in ${FEATURE_DIR}`);
  console.error('Run /speckit.tasks first to create the task list.');
  process.exit(1);
}

const docs = [];
if (exists(RESEARCH)) docs.push('research.md');
if (exists(DATA_MODEL)) docs.push('data-model.md');
if (exists(CONTRACTS_DIR) && fs.readdirSync(CONTRACTS_DIR).length>0) docs.push('contracts/');
if (exists(QUICKSTART)) docs.push('quickstart.md');
if (opts.includeTasks && exists(TASKS)) docs.push('tasks.md');

if (opts.pathsOnly) {
  const out = {
    REPO_ROOT: repoRoot,
    BRANCH: process.env.SPECIFY_FEATURE || path.basename(FEATURE_DIR),
    FEATURE_DIR: FEATURE_DIR,
    FEATURE_SPEC: FEATURE_SPEC,
    IMPL_PLAN: IMPL_PLAN,
    TASKS: TASKS
  };
  if (opts.json) console.log(JSON.stringify(out)); else console.log(out);
  process.exit(0);
}

if (opts.json) {
  console.log(JSON.stringify({ FEATURE_DIR: FEATURE_DIR, AVAILABLE_DOCS: docs }));
} else {
  console.log(`FEATURE_DIR:${FEATURE_DIR}`);
  console.log('AVAILABLE_DOCS:');
  if (exists(RESEARCH)) console.log('  [OK] research.md'); else console.log('  [FAIL] research.md');
  if (exists(DATA_MODEL)) console.log('  [OK] data-model.md'); else console.log('  [FAIL] data-model.md');
  if (exists(CONTRACTS_DIR) && fs.readdirSync(CONTRACTS_DIR).length>0) console.log('  [OK] contracts/'); else console.log('  [FAIL] contracts/');
  if (exists(QUICKSTART)) console.log('  [OK] quickstart.md'); else console.log('  [FAIL] quickstart.md');
  if (opts.includeTasks) {
    if (exists(TASKS)) console.log('  [OK] tasks.md'); else console.log('  [FAIL] tasks.md');
  }
}
