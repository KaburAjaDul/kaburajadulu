import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Build-level IR-to-runtime guard for the KAD public information system.
 *
 * This intentionally checks stable semantic selectors and the production /
 * fixture boundary. It does not replace browser interaction, screenshots, or
 * human hierarchy review.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const irPath = join(root, 'docs/interface/kad-community-interface.ir.json');
const publicContentIrPath = join(root, 'docs/public-content-system/interface-ir.json');
const publicContentPath = join(root, 'src/content/public-content.ts');
const stagingFixturePath = join(root, 'src/content/staging-fixtures.ts');
const stagingMode = process.env.PUBLIC_STAGING_FIXTURES === 'true';

const requiredRoutes = ['/', '/community/', '/programs/', '/events/', '/volunteer/', '/stories/'];
const canonicalProgramSources = [
  'https://x.com/KADSocialHub/status/2083791105590784033',
  'https://x.com/KADSocialHub/status/2083159775362302137',
  'https://x.com/KADSocialHub/status/2082436751105388905',
  'https://x.com/KADSocialHub/status/2080532059408490846',
  'https://x.com/KADSocialHub/status/2080283341807604175',
];

const forbiddenPatterns = [
  ['Twitter CDN media', /https?:\/\/(?:pbs\.)?twimg\.com\//i],
  ['Discord CDN/private media', /https?:\/\/(?:media|cdn)\.discord(?:app)?\.com\//i],
  ['Discord channel/message URL', /https?:\/\/(?:www\.)?discord(?:app)?\.com\/(?:channels|message|messages)\//i],
  ['old Discord invite', /https?:\/\/discord\.com\/invite\/KaburAjaDulu/i],
  ['private Discord identifier field', /discord_(?:message|announcement_message|scheduled_event)_id|announcement_channel_id|host_voice_channel_id/i],
  ['private fixture identifier field', /discord[_-](?:id|message|channel)|(?:privateMetric|private_metric|demographics)\s*[:=]/i],
];
const fixtureIdPattern = /demo-(?:event|session|volunteer|contribution|metric|record|preview|consent|program|series|division|cycle|opportunity)-[a-z0-9-]+/i;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function fail(message) {
  console.error(`INTERFACE_RUNTIME_FAIL ${message}`);
  process.exitCode = 1;
}

function count(text, pattern) {
  return (text.match(pattern) ?? []).length;
}

function has(text, pattern) {
  return typeof pattern === 'string' ? text.includes(pattern) : pattern.test(text);
}

function routeFile(route) {
  return route === '/' ? 'index.html' : `${route.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
}

const [irRaw, publicContentIrRaw, publicContentSource, stagingFixtureSource, distStat] = await Promise.all([
  readFile(irPath, 'utf8'),
  readFile(publicContentIrPath, 'utf8'),
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

if (!distStat?.isDirectory()) {
  fail(`built dist directory is missing: ${relative(root, distDir)}`);
  process.exit(1);
}

const [allFiles, ...routeContents] = await Promise.all([
  walk(distDir),
  ...requiredRoutes.map((route) => readFile(join(distDir, routeFile(route)), 'utf8').catch(() => '')),
]);
const runtimeFiles = allFiles.filter((file) => /\.(?:html|js|css|json)$/i.test(file));
const runtime = new Map();
for (const file of runtimeFiles) runtime.set(relative(distDir, file), await readFile(file, 'utf8'));
const html = [...runtime.entries()].filter(([file]) => file.endsWith('.html'));
const htmlText = html.map(([, content]) => content).join('\n');
const communityHtml = runtime.get('community/index.html') ?? routeContents[1];
const homeHtml = runtime.get('index.html') ?? routeContents[0];
const programsHtml = runtime.get('programs/index.html') ?? routeContents[2];
const agendaHtml = runtime.get('events/index.html') ?? routeContents[3];
const volunteerHtml = runtime.get('volunteer/index.html') ?? routeContents[4];
const storiesHtml = runtime.get('stories/index.html') ?? routeContents[5];

for (const [index, route] of requiredRoutes.entries()) {
  if (!routeContents[index]) fail(`required route missing from dist: ${route} (${routeFile(route)})`);
}

const component = (id) => ir.components?.find((item) => item.id === id);
const irChecks = [
  ['kind=interface-ir', ir.kind === 'interface-ir'],
  ['schema_version=1.0', ir.schema_version === '1.0'],
  ['no absolute local paths', !/(?:^|["'])\/(?:Users\/[^/]+|home\/[^/]+)\//m.test(irRaw)],
  ['community order', JSON.stringify(component('community_overview')?.props?.content_order) === JSON.stringify(['current', 'programs', 'agenda', 'people', 'sources'])],
  ['program structure contract', component('program_catalogue')?.props?.structure === 'Program -> optional Series -> Session'],
  ['staging Agenda union counts', component('agenda_index')?.props?.staging_kind_counts?.session === 3 && component('agenda_index')?.props?.staging_kind_counts?.event === 1],
  ['volunteer organization counts', component('volunteer_directory')?.props?.positions === 4 && component('volunteer_directory')?.props?.divisions === 7 && component('volunteer_directory')?.props?.openings === 3],
  ['profile no impact score', component('volunteer_profile')?.props?.personal_impact_score === false],
  ['compact inner page contract', component('page_heading')?.props?.inner_page_max_rem === 3 && component('page_status_summary')?.props?.landing_hero_only === true],
  ['Field Station paper token', ir.tokens?.color?.paper?.value === '#f5f1e9'],
  ['Field Station cobalt token', ir.tokens?.color?.cobalt?.value === '#155bff'],
  ['Field Station panel radius', ir.tokens?.radius?.panel?.value === 12],
  ['canonical Discord handoff', ir.actions?.some((action) => action.id === 'open_discord' && action.params?.canonical_url === 'https://discord.gg/RUFFbEaeDx')],
  ['safe Discord media boundary', ir.media?.some((media) => media.id === 'discord_private_media' && media.implementation_safe === false)],
];
for (const [label, passed] of irChecks) if (!passed) fail(`IR missing ${label}`);

const publicContentChecks = [
  ['kind=interface-ir', publicContentIr.kind === 'interface-ir'],
  ['schema_version=1.0', publicContentIr.schema_version === '1.0'],
  ['repository interface', publicContentSource.includes('interface PublicContentRepository')],
  ['public DTO schema version', publicContentSource.includes('schemaVersion: 1')],
  ['public provenance field', publicContentSource.includes('publicProvenance')],
  ['repository result lifecycle', publicContentSource.includes("RepositoryState = 'loading' | 'ready' | 'empty' | 'stale' | 'error'")],
  ['public projection excludes private fields', !/discord(?:Id|_id|Message|Channel)|consent(?:Id|_id)|authority(?:Id|_id)/.test(publicContentSource)],
];
for (const [label, passed] of publicContentChecks) if (!passed) fail(`public content contract missing ${label}`);

const communitySections = [...communityHtml.matchAll(/data-community-section=["']([^"']+)["']/g)].map((match) => match[1]);
const communityChecks = [
  ['Community surface', has(communityHtml, 'data-community-surface="overview"')],
  ['Community Field Station marker', has(communityHtml, 'data-field-station="community"')],
  ['Community exact section order', JSON.stringify(communitySections) === JSON.stringify(['current', 'programs', 'agenda', 'people', 'sources'])],
  ['Community heading', has(communityHtml, 'Lihat apa yang sedang dijalankan bersama.')],
  ['Community metric count', count(communityHtml, /data-community-metric=/g) === 3],
  ['Community Program preview count', count(communityHtml, /data-program-record=/g) === 3],
  ['No forbidden legacy labels', !/Pulse|Denyut komunitas/i.test(communityHtml)],
];
for (const [label, passed] of communityChecks) if (!passed) fail(`Community runtime missing ${label}`);

const homeChecks = [
  ['Home Field Station marker', has(homeHtml, 'data-field-station="home"')],
  ['Home one primary action', count(homeHtml, /data-home-primary-action/g) === 1],
  ['Home static canonical Discord handoffs', count(homeHtml, /href="https:\/\/discord\.gg\/RUFFbEaeDx"/g) === 2],
  ['Home city atlas', has(homeHtml, 'data-testid="destination-showcase"')],
];
for (const [label, passed] of homeChecks) if (!passed) fail(`Home runtime missing ${label}`);

const detailHtml = [...runtime.values()].filter((text) => text.includes('data-page-family="program-detail"'))[0] ?? '';
const agendaDetailHtml = [...runtime.values()].filter((text) => text.includes('data-page-header="event-record"'))[0] ?? '';
const volunteerDetailHtml = [...runtime.values()].filter((text) => text.includes('data-volunteer-profile'))[0] ?? '';
const storyDetailHtml = [...runtime.values()].filter((text) => text.includes('data-story-surface="detail"'))[0] ?? '';

const programChecks = [
  ['Programs page family', has(programsHtml, 'data-page-family="programs"')],
  ['five Program records', count(programsHtml, /data-program-record/g) === 5],
  ['Program detail route generated', Boolean(detailHtml)],
  ['Program detail structure marker', has(detailHtml, 'data-program-structure-section') || has(detailHtml, 'data-program-series-list')],
  ['Program metrics marker', has(detailHtml, 'data-program-metrics') || has(detailHtml, 'data-program-metric')],
  ['Program contributor responsibility marker', has(detailHtml, 'data-program-contributors') || has(detailHtml, 'data-contributor-responsibility')],
];
for (const [label, passed] of programChecks) if (!passed) fail(`Programs runtime missing ${label}`);

const agendaChecks = [
  ['Agenda page header', has(agendaHtml, 'data-page-header="schedule"') || has(agendaHtml, 'data-page-header="agenda"')],
  ['Agenda public label', /<h1[^>]*>Agenda<\/h1>/i.test(agendaHtml) || /<h1[^>]*>Agenda\b/i.test(agendaHtml)],
  ['Agenda state marker', has(agendaHtml, 'data-agenda-state=')],
  ['Agenda detail route generated in staging', stagingMode ? Boolean(agendaDetailHtml) : true],
  ['Agenda detail relationship', stagingMode ? (has(agendaDetailHtml, 'data-agenda-kind=') && has(agendaDetailHtml, 'data-agenda-id=')) : true],
];
for (const [label, passed] of agendaChecks) if (!passed) fail(`Agenda runtime missing ${label}`);

const volunteerChecks = [
  ['Volunteer page family', has(volunteerHtml, 'data-page-family="volunteer"')],
  ['Volunteer cycle marker', has(volunteerHtml, 'data-volunteer-cycle')],
  ['four volunteer positions', count(volunteerHtml, /data-volunteer-position/g) === 4],
  ['seven volunteer divisions in staging', stagingMode ? count(volunteerHtml, /data-volunteer-division/g) === 7 : true],
  ['three volunteer openings in staging', stagingMode ? count(volunteerHtml, /data-volunteer-opening/g) === 3 : true],
  ['Volunteer detail route generated in staging', stagingMode ? Boolean(volunteerDetailHtml) : true],
  ['Program-grouped ledger', stagingMode ? count(volunteerDetailHtml, /data-contribution-group/g) > 0 : true],
  ['No personal impact score', !/data-personal-impact-score|personal impact score|personal impact score/i.test(volunteerHtml + volunteerDetailHtml)],
];
for (const [label, passed] of volunteerChecks) if (!passed) fail(`Volunteer runtime missing ${label}`);

const storyChecks = [
  ['Stories surface', has(storiesHtml, 'data-story-surface="index"')],
  ['Story detail route generated in staging', stagingMode ? Boolean(storyDetailHtml) : true],
  ['Stories do not replace Agenda/ledger', !/replaces the Agenda|menggantikan Agenda/i.test(storiesHtml + storyDetailHtml) || has(storiesHtml + storyDetailHtml, 'data-story-surface')],
];
for (const [label, passed] of storyChecks) if (!passed) fail(`Stories runtime missing ${label}`);

if (stagingMode) {
  const stagedAgenda = [...runtime.values()].filter((text) => text.includes('data-agenda-kind='));
  const stagedAgendaText = stagedAgenda.join('\n');
  const stagingChecks = [
    ['staging fixture marker', has(htmlText, 'data-fixtures="enabled"')],
    ['staging disclosure', /Pratinjau · data contoh|Preview · sample data/i.test(htmlText)],
    ['staging Agenda has three Sessions', count(agendaHtml, /data-agenda-kind="session"/g) === 3],
    ['staging Agenda has one standalone Event', count(agendaHtml, /data-agenda-kind="event"/g) === 1],
    ['staging Agenda index has no direct join paths', count(agendaHtml, /data-discord-join-path/g) === 0],
    ['staging Agenda detail owns the Discord handoff', count(stagedAgendaText, /data-discord-join-path/g) >= 1],
    ['staging volunteer people', count(volunteerHtml, /data-volunteer-person/g) >= 3],
    ['staging fictional IDs exist', fixtureIdPattern.test(htmlText)],
    ['staging all pages noindex', html.every(([, content]) => /<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']/i.test(content))],
  ];
  for (const [label, passed] of stagingChecks) if (!passed) fail(`Staging runtime missing ${label}`);
  if (!stagedAgendaText) fail('staging Agenda records are missing');
} else {
  const productionChecks = [
    ['production fixture marker', has(htmlText, 'data-fixtures="disabled"')],
    ['production empty Agenda', has(agendaHtml, 'data-agenda-state="empty"') && has(agendaHtml, 'data-evidence-placeholder')],
    ['production no fixture IDs', !fixtureIdPattern.test(htmlText)],
    ['production no demo copy', !/Data simulasi|Demo data|Pratinjau · data contoh/i.test(htmlText)],
    ['production no staged people', !has(htmlText, 'data-attribution="opt-in-demo"')],
    ['production volunteer placeholder', has(volunteerHtml, 'data-volunteer-state="evidence-placeholder"') || has(volunteerHtml, 'data-state="pending"')],
    ['production stories placeholder/empty', has(storiesHtml, 'data-state="empty"') || has(storiesHtml, 'Evidence Placeholder')],
  ];
  for (const [label, passed] of productionChecks) if (!passed) fail(`Production runtime missing ${label}`);
  const sourceMatches = [...new Set(canonicalProgramSources.filter((source) => htmlText.includes(source)))];
  if (sourceMatches.length !== canonicalProgramSources.length) fail(`canonical program source links found ${sourceMatches.length}/${canonicalProgramSources.length}`);
}

if (!stagingFixtureSource.includes('PUBLIC_STAGING_FIXTURES') || !stagingFixtureSource.includes('demo: true')) {
  fail('typed staging fixture boundary is missing');
}
for (const forbiddenField of ['email:', 'discordId', 'channelId', 'messageId', 'avatarUrl', 'demographics']) {
  if (stagingFixtureSource.includes(forbiddenField)) fail(`forbidden fixture field found: ${forbiddenField}`);
}

for (const [file, content] of runtime) {
  for (const [label, pattern] of forbiddenPatterns) {
    if (pattern.test(content)) fail(`${label} found in dist/${file}`);
  }
}

if (/Pulse|Denyut komunitas/i.test(htmlText)) fail('deprecated community labels found in runtime');

if (process.exitCode) process.exit(1);
console.log(`INTERFACE_RUNTIME_PASS mode=${stagingMode ? 'staging' : 'production'} routes=${requiredRoutes.length} html=${html.length} files=${runtimeFiles.length}`);
