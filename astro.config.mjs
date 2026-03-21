// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://kaburajadulu.com',
  integrations: [react()],
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en', 'ja', 'zh-cn', 'zh-tw', 'ko', 'es', 'ar', 'nl', 'it', 'de', 'fr', 'sv'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwind()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
