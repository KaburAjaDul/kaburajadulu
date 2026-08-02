# Community rewrite staging preview runbook

PR1 keeps the rewrite as a static, assets-only Cloudflare Worker. The event
flag is present for later work but is off in both the default configuration and
the explicit `staging` environment. There are no D1, R2, KV, Durable Object,
queue, service, API, event-data, route, or custom-domain bindings in this PR.

## One-time GitHub setup

In the repository `KaburAjaDul/kaburajadulu`, configure the following exact
locations:

1. Repository **Settings → Secrets and variables → Actions → Variables**:
   create `CLOUDFLARE_STAGING_DEPLOY_ENABLED` with value `true` when remote
   previews are approved. Leave it unset or set it to any other value to keep
   remote upload disabled.
2. Environment **Settings → Environments → Staging**:
   create the `Staging` environment and add the environment secrets
   `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Keep the token scoped to
   the staging Worker/account operation required by Wrangler. Do not put these
   values in repository variables, files, logs, or pull requests.
3. Add any required Staging environment reviewers or branch restrictions. The
   workflow never uses a production environment or production resource name.

The preview workflow is limited to pull requests whose head repository is this
repository (internal PRs) and manual dispatch. It is skipped unless the
repository variable is exactly `true`. A skipped job is intentional evidence
that remote deployment is disabled. The staging environment explicitly sets
Wrangler `workers_dev: true` and `preview_urls: true`; the default/production
configuration leaves both settings unchanged.

## Local checks and preview

No Cloudflare credentials are needed for the local gates:

```bash
bun install --frozen-lockfile
bun run validate:staging
bun run check
bun run build:staging
bunx wrangler deploy --env staging --dry-run
```

To serve the built assets locally through Wrangler's workerd runtime, run:

```bash
bun run cf:preview
```

This is a local preview only; it does not upload a Worker. The validator reads
`wrangler.jsonc` and `config/cloudflare-staging-allowlist.json` and fails closed
if the Worker names, `COMMUNITY_EVENTS_ENABLED`, `./dist`, or the assets-only
binding boundary drift.

`build:staging` also sets every generated page to `noindex, nofollow` and omits
production canonical, alternate-language, Open Graph URL/image, Twitter image,
and structured-data URLs from the preview artifact. It replaces the copied
`robots.txt` with `Disallow: /`, no production sitemap reference, and removes
the sitemap from the preview artifact. Production builds continue to emit the
normal indexable metadata and public sitemap.

## Remote preview

After the Staging environment and secrets are configured, enable the repository
variable and open or update an internal pull request. GitHub Actions runs the
static build and dry-run first, then executes only:

```bash
wrangler versions upload --env staging --preview-alias <alias>
```

The command creates a versioned preview for Worker `kaburajadulu-staging`.
The workflow does not call `wrangler deploy`, select a production environment,
or use production bindings. Manual runs can provide an alias. It is lowercased,
restricted to a leading letter followed by lowercase letters/numbers/hyphens,
and capped at 41 characters so the alias plus `kaburajadulu-staging` stays
within the 63-character Workers DNS limit. Otherwise the PR number/run ID and
commit prefix are used.

## Rollback and disable

To stop new remote uploads immediately, set
`CLOUDFLARE_STAGING_DEPLOY_ENABLED` to a value other than `true` or remove the
repository variable. Existing preview versions can then be removed or
deactivated in the Cloudflare Workers dashboard by an authorized operator.
For a local-only rollback, stop `wrangler dev` and serve the last known-good
static build. Re-run the validator and dry-run after any config change before
re-enabling the variable.

There is no production rollback or production migration in this PR. D1, R2,
KV, Durable Objects, API routes, event data, secrets, and custom domains are
explicitly deferred to later PRs with separate staging resources and gates.
