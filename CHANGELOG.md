# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- A CS2 CSDS page on positions and view angles: what x, y, z, `theta_ang` and `phi_ang` measure, with figures, and the formula for the angle between a player's view and any point. The spec links to it.
- Render LaTeX maths in the docs with `remark-math` and `rehype-katex`.
- A CS2 Datasheet page. The Datasheets for Datasets answers move there from the data set page, which keeps its data dictionary and glossary and links to it.
- A landing page at `/` in place of the markdown homepage: what the data set is, how to get it, every object in a match linked to its section of the spec, and the docs worth reading first.
- A CS2 Quickstart page: subscribe, export a day to S3, download it, load a match with dsdk, add `player_vector`'s derived columns, and query a day through tomes. Every Python block was run on a copy of the 2026-10-07 revision.
- A CS2 Getting the Data page: access, daily revisions and pruning, the dsdk export functions and the permissions they need, the file layout, the index object's fields (including `available`), match identity, and which date to use.
- A CS2 Enums page: teams, win reasons, hit groups, weapon types, weapon and item codes (with a downloadable table), ranks, round phases, every channel's event types, bombsite ids and radar colours, read from the 1,752 matches published 2026-10-01 to 10-08.
- A CS2 Known Flaws page: matches uploaded by hand, linking players across matches by fingerprinting, duplicates, channels that can be empty, missing values, and what changed across the retained window.
- A CS2 Known Flaws page: matches uploaded by hand, linking players across matches by fingerprinting, `item_equip` item names and codes, duplicates, channels that can be empty, missing values, and what changed across the retained window.

### Changed

- Link Data Science, the CSDS Spec and the Changelog from the navbar, move the social links into the footer, and replace the "Beep Boop." tagline.
- Bring the CS2 datasheet up to date: rounds removed before publication, Revision Stats for counts, splitting by match to avoid leakage, why duplicates happen, Known Flaws for what is missing, manual uploads (which may include no PureSkill.gg user), where radar data lives, how the data is extracted and processed, how long demos are kept, the yearly prune, the changelog as the erratum, and a plain "No" on third-party restrictions.
- Say what is removed before publication instead of calling identification impossible, on the datasheet and in the Data Science FAQ, and list on PII Removal what is published as recorded (`header.server_name`, and `header.match_date` to the second).
- Update the Data Science FAQ's retention answer (a yearly prune; 408 revisions from 2025-07-19 on 2026-10-09) and say a pruned revision may be restored on request with a good reason.
- Update the Cost FAQ's sizes, measured on 2026-10-09: about 10 MB per match since 2026-10-06, and `player_vector` with `player_status` about 7 MB of it.
- Point "How can I get started?" in the Data Science FAQ at the Quickstart; the tutorial stays as a longer course, noted as written for older data. The data set page links both new pages, and the landing page's "Start with the Quickstart" button and steps point at it, with the tutorial as an Explore card; Explore also gains Enums and Getting the Data.
- Refresh the CS2 Revision Stats page through the 2026-10-09 revision: 408 revisions, 37,881 matches, 1.37 TB.
- Add a size per match column to the CS2 Revision Stats page.
- Add a data change column to the CS2 Revision Stats page, linking each revision to the changelog entries it is the first to carry.
- Date the removal of `player_vector`'s ten derived columns 2026-10-06, the day converter 8.7.3 reached production, not about 2026-10-05.
- Add converter 8.7.4's changes to the CS2 CSDS changelog pages, dated 2026-10-06: the molotov flags as booleans, empty columns written at their own type, and the index object declaring every column's written type and nullability.

## 1.0.6

### Added

- The CS2 CSDS changelog's 2026-10-05 entries for three fixes that csgo-ppp 8.7.1 took to production: merged player ids an integer in every match, velocities computed per round, `movement_angle_diff` as the look-minus-move angle, "none" written as null, and `molotov_state.extinguisher_not_found`.

### Changed

- Pin workflow runners to `ubuntu-24.04`.
- Remove `player_vector`'s ten derived columns from the CS2 spec and dictionary (`second`, `x_vel`, `y_vel`, `z_vel`, `speed_2d`, `movement_angle`, `movement_angle_diff`, `phi_vel`, `theta_vel`, `ang_vel`): csgo-ppp stops storing them, and the spec says how to compute them on load with pureskillgg-csgo-dsdk.
- Add the removal of `player_vector`'s ten derived columns to the CS2 CSDS changelog pages, marked breaking, dated by the converter 8.7.3 release.
- Give every column in the CS2 spec the type it is written as and the nullability the index object now declares for it, the molotov flags as booleans null off burns, and rewrite the notes on types and nullability to match.

## 1.0.5 / 2026-10-05

### Changed

- Describe `player_vector.movement_angle` as csgo-ppp now writes it: null while standing still, where older matches stored 0, the same as moving along +x.

## 1.0.4 / 2026-10-05

### Changed

- Describe `player_vector.movement_angle_diff` as csgo-ppp now writes it: the look-minus-move angle in -180 to 180, null while standing still, with its old -180 to 360 range and -1 listed for older matches.

## 1.0.3 / 2026-10-05

### Changed

- Write "none" as null in the CS2 spec: the columns csgo-ppp now writes as null rather than a marker are nullable, with the old markers listed for readers of older matches, and `molotov_state.extinguisher_not_found` takes the place of the -2.

## 1.0.2 / 2026-10-04

### Added

- A CS2 Revision Stats page: matches, files and size in each daily revision that can still be exported.

### Changed

- Type the CS2 spec's merged player ids (`player_id_fixed`, `attacker_id_fixed`, `assister_id_fixed`) as integers in every channel, written as `int64` with nulls, and add `player_id` and `round` to the inputs of `player_vector`'s velocity columns, now differenced per player per round.

## 1.0.1 / 2026-10-04

### Added

- CS2 CSDS changelog pages, by date and by channel, covering every change to the published data since 2023-11-05.
- A "Changes over time" section in the CS2 spec, linking to them and noting that a revision can straddle a change.
- A CS2 PII Removal page listing what is removed or changed before a match is published.

### Changed

- Refresh the data science documentation and archive the pages it replaces.
  - Regenerate the CS2 `spec.md` and `csds_dictionary.csv`.
  - Update the dataset page and the Data Science FAQ.
  - Move the 2022 FAQ, the 2024 CS2 pages, and the CS:GO pages under `datascience/old/`.
- List the inputs csgo-ppp 8.5.3 declares for the CS2 spec's header rank averages and final scores.

## 1.0.0 / 2026-08-29

### Changed

- Harden the deploy workflows.
- Update GitHub Actions to Node.js 24 runtimes.

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
