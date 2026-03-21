# AGENTS.md

Agent instructions for the KaburAjaDulu codebase — an Astro 5 platform helping Indonesians
explore study and work opportunities abroad. Domain: **kaburajadulu.com**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (static output, no SSR adapter) |
| UI | React 19 + ShadCN (New York style) + Radix UI |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`) |
| Language | TypeScript (strict mode via `astro/tsconfigs/strict`) |
| Package manager | Bun |
| Deployment | Cloudflare Workers (static assets) |

---

## Development Commands

```bash
# Install dependencies
bun install

# Start development server (http://localhost:4321)
bun dev

# Type-check the entire project
bun run astro check

# Build for production (output to ./dist)
bun run build

# Preview production build locally (standard Node preview)
bun run preview

# Raw Astro CLI passthrough
bun run astro
```

---

## Cloudflare Deployment

The site deploys as a **static site** to Cloudflare Workers. No SSR adapter is needed.

```bash
# Install Wrangler CLI (already in devDependencies)
bun install

# Preview production build locally using Cloudflare's workerd runtime
bun run cf:preview

# Build and deploy to Cloudflare Workers (kaburajadulu.com)
bun run deploy
```

### First-time setup

1. Authenticate with Cloudflare:
   ```bash
   bunx wrangler login
   ```
2. Run the initial deploy:
   ```bash
   bun run deploy
   ```
3. In the Cloudflare dashboard → Workers & Pages → `kaburajadulu` → Custom Domains,
   add `kaburajadulu.com` and `www.kaburajadulu.com`.

### Configuration files

- `wrangler.jsonc` — Cloudflare Workers config (name, compatibility date, assets dir)
- `public/_headers` — custom HTTP response headers for static assets
- `public/_redirects` — custom redirects for static assets

### Environment secrets

For any future server-side secrets, use Wrangler (never commit to repo):
```bash
bunx wrangler secret put SECRET_NAME
```

For local dev secrets, create `.dev.vars` (already gitignored):
```
MY_SECRET=value
```

---

## Internationalization (i18n)

The site supports 13 languages via URL-prefix routing. All UI strings are translated via `react-i18next`.

### Supported Locales

| Code | Language | Direction |
|---|---|---|
| `id` | Indonesian (default) | LTR |
| `en` | English | LTR |
| `ja` | Japanese | LTR |
| `zh-cn` | Chinese (Simplified) | LTR |
| `zh-tw` | Chinese (Traditional) | LTR |
| `ko` | Korean | LTR |
| `es` | Spanish | LTR |
| `ar` | Arabic | **RTL** |
| `nl` | Dutch | LTR |
| `it` | Italian | LTR |
| `de` | German | LTR |
| `fr` | French | LTR |
| `sv` | Swedish | LTR |

### URL Structure

```
/                   → Indonesian (default, no prefix)
/en/               → English
/ja/               → Japanese
/zh-cn/            → Chinese Simplified
/zh-tw/            → Chinese Traditional
...etc.
/blog/post-slug    → Indonesian blog
/en/blog/post-slug → English blog
```

### Adding a New Locale

1. Create `src/locales/{code}.json` with all UI strings
2. Add the locale code to `SUPPORTED_LANGUAGES` in `src/i18n/config.ts`
3. Add locale to `LOCALES` in `src/i18n/constants.ts`
4. Add country→locale mapping in `src/i18n/localeMapping.ts`
5. Add flag and name in `src/i18n/constants.ts`
6. If RTL, add to `LOCALE_DIR` mapping with `rtl`
7. Add hreflang in `Layout.astro` if not already covered
8. Add new page routes in `src/pages/[lang]/` if needed

### Geo-Detection

The `Layout.astro` includes an inline geo-detection script that reads `CF-IPCountry` (set by Cloudflare) or falls back to `navigator.language`. The detected locale is set as `data-detected-locale` on `<html>`. The `LanguageSwitcher` uses this to highlight the detected language in the dropdown.

### RTL Support

Arabic (`ar`) sets `dir="rtl"` on `<html>`. RTL CSS overrides are in `Layout.astro`'s `<style is:global>`. Key patterns: `.navbar { flex-direction: row-reverse; }`, `.ml-auto` → `.mr-auto`, etc.

### Testing i18n Locally

```bash
bun dev
# Visit: http://localhost:4321/ja/
# Visit: http://localhost:4321/ar/
# Visit: http://localhost:4321/zh-tw/
```



No test framework is currently configured. When adding tests:

```bash
# Recommended: Vitest (compatible with Vite/Astro)
bun add -D vitest @testing-library/react

# Run all tests
bunx vitest run

# Run a single test file
bunx vitest run src/components/blog/BlogCard.test.tsx

# Run tests in watch mode
bunx vitest
```

Type-check (substitute for lint until ESLint is configured):
```bash
bun run astro check
```

---

## Project Structure

```
src/
├── components/
│   ├── blog/          # BlogCard.tsx, BlogSection.tsx
│   ├── home/          # HeroSection, AboutSection, DestinationShowcase, CTASection
│   ├── layout/        # Navbar.tsx, Footer.tsx, LanguageSwitcher.tsx
│   └── ui/            # ShadCN primitives: button, card, badge, aspect-ratio
├── constants/
│   └── urls.ts        # All external/internal URLs — add new URLs here
├── content/
│   ├── blog/          # Markdown blog posts (.md)
│   └── config.ts      # Zod schema for content collections
├── i18n/
│   ├── index.ts           # Re-exports
│   ├── config.ts          # react-i18next setup
│   ├── constants.ts       # LOCALE_NAMES, LOCALE_FLAGS, LOCALE_DIR, LOCALES
│   ├── getLocaleFromUrl.ts  # Extract locale from URL
│   └── localeMapping.ts   # Country code → locale code mapping
├── locales/              # JSON translation files per language
│   ├── id.json, en.json, ja.json, zh-cn.json, zh-tw.json
│   ├── ko.json, es.json, ar.json, nl.json, it.json
│   ├── de.json, fr.json, sv.json
├── layouts/
│   ├── Layout.astro   # Base layout: SEO, OG tags, JSON-LD, hreflang, RTL
│   └── BlogLayout.astro
├── lib/
│   └── utils.ts       # cn() className utility
├── pages/
│   ├── index.astro              # Homepage (redirects or serves default locale)
│   ├── [lang]/                  # Localized pages (one subdir per non-default locale)
│   │   ├── index.astro          # Localized homepage
│   │   └── blog/
│   │       └── [...slug].astro  # Localized blog post
│   └── blog/
│       └── [...slug].astro      # Blog post (default/id locale)
└── styles/
    └── global.css     # Tailwind v4 theme + global CSS + RTL overrides
```

---

## Code Style Guidelines

### Imports

Order imports as follows (no blank line required between groups, but keep consistent):
1. External packages (`react`, `astro:content`, `lucide-react`, etc.)
2. Internal aliases (`@/lib/utils`, `@/components/ui/button`, `@/constants/urls`)
3. Relative imports (avoid — use `@/*` alias instead)

Always use the `@/*` path alias. Never use `../../` chains.

```ts
// Good
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Bad
import { cn } from '../../lib/utils';
```

### TypeScript

- Strict mode is enabled — no `any`, no implicit `any`, no non-null assertions without justification.
- Define prop interfaces above the component, named `<ComponentName>Props`.
- Use `React.FC<Props>` for functional components.
- Prefer explicit return types on non-trivial functions.
- Use Zod for runtime validation (already used in content collections).

```tsx
interface BlogCardProps {
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  onClick?: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ title, category, date, imageUrl, onClick }) => {
  // ...
};
```

### Styling

- All className composition must go through `cn()` from `@/lib/utils`.
- Tailwind CSS v4 is used — there is **no `tailwind.config.js`**. Custom theme tokens live in
  `src/styles/global.css` inside `@theme inline {}`.
- Follow ShadCN New York style patterns. New UI primitives go in `src/components/ui/`.
- Use `class-variance-authority` (CVA) for multi-variant components (see `button.tsx`).
- Do not add inline `style` props unless absolutely unavoidable.

```tsx
// Good
<div className={cn('rounded-2xl bg-white p-4', isActive && 'shadow-lg')} />

// Bad
<div style={{ borderRadius: '16px', backgroundColor: 'white', padding: '16px' }} />
```

### Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| React components | PascalCase | `BlogCard`, `HeroSection` |
| Component files | `PascalCase.tsx` | `BlogCard.tsx` |
| Astro pages/layouts | `PascalCase.astro` or `[slug].astro` | `Layout.astro` |
| Hooks | `camelCase` prefixed `use` | `useScrollPosition` |
| Constants | `SCREAMING_SNAKE_CASE` | `DISCORD_URL` |
| Types/Interfaces | PascalCase | `BlogCardProps` |
| CSS variables | `--kebab-case` | `--color-primary` |

### Content Collections

Use Astro 5's **loader API** (not the legacy `type: 'content'` approach):

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({ ... }),
});
```

Blog post categories must be one of: `Lowongan | Beasiswa | Event | Kelas Bahasa | Berita`

### Astro Layouts and Pages

- Always pass `title`, `description`, and `canonical` props to `<Layout>` when creating new pages.
- SEO metadata, Open Graph tags, and JSON-LD schema are managed in `src/layouts/Layout.astro`.
- Do not duplicate meta tags in individual pages.

### Error Handling

- Surface errors to the user with meaningful messages; never swallow errors silently.
- In `.astro` files, handle missing content gracefully (use optional chaining and fallbacks).
- For content collection queries, always handle the empty-array case.

### URLs and Constants

All external URLs must be defined in `src/constants/urls.ts`. Never hardcode URLs inline.

```ts
// src/constants/urls.ts
export const DISCORD_URL = 'https://discord.com/invite/KaburAjaDulu';
export const SITE_URL = 'https://kaburajadulu.com';
```

---

## Fonts

- **Plus Jakarta Sans** — primary UI font (loaded from Google Fonts in `Layout.astro`)
- **Caveat** — accent/handwritten font

Do not add additional web fonts without updating `Layout.astro` preconnect hints.

---

## Key Files Reference

| File | Purpose |
|---|---|
| `astro.config.mjs` | Astro + Vite config, i18n routing, path aliases |
| `wrangler.jsonc` | Cloudflare Workers deployment config |
| `src/layouts/Layout.astro` | Base layout with SEO, OG, JSON-LD, hreflang, RTL, geo-detect |
| `src/lib/utils.ts` | `cn()` className merge utility |
| `src/constants/urls.ts` | Centralized URL constants |
| `src/content/config.ts` | Content collection Zod schemas |
| `src/styles/global.css` | Tailwind v4 theme tokens + global CSS + RTL overrides |
| `src/i18n/config.ts` | react-i18next configuration, all 13 locales |
| `src/i18n/constants.ts` | LOCALE_NAMES, LOCALE_FLAGS, LOCALE_DIR, LOCALES |
| `src/components/layout/LanguageSwitcher.tsx` | Language dropdown with flags, preserves page context |
| `components.json` | ShadCN configuration (New York style, no RSC) |
| `public/_redirects` | Static redirects (old `/blog/*` → `/en/blog/*`) |
