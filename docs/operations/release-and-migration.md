# Releases during infrastructure migration

Cloudflare serves the website, Worker API, and D1 agenda projection. KAD-Agent
and Discord synchronization run outside this repository. During the current
infrastructure migration those external services may have planned downtime;
Cloudflare remains in service.

A successful website build cannot restore the external scheduler. Do not restart
old hosts, duplicate schedulers, or change Discord credentials to address an
expected migration outage.

## Branch and release flow

Create feature branches from current `main` and open pull requests back to
`main`. `dev` is historical and is not part of the release path. Keep independent
work in separate branches or worktrees; an uncommitted UI preview is not included
in a CI deployment.

| Stage | Responsibility |
| --- | --- |
| Pull request CI | Frozen dependency install, dependency audit, Astro check, build, interface runtime validation, unit/Worker tests, and browser tests on GitHub-hosted runners. |
| Staging | Cloudflare preview deployment, D1 migration/schema verification, readiness/API checks, and crawler isolation. |
| Production | Release the successful `main` CI commit to Cloudflare, apply the required D1 migrations, and verify the deployed Worker and public agenda API. Reject a candidate if `main` has advanced. |
| External source recovery | Restore KAD-Agent on the migrated infrastructure and resume signed agenda projection requests. This is separate from deploying this repository. |

Node 22.19.0 and Bun 1.3.14 are the pinned workflow toolchain. Keep both lockfiles
in sync when updating dependencies: Bun installs from `bun.lock`, while the npm
audit uses `package-lock.json`. Regenerate both when a dependency PR changes the
manifest, then verify the frozen install and audit before merging.

## Cloudflare configuration

`wrangler.jsonc` must define the production `AGENDA_DB` binding and a separate
staging binding. The production and staging databases must not share an ID.
Each environment also needs its own projection verification key ID and public
key. Store the corresponding private signing key only on the authorized
KAD-Agent publisher; it does not belong in the website repository, browser
bundle, CI logs, or a PR description.

On 2026-09-08, the production D1 database `kaburajadulu-production-agenda` was
provisioned and migrated separately from staging. The production verifier uses
key ID `production-2026-09-08` and an independent Ed25519 key pair. The private
key is held outside the repository for transfer to the migrated publisher.
Provisioning does not establish source freshness: production must receive a
real signed projection after cutover. Do not seed a synthetic canary to make the
agenda appear healthy.

Repository configuration:

| Setting | Purpose |
| --- | --- |
| `CLOUDFLARE_DEPLOY_ENABLED=true` | Permit production deployment after successful `main` CI. |
| `CLOUDFLARE_STAGING_ENABLED=true` | Permit staging deployment. |
| `KAD_INFRA_MIGRATION=true` | Temporarily allow stale source data or an absent signed projection in post-deploy checks while requiring Cloudflare readiness and security checks to pass. |
| `Production` environment secrets | `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` for production. |
| `Preview` environment secrets | `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` for staging. |

Local `.env*`, `.dev.vars*`, and private key files are ignored. Example templates
may be committed only with placeholders. Git ignore rules do not remove or
protect secrets that were already committed.

## Distinguish deployment failure from source downtime

| Observation | Interpretation and response |
| --- | --- |
| `/healthz` fails | The Cloudflare Worker is not responding as expected. Investigate the deployment and Cloudflare routing. |
| `/readyz` fails | Binding, verification configuration, or database schema is not ready. Repair that Cloudflare configuration; external migration downtime does not excuse this failure. |
| Agenda returns `200` with `sourceStatus: stale` | The stored projection is readable but the source has not refreshed it. This is expected while the external publisher is paused; retain the stale label and last synchronization time. |
| Agenda reports unavailable with ready Worker | No usable projection is present. During a declared migration window the public UI must show unavailable state; after source recovery, verify a signed projection was accepted. |
| Signature, timestamp, or replay validation fails | Check the publisher key ID, matching public key, clock, and projection request contract. Do not disable validation to make synchronization succeed. |

The source freshness threshold is 45 minutes. Set the repository variable
`KAD_INFRA_MIGRATION=true` only for the migration window. Post-deploy checks then
report a warning and `DEGRADED — INFRA MIGRATION` when the source is stale or has
not yet delivered a signed projection. Other `503` responses remain failures.
An unready database, broken signature rejection, malformed response, or Worker
failure cannot pass under this exception. Checks retry the complete contract up
to four times for Cloudflare propagation without relaxing any assertions.

To rerun the deployed checks from a trusted checkout with the documented
toolchain:

```sh
SMOKE_BASE_URL=https://kaburajadulu.com \
SMOKE_ENVIRONMENT=production \
KAD_INFRA_MIGRATION=true \
node scripts/post-deploy-smoke.mjs
```

Use `SMOKE_ENVIRONMENT=staging` with the staging Worker URL to verify crawler
isolation as well. These checks do not publish source data: the unsigned test
request is expected to be rejected with `401`.

## Recovery and handoff

1. Select exactly one publisher after the migrated infrastructure is ready.
   For the migrated Kaddy runtime, keep legacy `sync-staging` disabled and follow
   the bot's [single-writer handoff protocol](https://github.com/KaburAjaDul/kad-agent/blob/main/docs/exec-plans/active/kaddy-24x7-homelab-program.md#single-writer-handoff-protocol).
   Begin in `observe`, verify the runtime lease, guild identity and approved
   source data, and prove zero outbound projection POSTs.
2. Configure its production endpoint and independent signing key to match the
   production verifier. Preserve the intended environment's public-ID HMAC key;
   it is separate from the signing key. Do not reuse staging signing credentials.
3. Before activating the runtime, set the **bot repository's**
   `KADDY_RUNTIME_PUBLICATION_ACTIVE=true`, drain/cancel all admitted legacy
   runs, and prove none are queued or in progress. Record the latest Worker
   checkpoint and fence the local revision floor at or above it. Only then use
   `KADDY_PUBLICATION_MODE=active` with
   `KADDY_PUBLICATION_CUTOVER_CONFIRMED=true`. Keep legacy sync disabled.
   If explicitly selecting legacy staging sync instead, do not activate the
   runtime: prove it is stopped and drained, then clear the **bot repository's**
   migration pause and re-enable only that staging writer. Legacy staging sync
   does not restore the production publisher.
4. Verify a real approved signed projection returns `202`, then check the
   public revision advances, approved entries/tombstones match, and no private
   identifiers leak. The protocol's canary must use real approved source data,
   not a synthetic agenda record. Check `/healthz`, `/readyz`, `/api/v1/agenda`,
   and the public page. Observe fresh source timestamps over at least two
   scheduled publication intervals.
5. Keep the **website repository's** `KAD_INFRA_MIGRATION=true` until its
   configured production and staging source checks can pass without the
   exception. Then clear that website flag and rerun both deployed checks to
   restore normal freshness enforcement. Clear the **bot repository's** pause
   only with the chosen writer verified; for runtime cutover retain
   `KADDY_RUNTIME_PUBLICATION_ACTIVE=true` and keep legacy sync disabled.
   Hand off the endpoint, deployed revision, and last accepted projection time
   to the infrastructure owner. Rollback must stop and drain the active runtime
   before admitting another writer.

If a new Worker release fails, use the known working Cloudflare version after
checking that it remains compatible with the migrated D1 schema. Do not delete
the production database or reverse a schema migration as a routine rollback.

## Branch cleanup

Before retiring a branch, check both commit ancestry and uncommitted work in
every attached worktree. Squashed or manually resolved merges can leave unique
commit IDs even when the feature has shipped. Preserve any unique documents,
scripts, and uncommitted files before removing local references. Close a PR as
superseded only when its replacement can be identified; keep the branch when
there is still work to recover.

The 2026-09-08 audit found `main` at `66e3761` and these cases:

- PR #22's tip `5397eb1` is already an ancestor of `main`; its work shipped
  through PR #25. It was closed as superseded, and its merged remote branch
  was removed. The commits remain in `main` and the local branch.
- PR #13 proposes devalue 5.3.2, while both current lockfiles already use 5.9.0.
  It was closed as superseded by the current dependency set, with its branch
  retained.
- PR #20 contains two unique commits and early community rewrite artifacts.
  The public shell and staging approach have newer replacements, but its
  `docs/community-rewrite/`, staging allowlist, and validator scripts are not
  commit-equivalent to `main`. It was closed as superseded with its branch
  preserved for recovery; do not merge its older shell over the current site.
- `dev` is 36 commits behind and 5 ahead of `main`. Its patch IDs are not fully
  equivalent, so preserve it as historical rather than force-resetting or
  deleting it during the migration.
- The original local `main` is 25 commits behind and has local changes to
  `AGENTS.md`, which also changed upstream. Do not fast-forward that worktree
  until those instructions have been preserved and reconciled.

These audit facts are dated snapshots. Recheck remote state before taking any
cleanup action.

Repository cleanup also disabled the obsolete `Staging Preview` workflow and
enabled deletion of merged remote branches, admin enforcement of `main`
protection, secret scanning/push protection, and dependency security updates.
The five remote design-system, field-station, live-programs, public-content,
and real-data-staging branches were removed after verifying their tips were
ancestors of `main`; all corresponding local worktrees were retained.
Retained local worktrees and their uncommitted work still need separate review
before removal.
