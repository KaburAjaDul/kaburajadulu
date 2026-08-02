import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const irPath = join(root, 'docs/interface/kad-community-interface.ir.json');

const requiredRoutes = [
  '/',
  '/community/',
  '/programs/',
  '/events/',
  '/volunteer/',
  '/stories/',
  '/about/history/',
  '/community/impact/',
  '/support/',
  '/community/credits/',
];

const canonicalProgramSources = [
  'https://x.com/KADSocialHub/status/2083791105590784033',
  'https://x.com/KADSocialHub/status/2083159775362302137',
  'https://x.com/KADSocialHub/status/2082436751105388905',
  'https://x.com/KADSocialHub/status/2080532059408490846',
  'https://x.com/KADSocialHub/status/2080283341807604175',
];

const forbiddenRuntimePatterns = [
  { label: 'Twitter CDN media', pattern: /https?:\/\/(?:pbs\.)?twimg\.com\//i },
  { label: 'Discord channel/message URL', pattern: /https?:\/\/(?:www\.)?(?:discord(?:app)?\.com)\/(?:channels|message|messages)\//i },
  { label: 'old Discord invite', pattern: /https?:\/\/discord\.com\/invite\/KaburAjaDulu/i },
  { label: 'private Discord identifier field', pattern: /discord_(?:message|announcement_message|scheduled_event)_id|announcement_channel_id|host_voice_channel_id/i },
  { label: 'research manifest filename', pattern: /source-manifest\.json/i },
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

function fail(message) {
  console.error(`INTERFACE_RUNTIME_FAIL ${message}`);
  process.exitCode = 1;
}

const [irRaw, distStat] = await Promise.all([
  readFile(irPath, 'utf8'),
  stat(distDir).catch(() => null),
]);

let ir;
try {
  ir = JSON.parse(irRaw);
} catch (error) {
  fail(`invalid IR JSON: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

if (!distStat?.isDirectory()) {
  fail(`built dist directory is missing: ${relative(root, distDir)}`);
  process.exit(1);
}

const irChecks = [
  ['kind=interface-ir', ir.kind === 'interface-ir'],
  ['schema_version=1.0', ir.schema_version === '1.0'],
  ['no absolute local paths', !/\/(?:Users|home)\/[^/]+\//i.test(irRaw)],
  ['semantic-navigation capability', Boolean(ir.capabilities?.['semantic-navigation'])],
  ['source-provenance capability', Boolean(ir.capabilities?.['source-provenance'])],
  ['responsive-recomposition capability', Boolean(ir.capabilities?.['responsive-recomposition'])],
  ['mobile_menu state', Boolean(ir.states?.some((state) => state.id === 'mobile_menu'))],
  ['event_feed state', Boolean(ir.states?.some((state) => state.id === 'event_feed'))],
  ['program_availability state', Boolean(ir.states?.some((state) => state.id === 'program_availability'))],
];
for (const [label, passed] of irChecks) if (!passed) fail(`IR missing ${label}`);

const files = await walk(distDir);
const runtimeFiles = files.filter((file) => /\.(?:html|js|css|json)$/i.test(file));
const runtime = new Map();
for (const file of runtimeFiles) runtime.set(relative(distDir, file), await readFile(file, 'utf8'));
const html = [...runtime.entries()].filter(([file]) => file.endsWith('.html'));
const htmlText = html.map(([, content]) => content).join('\n');

for (const route of requiredRoutes) {
  const file = route === '/' ? 'index.html' : `${route.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
  if (!runtime.has(file)) fail(`required route missing from dist: ${route} (${file})`);
}

const sourceMatches = [...new Set(canonicalProgramSources.filter((source) => htmlText.includes(source)))];
if (sourceMatches.length !== canonicalProgramSources.length) {
  fail(`canonical program source links found ${sourceMatches.length}/5`);
}

if (!htmlText.includes('data-event-count="0"')) fail('empty event state marker is missing');
if (!htmlText.includes('data-event-state="empty"')) fail('empty event state value is missing');
for (const marker of ['Evidence review', 'Proposed', 'Anonymous by default', 'Not published']) {
  if (!htmlText.includes(marker)) fail(`readiness marker missing: ${marker}`);
}

for (const [file, content] of runtime) {
  for (const { label, pattern } of forbiddenRuntimePatterns) {
    if (pattern.test(content)) fail(`${label} found in dist/${file}`);
  }
}

if (process.exitCode) process.exit(1);
console.log(`INTERFACE_RUNTIME_PASS routes=${requiredRoutes.length} programs=${sourceMatches.length} files=${runtimeFiles.length}`);
