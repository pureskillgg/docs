# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed

- Modernized GitHub Actions workflows so current runners can schedule them:
  `ubuntu-20.04` runners to `ubuntu-latest`, `actions/checkout` v2 to v5,
  `actions/setup-node` v2 to v5, `crazy-max/ghaction-import-gpg` v3/v4 to v7,
  `stefanzweifel/git-auto-commit-action` v4 to v7, and
  `peaceiris/actions-gh-pages` v3 to v4.
- Replaced the deprecated `JS-DevTools/npm-publish` action with a plain
  `npm publish` step guarded by a published-version check.
- Fixed the kebab-case GPG inputs in the gh-pages job (e.g. `gpg-private-key`),
  which `ghaction-import-gpg` silently ignores; they are now snake_case so the
  signing key actually imports.
- Bumped the Node floor to 22 (`engines.node`, `.nvmrc`, and the setup action
  default); validated that the Docusaurus build still succeeds on Node 22.

## 0.8.0 / 2024-02-24

### Added

- CS2 documentation pages.
