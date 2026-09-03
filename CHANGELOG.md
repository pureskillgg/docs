# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed

- Refresh the data science documentation and archive the pages it replaces.
  - Regenerate the CS2 `spec.md` and `csds_dictionary.csv`.
  - Update the dataset page and the Data Science FAQ.
  - Move the 2022 FAQ, the 2024 CS2 pages, and the CS:GO pages under `datascience/old/`.
- Harden the deploy workflows.
- Update GitHub Actions to Node 24 runtimes.

## 0.8.2 / 2026-07-05

### Changed

- Upgrade Docusaurus 2-beta to 3 (MDX 3).
- Upgrade `posthog-docusaurus` v1 to v2 and clear a Docusaurus v4 deprecation.
- Fall back the PostHog `apiKey` to `phc_placeholder`.
- Upgrade the build toolchain (`prettier` 3, `npm-run-all2`) and clear its vulnerabilities.

## 0.8.1 / 2026-07-05

### Changed

- Modernize GitHub Actions workflows for current runners.
- Replace the deprecated `JS-DevTools/npm-publish` action with a guarded `npm publish`.
- Fix kebab-case GPG inputs in the gh-pages job.
- Bump the Node floor to 22.

## 0.8.0 / 2024-02-24

### Added

- CS2 documentation pages.
