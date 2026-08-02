#!/usr/bin/env node

import { unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const robotsPath = path.join(repositoryRoot, 'dist', 'robots.txt');
const sitemapPath = path.join(repositoryRoot, 'dist', 'sitemap.xml');

await writeFile(robotsPath, 'User-agent: *\nDisallow: /\n', 'utf8');
await unlink(sitemapPath);
console.log('Prepared staging crawler boundary: disallow robots and omit the production sitemap.');
