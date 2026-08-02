#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(repositoryRoot, 'wrangler.jsonc');
const allowlistPath = path.join(repositoryRoot, 'config', 'cloudflare-staging-allowlist.json');

function stripJsoncComments(source) {
  let output = '';
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const nextCharacter = source[index + 1];

    if (inString) {
      output += character;
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      output += character;
    } else if (character === '/' && nextCharacter === '/') {
      index += 1;
      while (index + 1 < source.length && source[index + 1] !== '\n') index += 1;
    } else if (character === '/' && nextCharacter === '*') {
      index += 2;
      while (index + 1 < source.length && !(source[index] === '*' && source[index + 1] === '/')) index += 1;
      index += 1;
    } else {
      output += character;
    }
  }

  return output;
}

function removeTrailingCommas(source) {
  let output = '';
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      output += character;
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      output += character;
      continue;
    }

    if (character === ',') {
      let lookahead = index + 1;
      while (/\s/.test(source[lookahead] ?? '')) lookahead += 1;
      if (source[lookahead] === '}' || source[lookahead] === ']') continue;
    }
    output += character;
  }

  return output;
}

async function readJsonc(filePath) {
  const source = await readFile(filePath, 'utf8');
  try {
    return JSON.parse(source);
  } catch {
    try {
      return JSON.parse(removeTrailingCommas(stripJsoncComments(source)));
    } catch (error) {
      throw new Error(`Cannot parse ${path.relative(repositoryRoot, filePath)}: ${error.message}`);
    }
  }
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function exactKeys(value, expected, label, errors) {
  if (!isObject(value)) {
    errors.push(`${label} must be an object`);
    return;
  }
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.join('\0') !== wanted.join('\0')) {
    errors.push(`${label} keys must be exactly [${wanted.join(', ')}], got [${actual.join(', ')}]`);
  }
}

function collectKeys(value, prefix = '', result = []) {
  if (!isObject(value)) return result;
  for (const [key, child] of Object.entries(value)) {
    const location = prefix ? `${prefix}.${key}` : key;
    result.push({ key, location });
    collectKeys(child, location, result);
  }
  return result;
}

async function main() {
  const [config, allowlist] = await Promise.all([readJsonc(configPath), readJsonc(allowlistPath)]);
  const errors = [];

  if (!isObject(config)) errors.push('wrangler config must be an object');
  if (!isObject(allowlist)) errors.push('staging allowlist must be an object');
  if (errors.length > 0) throw new Error(errors.join('\n'));

  const productionName = allowlist.productionWorkerName;
  const stagingName = allowlist.stagingWorkerName;
  const assetsDirectory = allowlist.assetsDirectory;
  const eventsFlag = allowlist.communityEventsEnabled;
  const allowedStagingKeys = allowlist.allowedStagingKeys;
  const allowedAssetKeys = allowlist.allowedStagingAssetKeys;
  const allowedVariableKeys = allowlist.allowedVariableKeys;
  const forbiddenStagingKeys = new Set(allowlist.forbiddenStagingKeys ?? []);

  if (typeof productionName !== 'string' || productionName.length === 0) errors.push('allowlist.productionWorkerName must be a non-empty string');
  if (typeof stagingName !== 'string' || stagingName.length === 0) errors.push('allowlist.stagingWorkerName must be a non-empty string');
  if (typeof assetsDirectory !== 'string' || assetsDirectory !== './dist') errors.push('allowlist.assetsDirectory must be ./dist');
  if (eventsFlag !== 'false') errors.push('allowlist.communityEventsEnabled must be the string false');
  if (!Array.isArray(allowedStagingKeys) || !Array.isArray(allowedAssetKeys) || !Array.isArray(allowedVariableKeys)) {
    errors.push('allowlist must declare allowed staging, asset, and variable keys');
  }
  if (forbiddenStagingKeys.size === 0) errors.push('allowlist.forbiddenStagingKeys must not be empty');

  if (config.name !== productionName) errors.push(`default Worker name must be ${productionName}`);
  if (config.name === stagingName) errors.push('default Worker name must differ from the staging Worker name');
  if ('workers_dev' in config) errors.push('default workers_dev must remain unset in this PR');
  if ('preview_urls' in config) errors.push('default preview_urls must remain unset in this PR');
  exactKeys(config.vars, allowedVariableKeys ?? [], 'default vars', errors);
  if (config.vars?.COMMUNITY_EVENTS_ENABLED !== eventsFlag) errors.push('default COMMUNITY_EVENTS_ENABLED must be the string false');
  if (!isObject(config.assets) || config.assets.directory !== assetsDirectory) errors.push('default assets.directory must be ./dist');

  const staging = config.env?.staging;
  if (!isObject(staging)) {
    errors.push('env.staging must be present');
  } else {
    exactKeys(staging, allowedStagingKeys ?? [], 'env.staging', errors);
    if (staging.name !== stagingName) errors.push(`env.staging.name must be ${stagingName}`);
    if (staging.name === config.name) errors.push('env.staging.name must differ from the default Worker name');
    if (staging.workers_dev !== allowlist.stagingWorkersDev) errors.push('env.staging.workers_dev must be true');
    if (staging.preview_urls !== allowlist.stagingPreviewUrls) errors.push('env.staging.preview_urls must be true');
    exactKeys(staging.vars, allowedVariableKeys ?? [], 'env.staging.vars', errors);
    if (staging.vars?.COMMUNITY_EVENTS_ENABLED !== eventsFlag) errors.push('staging COMMUNITY_EVENTS_ENABLED must be the string false');
    if (!isObject(staging.assets) || staging.assets.directory !== assetsDirectory) errors.push('staging assets.directory must be ./dist');
    exactKeys(staging.assets, allowedAssetKeys ?? [], 'env.staging.assets', errors);

    for (const { key, location } of collectKeys(staging)) {
      if (forbiddenStagingKeys.has(key)) errors.push(`forbidden staging key ${location}`);
    }
  }

  const forbiddenAnywhere = new Set([
    ...forbiddenStagingKeys,
    'd1_databases',
    'r2_buckets',
    'kv_namespaces',
    'durable_objects',
    'queues',
    'services'
  ]);
  for (const { key, location } of collectKeys(config)) {
    if (forbiddenAnywhere.has(key)) errors.push(`forbidden Cloudflare binding or route key ${location}`);
  }

  if (errors.length > 0) {
    throw new Error(`Cloudflare staging config validation failed:\n- ${errors.join('\n- ')}`);
  }
  console.log('Cloudflare staging config validation passed: assets-only, flag-off, isolated Worker name, and no forbidden bindings/routes.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
