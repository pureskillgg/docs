# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed

- Refresh the data science documentation against the pipeline as it runs today,
  and move the pages it replaces into an archive section.

  - The CS2 `spec.md` and `csds_dictionary.csv` are regenerated: 42 channels and
    762 columns, up from 30 channels and 642 columns. Fourteen channels were
    added and two (`item_remove`, `player_action`) removed when the published
    revisions changed over in early August 2026. Every column now carries a
    type, and the spec explains what each `origin` value means.
  - The dataset page and the Data Science FAQ are updated: revisions are
    retained for about a year rather than kept indefinitely, the tutorial needs
    Python 3.14 and uv rather than 3.9 and Poetry, download-cost guidance is
    measured rather than estimated in 2022, and the CS2 page no longer describes
    CS2 as Counter-Strike: Global Offensive.
  - The 2022 FAQ, the 2024 CS2 pages and the CS:GO pages move under
    `datascience/old/`. The CS:GO pages keep their original addresses under
    `/datascience/adx/csgo/`, so existing links still resolve.

- Harden the deploy workflows: pass the version input through `env:` instead of interpolating it into the shell line; give the dispatch and tag workflows readable run titles; give every job a timeout.

- GitHub Actions updated to Node 24 runtimes: `actions/checkout` v5 to v7; `actions/setup-node` v5 to v6.

## 0.8.2 / 2026-07-05

### Changed

- Upgrade Docusaurus 2-beta to 3 (MDX 3).
- Upgrade `posthog-docusaurus` v1 to v2 and clear a Docusaurus v4 deprecation.
- Fall back the PostHog `apiKey` to `phc_placeholder` so keyless builds succeed.
- Upgrade the build toolchain (`prettier` 3, `npm-run-all2`) and clear its vulnerabilities.

## 0.8.1 / 2026-07-05

### Changed

- Modernize GitHub Actions workflows for current runners.
- Replace the deprecated `JS-DevTools/npm-publish` action with a guarded `npm publish`.
- Fix kebab-case GPG inputs in the gh-pages job so the signing key imports.
- Bumped the Node floor to 22 (`engines.node`, `.nvmrc`, and the setup action
  default); validated that the Docusaurus build still succeeds on Node 22.

## 0.8.0 / 2024-02-24

### Added

- CS2 documentation pages.
