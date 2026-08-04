import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const irPath = join(root, 'docs/interface/kad-community-interface.ir.json');
const publicContentIrPath = join(root, 'docs/public-content-system/interface-ir.json');
const programFixturePath = join(root, 'src/content/community-site.ts');
const publicContentPath = join(root, 'src/content/public-content.ts');
const stagingFixturePath = join(root, 'src/content/staging-fixtures.ts');
const stagingMode = process.env.PUBLIC_STAGING_FIXTURES === 'true';

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

const approvedLocalPosters = {
  '/images/programs/french-club-trial-2026-08-02.webp': '547cc84cc3d5fe76502701b56e2b0ea74fa4f4c0dc3cf28940c42a09ecd05bc2',
  '/images/programs/mandarin-transport-2026-08-01.webp': 'e021a8fe8eb8a3d43adfb6c193e6290f795d43028bf7cc0721429409191fe5a1',
  '/images/programs/apple-developer-academy-2027-info-session.webp': '5c17b45927e24c8f0b0cee0bc3a1b0be30baa02099041fd884586290ec90e28e',
  '/images/programs/english-study-club-weekly-2026-07.webp': 'dd8e0cef2fe909b5faf3071f13d5286000ef76daf2e671db6023a882de9629cb',
  '/images/programs/mandarin-study-club-weekly-2026-07.webp': '4d81ce9813ac93081c2612b0896d7ffc5575ed03e1ff96a534d9b68570739a3b',
};
const requiredLocalPosterPaths = Object.keys(approvedLocalPosters);

const forbiddenRuntimePatterns = [
  { label: 'Twitter CDN media', pattern: /https?:\/\/(?:pbs\.)?twimg\.com\//i },
  { label: 'Discord CDN/private media', pattern: /https?:\/\/(?:media|cdn)\.discord(?:app)?\.com\//i },
  { label: 'Discord channel/message URL', pattern: /https?:\/\/(?:www\.)?(?:discord(?:app)?\.com)\/(?:channels|message|messages)\//i },
  { label: 'old Discord invite', pattern: /https?:\/\/discord\.com\/invite\/KaburAjaDulu/i },
  { label: 'private Discord identifier field', pattern: /discord_(?:message|announcement_message|scheduled_event)_id|announcement_channel_id|host_voice_channel_id/i },
  { label: 'research manifest filename', pattern: /source-manifest\.json/i },
  { label: 'private fixture identifier field', pattern: /discord[_-](?:id|message|channel)|(?:privateMetric|private_metric|demographics)\s*[:=]/i },
];
const fixtureIdPattern = /demo-(?:event|session|volunteer|contribution|metric|record|preview|consent)-[a-z0-9-]+/i;

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

const [irRaw, publicContentIrRaw, programFixture, publicContentSource, stagingFixture, distStat] = await Promise.all([
  readFile(irPath, 'utf8'),
  readFile(publicContentIrPath, 'utf8'),
  readFile(programFixturePath, 'utf8'),
  readFile(publicContentPath, 'utf8'),
  readFile(stagingFixturePath, 'utf8'),
  stat(distDir).catch(() => null),
]);

let ir;
let publicContentIr;
try {
  ir = JSON.parse(irRaw);
  publicContentIr = JSON.parse(publicContentIrRaw);
} catch (error) {
  fail(`invalid IR JSON: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const programPosterMedia = Array.isArray(ir.media)
  ? ir.media.filter((media) => media.id.startsWith('program_poster_'))
  : [];
const programCollection = Array.isArray(ir.components)
  ? ir.components.find((component) => component.id === 'program_collection')
  : null;
const gksMedia = Array.isArray(ir.media)
  ? ir.media.find((media) => media.id === 'gks_third_party_media')
  : null;

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
  ['five approved local poster records', programPosterMedia.length === 5 && programPosterMedia.every((media) => media.type === 'image' && media.implementation_safe === true && typeof media.src === 'string')],
  ['four image-bearing programs', programCollection?.props?.image_program_count === 4],
  ['English + Mandarin gallery count=2', programCollection?.props?.gallery_image_count === 2],
  ['GKS third-party media forbidden', gksMedia?.type === 'none' && gksMedia?.implementation_safe === false],
];
for (const [label, passed] of irChecks) if (!passed) fail(`IR missing ${label}`);

const publicContentChecks = [
  ['kind=interface-ir', publicContentIr.kind === 'interface-ir'],
  ['schema_version=1.0', publicContentIr.schema_version === '1.0'],
  ['category filter component', publicContentIr.components?.some((component) => component.id === 'category_filter')],
  ['program list component', publicContentIr.components?.some((component) => component.id === 'program_list')],
  ['program detail component', publicContentIr.components?.some((component) => component.id === 'program_detail')],
  ['needs-confirmation initial state', publicContentIr.states?.some((state) => state.id === 'program_status' && state.initial === 'needs-confirmation')],
  ['repository interface', publicContentSource.includes('interface PublicContentRepository')],
  ['public DTO schema version', publicContentSource.includes('schemaVersion: 1')],
  ['public provenance field', publicContentSource.includes('publicProvenance')],
  ['repository result lifecycle', publicContentSource.includes("RepositoryState = 'loading' | 'ready' | 'empty' | 'stale' | 'error'")],
  ['public projection excludes Discord fields', !/discord(?:Id|_id|Message|Channel)|consent(?:Id|_id)|authority(?:Id|_id)/.test(publicContentSource)],
];
for (const [label, passed] of publicContentChecks) if (!passed) fail(`public content contract missing ${label}`);

const files = await walk(distDir);
const runtimeFiles = files.filter((file) => /\.(?:html|js|css|json)$/i.test(file));
const runtime = new Map();
for (const file of runtimeFiles) runtime.set(relative(distDir, file), await readFile(file, 'utf8'));
const html = [...runtime.entries()].filter(([file]) => file.endsWith('.html'));
const htmlText = html.map(([, content]) => content).join('\n');
const programsHtml = runtime.get('programs/index.html') ?? '';
const languageProgramsHtml = runtime.get('programs/category/language/index.html') ?? '';
const careerProgramsHtml = runtime.get('programs/category/career/index.html') ?? '';
const weeklyDetailHtml = runtime.get('programs/english-mandarin-weekly-clubs/index.html') ?? '';
const staleProgramsHtml = runtime.get('design-preview/programs/stale/index.html') ?? '';
const errorProgramsHtml = runtime.get('design-preview/programs/error/index.html') ?? '';

for (const route of requiredRoutes) {
  const file = route === '/' ? 'index.html' : `${route.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
  if (!runtime.has(file)) fail(`required route missing from dist: ${route} (${file})`);
}

const programRuntimeChecks = [
  ['Programs page family', programsHtml.includes('data-page-family="programs"')],
  ['five public Program records', (programsHtml.match(/<li data-program-record/g) ?? []).length === 5],
  ['five needs-confirmation labels', (programsHtml.match(/data-program-availability="needs_confirmation"/g) ?? []).length === 5],
  ['three URL category filters', (programsHtml.match(/data-program-filter="/g) ?? []).length === 3],
  ['language category route', (languageProgramsHtml.match(/<li data-program-record/g) ?? []).length === 3],
  ['career category route', (careerProgramsHtml.match(/<li data-program-record/g) ?? []).length === 2],
  ['no repeated task header', !programsHtml.includes('data-page-header="task"')],
  ['Program detail family', weeklyDetailHtml.includes('data-page-family="program-detail"')],
  ['Program detail known/confirmation split', weeklyDetailHtml.includes('Yang sudah diketahui') && weeklyDetailHtml.includes('Yang perlu dikonfirmasi')],
  ['stale lifecycle route', staleProgramsHtml.includes('data-repository-state="stale"') && staleProgramsHtml.includes('data-freshness="stale"')],
  ['recoverable error route', errorProgramsHtml.includes('data-repository-state="error"') && errorProgramsHtml.includes('Coba lagi')],
];
for (const [label, passed] of programRuntimeChecks) if (!passed) fail(`Programs runtime missing ${label}`);

const sourceMatches = [...new Set(canonicalProgramSources.filter((source) => htmlText.includes(source)))];
if (sourceMatches.length !== canonicalProgramSources.length) {
  fail(`canonical program source links found ${sourceMatches.length}/5`);
}

const posterMatches = [...new Set(requiredLocalPosterPaths.filter((path) => htmlText.includes(path)))];
if (posterMatches.length !== requiredLocalPosterPaths.length) {
  fail(`approved local poster paths found ${posterMatches.length}/${requiredLocalPosterPaths.length}`);
}

for (const [posterPath, approvedHash] of Object.entries(approvedLocalPosters)) {
  const builtPosterPath = join(distDir, posterPath.replace(/^\//, ''));
  const poster = await readFile(builtPosterPath).catch(() => null);
  if (!poster) {
    fail(`approved local poster is missing from dist: ${posterPath}`);
    continue;
  }
  const actualHash = createHash('sha256').update(poster).digest('hex');
  if (actualHash !== approvedHash) fail(`approved local poster hash mismatch: ${posterPath}`);
  if (!programFixture.includes(posterPath) || !programFixture.includes(approvedHash)) {
    fail(`poster path/hash is missing from checked content fixture: ${posterPath}`);
  }
}

const imageSources = [...htmlText.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((match) => match[1]);
const externalImageSources = imageSources.filter((src) => /^https?:\/\//i.test(src));
if (externalImageSources.length) {
  fail(`external image src found in dist: ${[...new Set(externalImageSources)].join(', ')}`);
}

if (!stagingMode && !htmlText.includes('data-fixtures="disabled"')) fail('production fixture boundary marker is missing');
if (stagingMode) {
  if (!htmlText.includes('data-fixture-id="demo-preview-fixture-kad-2026"')) fail('staging fixture banner marker is missing');
  if (!htmlText.includes('data-fixture-state="upcoming"')) fail('staging event state marker is missing');
  if (!fixtureIdPattern.test(htmlText)) fail('staging fixture IDs are missing');
  if (!htmlText.includes('Data simulasi') && !htmlText.includes('Demo data')) fail('staging demo label is missing');
  const indexablePages = html
    .filter(([, content]) => !/<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']/i.test(content))
    .map(([file]) => file);
  if (indexablePages.length) fail(`staging pages missing noindex: ${indexablePages.slice(0, 5).join(', ')}`);
} else {
  if (fixtureIdPattern.test(htmlText)) fail('fixture IDs leaked into production runtime');
  if (/Data simulasi|Demo data/.test(htmlText)) fail('demo labels leaked into production runtime');
  if (!htmlText.includes('data-event-count="0"')) fail('production empty event count is missing');
  if (!htmlText.includes('data-event-state="empty"')) fail('production empty event state is missing');
  for (const marker of ['Tinjauan bukti', 'Belum siap', 'Anonim secara bawaan', 'Belum dipublikasikan']) {
    if (!htmlText.includes(marker)) fail(`production readiness marker missing: ${marker}`);
  }
}

if (!stagingFixture.includes('PUBLIC_STAGING_FIXTURES') || !stagingFixture.includes('demo: true')) {
  fail('typed staging fixture boundary is missing');
}
for (const forbiddenField of ['email:', 'discordId', 'channelId', 'messageId', 'avatarUrl', 'demographics']) {
  if (stagingFixture.includes(forbiddenField)) fail(`forbidden fixture field found: ${forbiddenField}`);
}

for (const [file, content] of runtime) {
  for (const { label, pattern } of forbiddenRuntimePatterns) {
    if (pattern.test(content)) fail(`${label} found in dist/${file}`);
  }
}

if (process.exitCode) process.exit(1);
console.log(`INTERFACE_RUNTIME_PASS routes=${requiredRoutes.length} programs=${sourceMatches.length} files=${runtimeFiles.length}`);
