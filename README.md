<a id="readme-top"></a>

<!-- project shields -->
<!---->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![kaburajadulu][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- project logo -->
<br />
<div align="center">
  <a href="https://discord.gg/RUFFbEaeDx">
    <img src="/public/intoTheLmao.jpg" alt="kaburAjaDulu_logo" width="500">
  </a>

  <!--<h3 align="center">KaburAjaDulu</h3>-->
  
  <p align="center">
    <br />
    <a href="https://github.com/KaburAjaDul/kaburajadulu?tab=readme-ov-file#%EF%B8%8F-roadmap">🗺️ Roadmap</a>
  </p>
</div>

<!-- table of contents -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#what-is-KaburAjaDulu">What is KaburAjaDulu?</a>
    </li>
    <li>
      <a href="#mission-and-vision">🚀 Mission & Vision</a>
    </li>
    <li><a href="#getting-started">🛠️ Getting Started</a></li>
    <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
    </ul>
    <li><a href="#project-structure">📚 Project Structure</a></li>
    <li><a href="#contributing">🤝 Contributing</a></li>
    <ul>
        <li><a href="#code-contributions">Code Contributions</a></li>
        <li><a href="#guidelines">Guidelines</a></li>
        <li><a href="#roadmap">🗺️ Roadmap</a></li>
    </ul>
  </ol>
</details>

## What is KaburAjaDulu?
> KaburAjaDulu is an open-source platform helping Indonesians explore study and work opportunities abroad. Our mission is to provide accessible, accurate information and build a supportive community for those seeking international education and career paths.

## 🚀 Mission & Vision
We believe that international experience has the power to transform lives and broaden horizons. Our platform is dedicated to:

- **Providing job opportunities**: Gain access to insider insights on companies and referral networks. Many job openings are not publicly advertised, making these connections invaluable.

- **Facilitating language learning**: Benefit from expert guidance and firsthand advice from individuals who have successfully navigated the process of studying and working abroad.

- **Sharing scholarship opportunities**: Explore funding options, including scholarships and financial aid programs, to support international education.

- **Offering expert mentorship**: Learn from seasoned professionals who have successfully pursued global education and career paths

## 🛠️ Getting Started

### Prerequisites

- Node.js 22.19.0 or higher (CI pins 22.19.0)
- Bun 1.3.14

### Installation
Below is the procedure for installing the project:

#### For Development/Contributing
```sh
# Clone the repository
git clone https://github.com/KaburAjaDul/kaburajadulu.git

# Navigate to the project
cd kaburajadulu

# Create a feature branch from current main
git fetch origin
git switch -c feature/my-change origin/main

# Install dependencies
bun install --frozen-lockfile

# Start the development server
bun dev

# Type-check and build for production (test before contributing)
bun run check
bun run build
bun run validate:interface-runtime
bun run test:unit
bun run test:worker
git diff --check

# Run Chromium end-to-end coverage against a production preview
bunx playwright install chromium
bun run test:e2e
```

#### For General Use
```sh
# Clone the repository (main branch)
git clone https://github.com/KaburAjaDul/kaburajadulu.git

# Navigate to the project
cd kaburajadulu

# Install dependencies
bun install --frozen-lockfile

# Start the development server
bun dev
```

## 📚 Project Structure
```text
/
├── public/            # Static assets (images, icons, etc.)
├── src/
│   ├── components/    # React/Astro components
│   │   ├── home/      # Landing page sections
│   │   ├── layout/    # Layout components (Header, Footer)
│   │   └── ui/        # UI primitives (Button, Card, etc.)
│   ├── constants/     # Application constants
│   ├── layouts/       # Astro layout templates
│   ├── lib/           # Utility functions
│   ├── pages/         # File-based routing (.astro files)
│   └── styles/        # Global CSS styles
├── astro.config.mjs   # Astro configuration
└── package.json
```

## 🤝 Contributing
We welcome contributions from everyone! Here's how you can help:

### Code Contributions

1. Fork and clone the repository, or use your existing clone if you have write access.
2. Fetch the latest upstream `main` and create a short-lived feature branch. For a fork, add the upstream remote once:

   ```sh
   git remote add upstream https://github.com/KaburAjaDul/kaburajadulu.git
   git fetch upstream
   git switch -c feature/amazing-feature upstream/main
   ```

   For a direct clone, use `origin/main` instead of `upstream/main`.

3. Make your changes and run the checks in the development instructions above.
4. Commit the intended files and push your feature branch:

   ```sh
   git commit -m 'Add some amazing feature'
   git push -u origin feature/amazing-feature
   ```

5. Open a pull request targeting **`KaburAjaDul/kaburajadulu:main`**. Include what changed, how you tested it, and screenshots for visible UI changes.

`main` is the integration and release branch. The historical `dev` branch is no
longer a contribution or deployment target. Do not merge old branches wholesale
to catch up; bring any still-needed changes onto a fresh branch from `main`.

### Guidelines
- Follow the existing code style and conventions
- Write a clear, descriptive commit messages
- Update documentation as needed
- Add or update tests where possible
- Be respectful and constructive in discussions

### CI and deployment

Pull requests and pushes to `main` use Node 22.19.0 and Bun 1.3.14 with a
frozen install, dependency audit, Astro checks, a production build, runtime
validation, unit and Worker tests, and Playwright coverage. The `Check and build`
job must pass before merging. CI is hosted on GitHub and does not require the
external bot host to be online.

Playwright end-to-end coverage runs against a production Astro preview and
checks all 14 landing-page routes. Install Chromium once locally with
`bunx playwright install chromium`, then run it with `bun run test:e2e`.

Cloudflare production deployment follows a successful `CI` push to `main` and
uses that tested commit. `CLOUDFLARE_DEPLOY_ENABLED=true` enables production
releases; credentials belong in the `Production` environment. Staging uses the
`Preview` environment and `CLOUDFLARE_STAGING_ENABLED=true`. Both environments
need `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.

During the infrastructure migration, Cloudflare remains online while the
external KAD-Agent/Discord infrastructure may be unavailable. Deployment health
and source freshness are separate: a stale agenda can be expected during the
window, but a missing D1 binding, broken schema, or failed Worker readiness is
still a release failure. `KAD_INFRA_MIGRATION=true` enables this temporary
exception and reports degraded source data explicitly; disable it after the
publisher resumes. See the [release and migration runbook](docs/operations/release-and-migration.md)
for the release gates and recovery procedure.

Dependabot checks npm dependencies and GitHub Actions weekly against `main`.
Minor and patch updates are grouped for review; major updates stay separate.
Dependency PRs must keep `bun.lock` and `package-lock.json` consistent and pass
the same checks as other changes. No dependency update is automatically merged.

## 🗺️ Roadmap

- [X] Landing page with basic information
- [ ] Blog with guides and resources
- [ ] Curated list of scholarship, programs, and job opportunities
- [ ] More to come...

---

Built with ❤️ by the KaburAjaDulu Community


<!-- markdown links and images -->
[contributors-shield]: https://img.shields.io/github/contributors/KaburAjaDul/kaburajadulu.svg?style=for-the-badge
[contributors-url]: https://github.com/KaburAjaDul/kaburajadulu
[forks-shield]: https://img.shields.io/github/forks/KaburAjaDul/kaburajadulu.svg?style=for-the-badge
[forks-url]: https://github.com/KaburAjaDul/kaburajadulu/network/members
[stars-shield]: https://img.shields.io/github/stars/KaburAjaDul/kaburajadulu.svg?style=for-the-badge
[stars-url]: https://github.com/KaburAjaDul/kaburajadulu
[issues-shield]: https://img.shields.io/github/issues/KaburAjaDul/kaburajadulu.svg?style=for-the-badge
[issues-url]: https://github.com/KaburAjaDul/kaburajadulu/issues
