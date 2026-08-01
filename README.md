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
- Node.js 22.12.0 or higher
- Bun 1.3.14

### Installation
Below is the procedure for installing the project:

#### For Development/Contributing
```sh
# Clone the repository
git clone https://github.com/KaburAjaDul/kaburajadulu.git

# Navigate to the project
cd kaburajadulu

# Switch to development branch
git checkout dev

# Install dependencies
bun install

# Start the development server
bun dev

# Type-check and build for production (test before contributing)
bun run check
bun run build

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
1. Fork the repository
2. **Switch to the dev branch** (important for contributors):
    ```sh
   git checkout dev
   ```
3. Create a feature branch from dev:
    ```sh
   git checkout -b feature/amazing-feature
   ```
4. Make your changes and test them:
    ```sh
   # Test your changes
   bun run build
   
   # Ensure the build passes before committing
   ```
5. Commit your changes:
    ```sh
   git commit -m 'Add some amazing feature'
   ```
6. Push to the branch:
    ```sh
   git push origin feature/amazing-feature
   ```
7. Open a Pull Request **targeting the dev branch** (not main)

### Guidelines
- Follow the existing code style and conventions
- Write a clear, descriptive commit messages
- Update documentation as needed
- Add or update tests where possible
- Be respectful and constructive in discussions

### CI and deployment

Pull requests and pushes to `main` run the pinned Node 22.12.0/Bun 1.3.14
toolchain, a frozen install, dependency audit, `bun run check`, a production
build, and smoke assertions for the root and all 13 localized output routes.
Main branch protection must require the `CI / Check and build` status check
separately.

Playwright end-to-end coverage runs against a production Astro preview and
checks all 14 landing-page routes. Install Chromium once locally with
`bunx playwright install chromium`, then run it with `bun run test:e2e`.

Cloudflare deployment runs only after a successful `CI` workflow for a push to
`main`. To opt in, set the repository variable `CLOUDFLARE_DEPLOY_ENABLED` to
`true`, and configure the `Production` environment with the
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets. Deployment remains
skipped until that variable is enabled.

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
