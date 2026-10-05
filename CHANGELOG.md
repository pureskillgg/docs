# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- CS2 CSDS changelog pages, by date and by channel, covering every change to the published data since 2023-11-05.
- A "Changes over time" section in the CS2 spec, linking to them and noting that a revision can straddle a change.
- A CS2 PII Removal page listing what is removed or changed before a match is published.
- A CS2 Revision Stats page: matches, files and size in each daily revision that can still be exported.

### Changed

- Refresh the data science documentation and archive the pages it replaces.
  - Regenerate the CS2 `spec.md` and `csds_dictionary.csv`.
  - Update the dataset page and the Data Science FAQ.
  - Move the 2022 FAQ, the 2024 CS2 pages, and the CS:GO pages under `datascience/old/`.
- Harden the deploy workflows.
- Update GitHub Actions to Node.js 24 runtimes.
- List the inputs csgo-ppp 8.5.3 declares for the CS2 spec's header rank averages and final scores.
- Type the CS2 spec's merged player ids (`player_id_fixed`, `attacker_id_fixed`, `assister_id_fixed`) as integers in every channel, written as `int64` with nulls, and add `player_id` and `round` to the inputs of `player_vector`'s velocity columns, now differenced per player per round.
- Write "none" as null in the CS2 spec: the columns csgo-ppp now writes as null rather than a marker are nullable, with the old markers listed for readers of older matches, and `molotov_state.extinguisher_not_found` takes the place of the -2.
- Describe `player_vector.movement_angle_diff` as csgo-ppp now writes it: the look-minus-move angle in -180 to 180, null while standing still, with its old -180 to 360 range and -1 listed for older matches.
- Describe `player_vector.movement_angle` as csgo-ppp now writes it: null while standing still, where older matches stored 0, the same as moving along +x.
- Remove `player_vector`'s ten derived columns from the CS2 spec and dictionary (`second`, `x_vel`, `y_vel`, `z_vel`, `speed_2d`, `movement_angle`, `movement_angle_diff`, `phi_vel`, `theta_vel`, `ang_vel`): csgo-ppp stops storing them, and the spec says how to compute them on load with pureskillgg-csgo-dsdk.

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
- Fix kebab-case GPG inputs in the `gh-pages` job.
- Bump the Node floor to 22.

## 0.8.0 / 2024-02-24

### Added

- CS2 documentation pages.
