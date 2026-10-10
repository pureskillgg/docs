---
sidebar_position: 1
---

# CSDS Spec

Documentation for CSDS channels built by FPS Critic, Inc.

One match is published as a JSON index object named `csds` plus one file per
channel, 42 in all, for 43 objects per match. The index lists the channels,
where each one sits, and what columns it declares. Every channel file is
[Apache Parquet], `header` included.

This document describes the channel set published since 2026-08-04. Revisions
through 2026-08-02 carry an older set of 30 channels, described in the
[archived spec](/datascience/old/cs2/csds/spec); the 2026-08-03 revision holds
a mix of the two. Reading each match's index object rather than assuming a
channel list will keep code working across the change.

## Changes over time

The data has changed many times since CS2 data began on 2023-11-05: channels
and columns have come and gone, types have changed, and values have been fixed.
The [changelog](./changelog.md) lists every change by date, and the
[changelog by channel](./changelog-by-channel.md) lists them channel by channel.

**Known limitation: a revision can straddle a change.** Each change is dated by
the day (UTC) it reached production, but a match sits in the revision for the
day it was processed, and a release can land partway through a day. So the
revision for a change's date can hold matches from both before and after it.
Until 2026-09-07, a revision that failed to close also carried its matches into
the next one, so one revision could hold more than one day. To tell which side
of a change a match is on, go by the match rather than its revision:
`header.rushb_version` and `header.ppp_version` name the parser and converter
releases that built it.

## How to read this

Each section below is one channel. The heading gives the channel name and its
category, and multi-event channels list the game events that write rows into
them.

**Origin** says where a column comes from:

| Origin                | Meaning                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| `replay`              | Written by the demo parser, straight off the game's own event stream.                               |
| `replay_fixed`        | A parser value the pipeline recomputed. The uncorrected value stays in the matching `*_raw` column. |
| `replay-capped`       | A parser value clamped at the top, so an unusually high number cannot single a player out.          |
| `replay-redacted`     | A parser value overwritten by the PII scrubber.                                                     |
| `calculated`          | Derived by the pipeline from the columns named under Dependents.                                    |
| `calculated-redacted` | Derived, then overwritten by the PII scrubber.                                                      |
| `merged`              | Copied in from another channel by joining on the columns named under Merge Keys.                    |

Redaction is not one operation, and the redacted columns are still there. Names
and chat text become the literal string `redacted`, `player_personal.steam_id`
becomes a per-match alias (`A`, `B`, `C` and so on) that means nothing outside
its own match, and `player_status.ping` becomes `0`. The rows are untouched, so
`player_chat` still tells you that somebody typed in a given round, without
telling you what they typed. There is no voice data anywhere in the data set.
The [data dictionary](./assets/csds_dictionary.csv) says which treatment each
column got.

**Dependents** names the columns a calculated column is computed from. A
`channel:column` entry points at another channel, and a `meta:` or `metademo:`
entry at match metadata rather than a channel.

**Merge Keys** names the columns joined on to bring a merged column in. Most
position and velocity columns arrive by an as-of merge against the nearest tick
at or before the event, so they are null when no source row is close enough.

**Type** is the type each column is written as, and the index object declares
the same type. Outside `player_vector` and `player_status`, integers are
written as `int64` and floats as `float64` (Parquet `double`), with nulls where
a column has no value. `player_vector` and `player_status` are written
compactly, with narrower integers (`int8` to `int32`) and `float32` for the
values read from the demo, as their tables show; [The player tables](#the-player-tables) says how they are sorted and read. A channel with no rows in a
match keeps its column types. The types in the tables were read from the index
objects of 50 recent matches. Three columns none of them carries,
`header.providence`, `player_info.rank_raw` and `player_info.rank_platform`,
keep the types this document gave them before, so `rank_raw` still reads
`int`, with no width. Older matches declared the type the replay
declared, often narrower than the one written (`int32`, `float32`) or with no
width (`int`), declared none for calculated and merged columns, and wrote an
empty column with Parquet's null type. The [changelog](./changelog.md) dates
the change.

**Nullable** is declared in the index object for every column. Every merged
and calculated column is declared nullable: a merged column is null where no
source row matches, and a calculated one can be null where its inputs are.

**Null means none.** A column that can have no value holds null there, not a
marker. Older matches wrote markers instead, and the [changelog](./changelog.md)
dates the change: 65535 for no player in `attacker_id` and `assister_id`
(`player_hurt`, `player_death`, `other_death`); an empty string in
`player_hurt.weapon_name`; in `molotov_state`, -1 in `player_id`,
`player_id_fixed`, `tick_throw` and `burn_duration`, and -1, -2 or 0 in
`extinguisher_id`, `extinguisher_id_fixed`, `smoke_entity_id` and
`smoke_entity_id_fixed` (an `extinguisher_id` of 0 was also the real player 0);
0, -2 or -3 in `grenade_state.tick_throw`; and -1 in
`tick.second_since_previous_phase`. The -2 in `molotov_state` (the burn ended
early, but no smoke was near enough to credit) is now `extinguisher_not_found`.

**`player_vector.movement_angle_diff`** is the angle between where a player looks
(`theta_ang`) and where they move (`movement_angle`), in -180 to 180: 0 moving the
way they look, ±90 sideways, ±180 backwards, and null while standing still. Older
matches stored `theta_ang` minus `movement_angle` with 360 added once to a negative
result, so it spanned -180 to 360 (the same angle read as 350 or -10), with -1 for
standing still. The [changelog](./changelog.md) dates the change.

**`player_vector.movement_angle`** is the direction a player moves in, from
`x_vel` and `y_vel`: 0 to 360 degrees, counterclockwise from the +x axis, and null
while standing still. Older matches stored 0 while standing still, the same as
moving along +x. The [changelog](./changelog.md) dates the change.

**Positions and view angles.** What `x_pos`, `y_pos`, `z_pos`, `theta_ang` and
`phi_ang` measure, with figures, and how to compute the angle between a
player's view and any point, are on
[Positions and View Angles](./coordinates.md).

**`player_vector` no longer stores its ten derived columns:** `second`,
`x_vel`, `y_vel`, `z_vel`, `speed_2d`, `movement_angle`, `movement_angle_diff`,
`phi_vel`, `theta_vel` and `ang_vel`. They are computed from the columns that are
stored, and they were most of the file. Compute them on load with
[pureskillgg-csgo-dsdk](https://pypi.org/project/pureskillgg-csgo-dsdk/) 3.3.1 or
later: `add_player_vector_derived_columns(player_vector)` adds all ten, with the
values the converter computes, and `player_vector_source_columns(columns)` lists
the columns to load for some of them. Code that reads them from the file breaks
on newer matches. Older matches still store them. The index still names all ten,
marked as deleted, with a comment saying how to compute them. The
[changelog](./changelog.md) dates the change. Every other channel still stores
`second`.

**The molotov flags** `molotov_state.was_extinguished_by_smoke`,
`was_extinguished_by_thrown_smoke` and `was_thrown_into_smoke` are booleans. They
describe a burn, so they are true or false on `inferno_startburn` rows and null on
every other row. `weapon_fire.missed_molotov` is a boolean too. Older matches
stored 0 and 1, with 0 on every `molotov_state` row that isn't a burn. The
[changelog](./changelog.md) dates the change.

Four columns that older versions of this document listed are no longer
published: `tick` and `second` on `player_info` and on `player_personal`. The
index still names them, marked as deleted, so a reader driven off the index
should skip any column whose origin ends in `-deleted`.

[apache parquet]: https://parquet.apache.org/

## The player tables

`player_vector` and `player_status` hold one row per player per tick, nearly
all of a match's rows. Converter 8.6.0 and later write them compactly,
with the same values:

- **Types.** Each integer takes the smallest signed type that holds it with
  room to spare: `int8`, `int16` or `int32`. The floats read from the demo
  are `float32`, the type the game sends them in, so their values are
  unchanged. `player_status.second` (tick / 64) is `float32` too, and
  exact. `place_name` is a dictionary-encoded string. Each table's section
  gives every column's type. Converter 8.6.0 to 8.7.2 still stored
  `player_vector`'s derived columns: `second` as `float32` and the
  velocities and angles as `float64`.
- **Row order.** Rows are sorted by `player_id`, then `tick`. Sort by `tick`,
  then `player_id`, for tick order.
- **`current_ammo`.** Parser 5.4.0 and earlier read every magazine one
  low, so an empty one wrapped to `4294967295`; compact files write that as
  `-1`. Parser 5.4.1 and later read the real count, with `0` for an empty
  magazine, so `-1` appears only where the parser was older.
- **pandas.** The files' pandas metadata names the narrow types, so
  `pd.read_parquet` gives nullable `Int8`, `Int16` or `Int32` where older
  files gave `Int64`, `int32` for `tick`, `float32`, a category for
  `place_name`, and the nullable `boolean` for `burst_mode` and
  `is_silenced`.
- **Narrow integers can wrap.** pandas and polars keep `int16` in
  element-wise arithmetic, so with `int16` `money`, `money * 5` gives 14,464
  for 16,000. Cast to a wider type first, for example
  `df["money"].astype("Int64")`. Sums and means widen on their own.

Files written by converter 8.5.4 and earlier keep the old format: `int64`
integers, `double` floats, plain strings, rows in tick order, and
`current_ammo`'s `4294967295` as the parser wrote it. A match's
`header.ppp_version` names the converter release that built it, and each
file's own schema says which format it is.

**Reading the files.** pyarrow (pandas' default engine), polars and DuckDB
read both formats. fastparquet can't read the compact files: their floats
use Parquet's byte stream split encoding, which it doesn't support.

**Reading old and compact files together.** pandas widens on its own;
polars and DuckDB need to be told to:

- **pandas:** `pd.concat` of the frames widens each column to the wider type.
- **polars:** `pl.concat([pl.scan_parquet(f) for f in files], how="diagonal_relaxed")`.
  `pl.scan_parquet(files)` on a list raises a schema mismatch, whichever
  file comes first.
- **DuckDB:** `read_parquet([...], union_by_name = true)`. Without
  `union_by_name`, DuckDB reads every file at the first file's types.

## bomb_action - multi_event

Events that trigger this channel: bomb_abort_plant, bomb_begin_plant, bomb_dropped, bomb_pickup, player_given_c4

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| event_type         | string  | False    | replay     |                 |                            |
| player_id          | int64   | True     | replay     |                 |                            |
| player_id_pawn     | int64   | True     | replay     |                 |                            |
| site_code          | int64   | True     | replay     |                 |                            |
| entity_id          | int64   | True     | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## bomb_defuse - multi_event

Events that trigger this channel: bomb_abort_defuse, bomb_begin_defuse

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| event_type         | string  | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| has_kit            | bool    | True     | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## bomb_state - multi_event

Events that trigger this channel: bomb_defused, bomb_exploded, bomb_planted

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| event_type         | string  | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| site_code          | int64   | True     | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## bot_takeover - single_event

Event that triggers this channel: bot_takeover

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| player_index       | int64   | False    | replay     |                 |                            |
| bot_id             | int64   | True     | replay     |                 |                            |
| is_controlling     | bool    | False    | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## bullet_damage - single_event

Event that triggers this channel: bullet_damage

| Col Name             | Type    | Nullable | Origin     | Dependents      | Merge Keys                   |
| -------------------- | ------- | -------- | ---------- | --------------- | ---------------------------- |
| round                | int64   | False    | replay     |                 |                              |
| tick                 | int64   | False    | replay     |                 |                              |
| player_id            | int64   | False    | replay     |                 |                              |
| attacker_id          | int64   | False    | replay     |                 |                              |
| distance             | float64 | False    | replay     |                 |                              |
| damage_dir_x         | float64 | False    | replay     |                 |                              |
| damage_dir_y         | float64 | False    | replay     |                 |                              |
| damage_dir_z         | float64 | False    | replay     |                 |                              |
| num_penetrations     | int64   | False    | replay     |                 |                              |
| is_no_scope          | bool    | False    | replay     |                 |                              |
| is_attacker_in_air   | bool    | False    | replay     |                 |                              |
| second               | float64 | True     | calculated | tick, tick_rate |                              |
| player_id_fixed      | int64   | True     | merged     |                 | player_id, round, steam_id   |
| attacker_id_fixed    | int64   | True     | merged     |                 | attacker_id, round, steam_id |
| player_x_pos         | float64 | True     | merged     |                 | player_id, tick              |
| player_y_pos         | float64 | True     | merged     |                 | player_id, tick              |
| player_z_pos         | float64 | True     | merged     |                 | player_id, tick              |
| player_x_vel         | float64 | True     | merged     |                 | player_id, tick              |
| player_y_vel         | float64 | True     | merged     |                 | player_id, tick              |
| player_z_vel         | float64 | True     | merged     |                 | player_id, tick              |
| player_phi_ang       | float64 | True     | merged     |                 | player_id, tick              |
| player_theta_ang     | float64 | True     | merged     |                 | player_id, tick              |
| player_weapon_code   | int64   | True     | merged     |                 | player_id, tick              |
| player_team_code     | int64   | True     | merged     |                 | player_id, tick              |
| attacker_x_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_y_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_z_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_x_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_y_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_z_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_phi_ang     | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_theta_ang   | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_weapon_code | int64   | True     | merged     |                 | attacker_id, tick            |
| attacker_team_code   | int64   | True     | merged     |                 | attacker_id, tick            |

## grenade_bounce - single_event

Event that triggers this channel: grenade_bounce

| Col Name        | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| --------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round           | int64   | False    | replay     |                 |                            |
| tick            | int64   | False    | replay     |                 |                            |
| entity_id       | int64   | False    | replay     |                 |                            |
| grenade_id      | int64   | False    | replay     |                 |                            |
| player_id       | int64   | False    | replay     |                 |                            |
| bounce_nr       | int64   | False    | replay     |                 |                            |
| x_pos           | float64 | False    | replay     |                 |                            |
| y_pos           | float64 | False    | replay     |                 |                            |
| z_pos           | float64 | False    | replay     |                 |                            |
| second          | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed | int64   | True     | merged     |                 | player_id, round, steam_id |

## grenade_state - multi_event

Events that trigger this channel: decoy_detonate, decoy_firing, decoy_started, flashbang_detonate, hegrenade_detonate, smokegrenade_detonate, smokegrenade_expired

| Col Name           | Type    | Nullable | Origin     | Dependents                          | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | ----------------------------------- | -------------------------- |
| round              | int64   | False    | replay     |                                     |                            |
| tick               | int64   | False    | replay     |                                     |                            |
| event_type         | string  | False    | replay     |                                     |                            |
| entity_id          | int64   | False    | replay     |                                     |                            |
| grenade_id         | int64   | True     | replay     |                                     |                            |
| player_id          | int64   | False    | replay     |                                     |                            |
| x_pos              | float64 | False    | replay     |                                     |                            |
| y_pos              | float64 | False    | replay     |                                     |                            |
| z_pos              | float64 | False    | replay     |                                     |                            |
| second             | float64 | True     | calculated | tick, tick_rate                     |                            |
| player_id_fixed    | int64   | True     | merged     |                                     | player_id, round, steam_id |
| entity_id_fixed    | int64   | True     | calculated | round, entity_id, event_type, tick  |                            |
| tick_throw         | int64   | True     | calculated | round, player_id, weapon_name, tick |                            |
| player_x_pos       | float64 | True     | merged     |                                     | tick_throw, player_id      |
| player_y_pos       | float64 | True     | merged     |                                     | tick_throw, player_id      |
| player_z_pos       | float64 | True     | merged     |                                     | tick_throw, player_id      |
| player_x_vel       | float64 | True     | merged     |                                     | tick_throw, player_id      |
| player_y_vel       | float64 | True     | merged     |                                     | tick_throw, player_id      |
| player_z_vel       | float64 | True     | merged     |                                     | tick_throw, player_id      |
| player_phi_ang     | float64 | True     | merged     |                                     | tick_throw, player_id      |
| player_theta_ang   | float64 | True     | merged     |                                     | tick_throw, player_id      |
| player_weapon_code | int64   | True     | merged     |                                     | tick_throw, player_id      |
| player_team_code   | int64   | True     | merged     |                                     | tick_throw, player_id      |

## grenade_vector - telemetry

Event that triggers this channel: tick_end

| Col Name            | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round               | int64   | False    | replay     |                 |                            |
| tick                | int64   | False    | replay     |                 |                            |
| entity_id           | int64   | False    | replay     |                 |                            |
| grenade_id          | int64   | False    | replay     |                 |                            |
| player_id           | int64   | False    | replay     |                 |                            |
| grenade_weapon_code | int64   | True     | replay     |                 |                            |
| grenade_type        | string  | False    | replay     |                 |                            |
| x_pos               | float64 | False    | replay     |                 |                            |
| y_pos               | float64 | False    | replay     |                 |                            |
| z_pos               | float64 | False    | replay     |                 |                            |
| second              | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed     | int64   | True     | merged     |                 | player_id, round, steam_id |

## header - header

| Col Name                   | Type    | Nullable | Origin              | Dependents                                                                                       | Merge Keys |
| -------------------------- | ------- | -------- | ------------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| magic                      | string  | False    | replay              |                                                                                                  |            |
| server_name                | string  | False    | replay              |                                                                                                  |            |
| client_name                | string  | False    | replay              |                                                                                                  |            |
| map_name                   | string  | False    | replay              |                                                                                                  |            |
| game_directory             | string  | False    | replay              |                                                                                                  |            |
| fullpackets_version        | int64   | False    | replay              |                                                                                                  |            |
| allow_clientside_entities  | bool    | False    | replay              |                                                                                                  |            |
| allow_clientside_particles | bool    | False    | replay              |                                                                                                  |            |
| addons                     | string  | False    | replay              |                                                                                                  |            |
| demo_version_name          | string  | False    | replay              |                                                                                                  |            |
| demo_version_guid          | string  | False    | replay              |                                                                                                  |            |
| build_num                  | int64   | False    | replay              |                                                                                                  |            |
| game                       | string  | True     | calculated          | meta:game                                                                                        |            |
| is_gotv_recording          | bool    | False    | replay              |                                                                                                  |            |
| is_wingman                 | bool    | False    | replay              |                                                                                                  |            |
| max_unique_players         | int64   | False    | replay              |                                                                                                  |            |
| rank_type                  | int64   | True     | replay              |                                                                                                  |            |
| tick_rate                  | int64   | True     | calculated          |                                                                                                  |            |
| tick_save_rate             | int64   | True     | calculated          |                                                                                                  |            |
| rushb_version              | string  | True     | calculated          | meta:metadata.rushbVersion                                                                       |            |
| ppp_version                | string  | True     | calculated          | meta:context.version                                                                             |            |
| match_date                 | string  | True     | calculated          | meta:matchDate                                                                                   |            |
| demo_id                    | string  | True     | calculated-redacted | meta:demoId                                                                                      |            |
| sharecode                  | string  | True     | calculated-redacted | meta:sharecode                                                                                   |            |
| platform                   | string  | True     | calculated          | meta:platform                                                                                    |            |
| match_type                 | string  | True     | calculated          | meta:matchType                                                                                   |            |
| t_starters_avg_rank        | float64 | True     | calculated          | is_bot, round, rank, steam_id, team_code, max_rounds                                             |            |
| t_starters_avg_wins        | float64 | True     | calculated          | is_bot, round, wins, steam_id, team_code, max_rounds                                             |            |
| ct_starters_avg_rank       | float64 | True     | calculated          | is_bot, round, rank, steam_id, team_code, max_rounds                                             |            |
| ct_starters_avg_wins       | float64 | True     | calculated          | is_bot, round, wins, steam_id, team_code, max_rounds                                             |            |
| ct_starters_score_final    | int64   | True     | calculated          | round_state:t_score, round_state:ct_score, round_state:round, round_state:event_type, max_rounds |            |
| t_starters_score_final     | int64   | True     | calculated          | round_state:t_score, round_state:ct_score, round_state:round, round_state:event_type, max_rounds |            |
| unique_steamids            | int64   | True     | calculated          | player_personal:steam_id                                                                         |            |
| providence                 | string  | True     | calculated          | metademo:providence                                                                              |            |
| number_of_points           | int64   | True     | calculated          | shape of all data frames                                                                         |            |

## item_dropped - single_event

Event that triggers this channel: item_dropped

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| entity_id          | int64   | False    | replay     |                 |                            |
| item               | string  | False    | replay     |                 |                            |
| def_index          | int64   | False    | replay     |                 |                            |
| x_pos              | float64 | False    | replay     |                 |                            |
| y_pos              | float64 | False    | replay     |                 |                            |
| z_pos              | float64 | False    | replay     |                 |                            |
| reason             | string  | False    | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## item_equip - single_event

Event that triggers this channel: item_equip

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| item               | string  | False    | replay     |                 |                            |
| can_zoom           | bool    | False    | replay     |                 |                            |
| has_silencer       | bool    | False    | replay     |                 |                            |
| is_silenced        | bool    | False    | replay     |                 |                            |
| has_tracers        | bool    | False    | replay     |                 |                            |
| weapon_type_code   | int64   | False    | replay     |                 |                            |
| is_painted         | bool    | False    | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## item_pickup - single_event

Event that triggers this channel: item_pickup

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| item               | string  | False    | replay     |                 |                            |
| def_index          | int64   | False    | replay     |                 |                            |
| is_silent          | bool    | False    | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## item_refund - single_event

Event that triggers this channel: item_refund

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| item               | string  | False    | replay     |                 |                            |
| def_index          | int64   | False    | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## molotov_fire - telemetry

Event that triggers this channel: tick_end

| Col Name        | Type    | Nullable | Origin     | Dependents             | Merge Keys                 |
| --------------- | ------- | -------- | ---------- | ---------------------- | -------------------------- |
| round           | int64   | False    | replay     |                        |                            |
| tick            | int64   | False    | replay     |                        |                            |
| entity_id       | int64   | False    | replay     |                        |                            |
| player_id       | int64   | False    | replay     |                        |                            |
| fire_index      | int64   | False    | replay     |                        |                            |
| x_pos           | float64 | False    | replay     |                        |                            |
| y_pos           | float64 | False    | replay     |                        |                            |
| z_pos           | float64 | False    | replay     |                        |                            |
| is_burning      | bool    | False    | replay     |                        |                            |
| second          | float64 | True     | calculated | tick, tick_rate        |                            |
| player_id_fixed | int64   | True     | merged     |                        | player_id, round, steam_id |
| entity_id_fixed | int64   | True     | calculated | round, entity_id, tick |                            |

## molotov_state - multi_event

Events that trigger this channel: inferno_detonate, inferno_expire, inferno_extinguish, inferno_startburn

| Col Name                         | Type    | Nullable | Origin     | Dependents                                                                           | Merge Keys            |
| -------------------------------- | ------- | -------- | ---------- | ------------------------------------------------------------------------------------ | --------------------- |
| round                            | int64   | False    | replay     |                                                                                      |                       |
| tick                             | int64   | False    | replay     |                                                                                      |                       |
| event_type                       | string  | False    | replay     |                                                                                      |                       |
| entity_id                        | int64   | False    | replay     |                                                                                      |                       |
| x_pos                            | float64 | False    | replay     |                                                                                      |                       |
| y_pos                            | float64 | False    | replay     |                                                                                      |                       |
| z_pos                            | float64 | False    | replay     |                                                                                      |                       |
| second                           | float64 | True     | calculated | tick, tick_rate                                                                      |                       |
| entity_id_fixed                  | int64   | True     | calculated | round, entity_id, event_type, tick                                                   |                       |
| player_id                        | int64   | True     | calculated | event_type, second, round                                                            |                       |
| player_id_fixed                  | int64   | True     | calculated | event_type, second, round                                                            |                       |
| tick_throw                       | int64   | True     | calculated | event_type, second, round                                                            |                       |
| player_x_pos                     | float64 | True     | merged     |                                                                                      | tick_throw, player_id |
| player_y_pos                     | float64 | True     | merged     |                                                                                      | tick_throw, player_id |
| player_z_pos                     | float64 | True     | merged     |                                                                                      | tick_throw, player_id |
| player_x_vel                     | float64 | True     | merged     |                                                                                      | tick_throw, player_id |
| player_y_vel                     | float64 | True     | merged     |                                                                                      | tick_throw, player_id |
| player_z_vel                     | float64 | True     | merged     |                                                                                      | tick_throw, player_id |
| player_phi_ang                   | float64 | True     | merged     |                                                                                      | tick_throw, player_id |
| player_theta_ang                 | float64 | True     | merged     |                                                                                      | tick_throw, player_id |
| player_weapon_code               | int64   | True     | merged     |                                                                                      | tick_throw, player_id |
| player_team_code                 | int64   | True     | merged     |                                                                                      | tick_throw, player_id |
| burn_duration                    | float64 | True     | calculated | second, entity_id_fixed, event_type                                                  |                       |
| was_extinguished_by_smoke        | bool    | True     | calculated | second, entity_id_fixed, event_type, burn_duration                                   |                       |
| extinguisher_id                  | int64   | True     | calculated | second, entity_id_fixed, event_type, x_pos, y_pos, z_pos, player_id                  |                       |
| extinguisher_id_fixed            | int64   | True     | calculated | second, entity_id, entity_id_fixed, event_type, x_pos, y_pos, z_pos, player_id_fixed |                       |
| smoke_entity_id                  | int64   | True     | calculated | second, entity_id, entity_id_fixed, event_type, x_pos, y_pos, z_pos                  |                       |
| smoke_entity_id_fixed            | int64   | True     | calculated | second, entity_id, entity_id_fixed, event_type, x_pos, y_pos, z_pos                  |                       |
| was_extinguished_by_thrown_smoke | bool    | True     | calculated | second, entity_id, entity_id_fixed, event_type, x_pos, y_pos, z_pos                  |                       |
| fraction_extinguished            | float64 | True     | calculated | second, entity_id_fixed, event_type, x_pos, y_pos, z_pos                             |                       |
| was_thrown_into_smoke            | bool    | True     | calculated | second, entity_id_fixed, event_type, x_pos, y_pos, z_pos                             |                       |
| extinguisher_not_found           | bool    | True     | calculated | extinguisher_id                                                                      |                       |

## other_death - single_event

Event that triggers this channel: other_death

| Col Name             | Type    | Nullable | Origin     | Dependents      | Merge Keys                   |
| -------------------- | ------- | -------- | ---------- | --------------- | ---------------------------- |
| round                | int64   | False    | replay     |                 |                              |
| tick                 | int64   | False    | replay     |                 |                              |
| other_type           | string  | False    | replay     |                 |                              |
| attacker_id          | int64   | True     | replay     |                 |                              |
| weapon_name          | string  | False    | replay     |                 |                              |
| is_headshot          | bool    | False    | replay     |                 |                              |
| penetration_amount   | int64   | False    | replay     |                 |                              |
| is_through_smoke     | bool    | True     | replay     |                 |                              |
| is_attacker_blind    | bool    | True     | replay     |                 |                              |
| is_noscope           | bool    | True     | replay     |                 |                              |
| second               | float64 | True     | calculated | tick, tick_rate |                              |
| attacker_id_fixed    | int64   | True     | merged     |                 | attacker_id, round, steam_id |
| attacker_x_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_y_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_z_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_x_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_y_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_z_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_phi_ang     | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_theta_ang   | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_weapon_code | int64   | True     | merged     |                 | attacker_id, tick            |
| attacker_team_code   | int64   | True     | merged     |                 | attacker_id, tick            |

## player_blind - single_event

Event that triggers this channel: player_blind

| Col Name             | Type    | Nullable | Origin     | Dependents      | Merge Keys                   |
| -------------------- | ------- | -------- | ---------- | --------------- | ---------------------------- |
| round                | int64   | False    | replay     |                 |                              |
| tick                 | int64   | False    | replay     |                 |                              |
| player_id            | int64   | False    | replay     |                 |                              |
| entity_id            | int64   | False    | replay     |                 |                              |
| attacker_id          | int64   | False    | replay     |                 |                              |
| blind_duration       | float64 | False    | replay     |                 |                              |
| second               | float64 | True     | calculated | tick, tick_rate |                              |
| player_id_fixed      | int64   | True     | merged     |                 | player_id, round, steam_id   |
| attacker_id_fixed    | int64   | True     | merged     |                 | attacker_id, round, steam_id |
| player_x_pos         | float64 | True     | merged     |                 | player_id, tick              |
| player_y_pos         | float64 | True     | merged     |                 | player_id, tick              |
| player_z_pos         | float64 | True     | merged     |                 | player_id, tick              |
| player_x_vel         | float64 | True     | merged     |                 | player_id, tick              |
| player_y_vel         | float64 | True     | merged     |                 | player_id, tick              |
| player_z_vel         | float64 | True     | merged     |                 | player_id, tick              |
| player_phi_ang       | float64 | True     | merged     |                 | player_id, tick              |
| player_theta_ang     | float64 | True     | merged     |                 | player_id, tick              |
| player_weapon_code   | int64   | True     | merged     |                 | player_id, tick              |
| player_team_code     | int64   | True     | merged     |                 | player_id, tick              |
| attacker_x_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_y_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_z_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_x_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_y_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_z_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_phi_ang     | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_theta_ang   | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_weapon_code | int64   | True     | merged     |                 | attacker_id, tick            |
| attacker_team_code   | int64   | True     | merged     |                 | attacker_id, tick            |

## player_chat - single_event

Event that triggers this channel: player_chat

| Col Name           | Type    | Nullable | Origin          | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | --------------- | --------------- | -------------------------- |
| round              | int64   | False    | replay          |                 |                            |
| tick               | int64   | False    | replay          |                 |                            |
| player_id          | int64   | False    | replay          |                 |                            |
| text               | string  | False    | replay-redacted |                 |                            |
| is_chat_all        | bool    | True     | replay          |                 |                            |
| second             | float64 | True     | calculated      | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged          |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged          |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged          |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged          |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged          |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged          |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged          |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged          |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged          |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged          |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged          |                 | player_id, tick            |

## player_connect - single_event

Event that triggers this channel: player_connect

| Col Name        | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| --------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round           | int64   | False    | replay     |                 |                            |
| tick            | int64   | False    | replay     |                 |                            |
| player_index    | int64   | False    | replay     |                 |                            |
| player_id       | int64   | False    | replay     |                 |                            |
| is_bot          | bool    | False    | replay     |                 |                            |
| second          | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed | int64   | True     | merged     |                 | player_id, round, steam_id |

## player_death - single_event

Event that triggers this channel: player_death

| Col Name             | Type    | Nullable | Origin     | Dependents      | Merge Keys                   |
| -------------------- | ------- | -------- | ---------- | --------------- | ---------------------------- |
| round                | int64   | False    | replay     |                 |                              |
| tick                 | int64   | False    | replay     |                 |                              |
| player_id            | int64   | False    | replay     |                 |                              |
| attacker_id          | int64   | True     | replay     |                 |                              |
| assister_id          | int64   | True     | replay     |                 |                              |
| weapon_name          | string  | False    | replay     |                 |                              |
| is_headshot          | bool    | False    | replay     |                 |                              |
| penetration_amount   | int64   | False    | replay     |                 |                              |
| has_replay           | bool    | False    | replay     |                 |                              |
| is_flash_assist      | bool    | True     | replay     |                 |                              |
| is_through_smoke     | bool    | True     | replay     |                 |                              |
| is_attacker_blind    | bool    | True     | replay     |                 |                              |
| is_noscope           | bool    | True     | replay     |                 |                              |
| second               | float64 | True     | calculated | tick, tick_rate |                              |
| player_id_fixed      | int64   | True     | merged     |                 | player_id, round, steam_id   |
| attacker_id_fixed    | int64   | True     | merged     |                 | attacker_id, round, steam_id |
| assister_id_fixed    | int64   | True     | merged     |                 | assister_id, round, steam_id |
| player_x_pos         | float64 | True     | merged     |                 | player_id, tick              |
| player_y_pos         | float64 | True     | merged     |                 | player_id, tick              |
| player_z_pos         | float64 | True     | merged     |                 | player_id, tick              |
| player_x_vel         | float64 | True     | merged     |                 | player_id, tick              |
| player_y_vel         | float64 | True     | merged     |                 | player_id, tick              |
| player_z_vel         | float64 | True     | merged     |                 | player_id, tick              |
| player_phi_ang       | float64 | True     | merged     |                 | player_id, tick              |
| player_theta_ang     | float64 | True     | merged     |                 | player_id, tick              |
| player_weapon_code   | int64   | True     | merged     |                 | player_id, tick              |
| player_team_code     | int64   | True     | merged     |                 | player_id, tick              |
| attacker_x_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_y_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_z_pos       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_x_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_y_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_z_vel       | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_phi_ang     | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_theta_ang   | float64 | True     | merged     |                 | attacker_id, tick            |
| attacker_weapon_code | int64   | True     | merged     |                 | attacker_id, tick            |
| attacker_team_code   | int64   | True     | merged     |                 | attacker_id, tick            |
| assister_x_pos       | float64 | True     | merged     |                 | assister_id, tick            |
| assister_y_pos       | float64 | True     | merged     |                 | assister_id, tick            |
| assister_z_pos       | float64 | True     | merged     |                 | assister_id, tick            |
| assister_x_vel       | float64 | True     | merged     |                 | assister_id, tick            |
| assister_y_vel       | float64 | True     | merged     |                 | assister_id, tick            |
| assister_z_vel       | float64 | True     | merged     |                 | assister_id, tick            |
| assister_phi_ang     | float64 | True     | merged     |                 | assister_id, tick            |
| assister_theta_ang   | float64 | True     | merged     |                 | assister_id, tick            |
| assister_weapon_code | int64   | True     | merged     |                 | assister_id, tick            |
| assister_team_code   | int64   | True     | merged     |                 | assister_id, tick            |

## player_disconnect - single_event

Event that triggers this channel: player_disconnect

| Col Name          | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ----------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round             | int64   | False    | replay     |                 |                            |
| tick              | int64   | False    | replay     |                 |                            |
| player_id         | int64   | False    | replay     |                 |                            |
| disconnect_reason | string  | False    | replay     |                 |                            |
| is_bot            | bool    | False    | replay     |                 |                            |
| second            | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed   | int64   | True     | merged     |                 | player_id, round, steam_id |

## player_footstep - single_event

Event that triggers this channel: player_footstep

| Col Name        | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| --------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round           | int64   | False    | replay     |                 |                            |
| tick            | int64   | False    | replay     |                 |                            |
| player_id       | int64   | False    | replay     |                 |                            |
| second          | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed | int64   | True     | merged     |                 | player_id, round, steam_id |

## player_hurt - single_event

Event that triggers this channel: player_hurt

| Col Name                 | Type    | Nullable | Origin     | Dependents               | Merge Keys                   |
| ------------------------ | ------- | -------- | ---------- | ------------------------ | ---------------------------- |
| round                    | int64   | False    | replay     |                          |                              |
| tick                     | int64   | False    | replay     |                          |                              |
| player_id                | int64   | False    | replay     |                          |                              |
| attacker_id              | int64   | True     | replay     |                          |                              |
| health                   | int64   | False    | replay     |                          |                              |
| armor                    | int64   | False    | replay     |                          |                              |
| weapon_name              | string  | True     | replay     |                          |                              |
| health_removed           | int64   | False    | replay     |                          |                              |
| armor_removed            | int64   | False    | replay     |                          |                              |
| hit_box_code             | int64   | False    | replay     |                          |                              |
| second                   | float64 | True     | calculated | tick, tick_rate          |                              |
| player_id_fixed          | int64   | True     | merged     |                          | player_id, round, steam_id   |
| attacker_id_fixed        | int64   | True     | merged     |                          | attacker_id, round, steam_id |
| player_x_pos             | float64 | True     | merged     |                          | player_id, tick              |
| player_y_pos             | float64 | True     | merged     |                          | player_id, tick              |
| player_z_pos             | float64 | True     | merged     |                          | player_id, tick              |
| player_x_vel             | float64 | True     | merged     |                          | player_id, tick              |
| player_y_vel             | float64 | True     | merged     |                          | player_id, tick              |
| player_z_vel             | float64 | True     | merged     |                          | player_id, tick              |
| player_phi_ang           | float64 | True     | merged     |                          | player_id, tick              |
| player_theta_ang         | float64 | True     | merged     |                          | player_id, tick              |
| player_weapon_code       | int64   | True     | merged     |                          | player_id, tick              |
| player_team_code         | int64   | True     | merged     |                          | player_id, tick              |
| attacker_x_pos           | float64 | True     | merged     |                          | attacker_id, tick            |
| attacker_y_pos           | float64 | True     | merged     |                          | attacker_id, tick            |
| attacker_z_pos           | float64 | True     | merged     |                          | attacker_id, tick            |
| attacker_x_vel           | float64 | True     | merged     |                          | attacker_id, tick            |
| attacker_y_vel           | float64 | True     | merged     |                          | attacker_id, tick            |
| attacker_z_vel           | float64 | True     | merged     |                          | attacker_id, tick            |
| attacker_phi_ang         | float64 | True     | merged     |                          | attacker_id, tick            |
| attacker_theta_ang       | float64 | True     | merged     |                          | attacker_id, tick            |
| attacker_weapon_code     | int64   | True     | merged     |                          | attacker_id, tick            |
| attacker_team_code       | int64   | True     | merged     |                          | attacker_id, tick            |
| effective_health_removed | int64   | True     | calculated | player_id, round, health |                              |

## player_info - player_info

Event that triggers this channel: round_freeze_end

| Col Name         | Type    | Nullable | Origin        | Dependents           | Merge Keys                 |
| ---------------- | ------- | -------- | ------------- | -------------------- | -------------------------- |
| round            | int64   | False    | replay        |                      |                            |
| player_id        | int64   | False    | replay        |                      |                            |
| team_code        | int64   | False    | replay        |                      |                            |
| wins             | int64   | False    | replay-capped |                      |                            |
| rank             | int64   | False    | replay        |                      |                            |
| rank_type        | int64   | False    | replay        |                      |                            |
| radar_color_code | int64   | False    | replay        |                      |                            |
| player_id_fixed  | int64   | True     | merged        |                      | player_id, round, steam_id |
| rank_raw         | int     | True     | calculated    | player_info:rank     |                            |
| rank_platform    | float64 | True     | calculated    | player_personal:rank |                            |

## player_inputs - telemetry

Event that triggers this channel: player_buttons_state_update

| Col Name               | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ---------------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round                  | int64   | False    | replay     |                 |                            |
| tick                   | int64   | False    | replay     |                 |                            |
| player_id              | int64   | False    | replay     |                 |                            |
| buttons_mask           | int64   | False    | replay     |                 |                            |
| button_attack          | bool    | False    | replay     |                 |                            |
| button_attack2         | bool    | False    | replay     |                 |                            |
| button_jump            | bool    | False    | replay     |                 |                            |
| button_duck            | bool    | False    | replay     |                 |                            |
| button_forward         | bool    | False    | replay     |                 |                            |
| button_back            | bool    | False    | replay     |                 |                            |
| button_move_left       | bool    | False    | replay     |                 |                            |
| button_move_right      | bool    | False    | replay     |                 |                            |
| button_turn_left       | bool    | False    | replay     |                 |                            |
| button_turn_right      | bool    | False    | replay     |                 |                            |
| button_use             | bool    | False    | replay     |                 |                            |
| button_reload          | bool    | False    | replay     |                 |                            |
| button_speed           | bool    | False    | replay     |                 |                            |
| button_score           | bool    | False    | replay     |                 |                            |
| button_look_at_weapon  | bool    | False    | replay     |                 |                            |
| button_zoom            | bool    | False    | replay     |                 |                            |
| button_use_or_reload   | bool    | False    | replay     |                 |                            |
| button_joy_auto_sprint | bool    | False    | replay     |                 |                            |
| second                 | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed        | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos           | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos           | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos           | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel           | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel           | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel           | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang         | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang       | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code     | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code       | int64   | True     | merged     |                 | player_id, tick            |

## player_name - single_event

Event that triggers this channel: player_name

| Col Name        | Type    | Nullable | Origin          | Dependents      | Merge Keys                 |
| --------------- | ------- | -------- | --------------- | --------------- | -------------------------- |
| round           | int64   | False    | replay          |                 |                            |
| tick            | int64   | False    | replay          |                 |                            |
| player_id       | int64   | False    | replay          |                 |                            |
| name_new        | string  | False    | replay-redacted |                 |                            |
| name_old        | string  | False    | replay-redacted |                 |                            |
| second          | float64 | True     | calculated      | tick, tick_rate |                            |
| player_id_fixed | int64   | True     | merged          |                 | player_id, round, steam_id |

## player_personal - player_info

Event that triggers this channel: round_freeze_end

| Col Name             | Type   | Nullable | Origin          | Dependents       | Merge Keys |
| -------------------- | ------ | -------- | --------------- | ---------------- | ---------- |
| round                | int64  | False    | replay          |                  |            |
| player_id            | int64  | False    | replay          |                  |            |
| player_controller_id | int64  | False    | replay          |                  |            |
| player_id_pawn       | int64  | False    | replay          |                  |            |
| name                 | string | False    | replay-redacted |                  |            |
| clan_tag             | string | False    | replay-redacted |                  |            |
| steam_id             | string | False    | replay-redacted |                  |            |
| is_bot               | bool   | True     | calculated      | steam_id         |            |
| player_id_fixed      | int64  | True     | calculated      | steam_id, is_bot |            |

## player_sound - single_event

Event that triggers this channel: player_sound

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| radius             | int64   | False    | replay     |                 |                            |
| duration           | float64 | False    | replay     |                 |                            |
| is_step            | bool    | False    | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## player_spawn - single_event

Event that triggers this channel: player_spawn

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## player_status - telemetry

Event that triggers this channel: tick_end

Converter 8.6.0 and later write this table with the types below, sorted by player, then tick; see [The player tables](#the-player-tables).

| Col Name                      | Type    | Nullable | Origin          | Dependents                                                                                                                                                            | Merge Keys                 |
| ----------------------------- | ------- | -------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| tick                          | int32   | False    | replay          |                                                                                                                                                                       |                            |
| round                         | int16   | False    | replay          |                                                                                                                                                                       |                            |
| player_id                     | int32   | False    | replay          |                                                                                                                                                                       |                            |
| player_controller_id          | int8    | False    | replay          |                                                                                                                                                                       |                            |
| armor                         | int8    | False    | replay          |                                                                                                                                                                       |                            |
| health                        | int8    | False    | replay          |                                                                                                                                                                       |                            |
| place_name                    | string  | False    | replay          |                                                                                                                                                                       |                            |
| inv_primary                   | int16   | False    | replay          |                                                                                                                                                                       |                            |
| inv_secondary                 | int16   | False    | replay          |                                                                                                                                                                       |                            |
| inv_flashbang                 | int8    | False    | replay          |                                                                                                                                                                       |                            |
| inv_taser                     | int8    | False    | replay          |                                                                                                                                                                       |                            |
| inv_hegrenade                 | int8    | False    | replay          |                                                                                                                                                                       |                            |
| inv_smokegrenade              | int8    | False    | replay          |                                                                                                                                                                       |                            |
| inv_molotov                   | int8    | False    | replay          |                                                                                                                                                                       |                            |
| inv_decoy                     | int8    | False    | replay          |                                                                                                                                                                       |                            |
| inv_incgrenade                | int8    | False    | replay          |                                                                                                                                                                       |                            |
| inv_c4                        | int8    | False    | replay          |                                                                                                                                                                       |                            |
| current_equipment_cost        | int16   | False    | replay          |                                                                                                                                                                       |                            |
| freezetime_end_equipment_cost | int16   | False    | replay          |                                                                                                                                                                       |                            |
| money                         | int16   | False    | replay          |                                                                                                                                                                       |                            |
| ping                          | int16   | False    | replay-redacted |                                                                                                                                                                       |                            |
| round_start_equipment_cost    | int16   | False    | replay          |                                                                                                                                                                       |                            |
| zoom_level                    | int8    | True     | replay          |                                                                                                                                                                       |                            |
| iron_sight_mode               | int8    | True     | replay          |                                                                                                                                                                       |                            |
| burst_mode                    | bool    | True     | replay          |                                                                                                                                                                       |                            |
| is_silenced                   | bool    | True     | replay          |                                                                                                                                                                       |                            |
| weapon_mode                   | int8    | True     | replay          |                                                                                                                                                                       |                            |
| flash_duration                | float32 | False    | replay          |                                                                                                                                                                       |                            |
| flash_max_alpha               | float32 | False    | replay          |                                                                                                                                                                       |                            |
| has_c4                        | bool    | False    | replay          |                                                                                                                                                                       |                            |
| has_defuser                   | bool    | False    | replay          |                                                                                                                                                                       |                            |
| has_helmet                    | bool    | False    | replay          |                                                                                                                                                                       |                            |
| is_defusing                   | bool    | False    | replay          |                                                                                                                                                                       |                            |
| is_fake_player                | bool    | False    | replay          |                                                                                                                                                                       |                            |
| is_in_bomb_zone               | bool    | False    | replay          |                                                                                                                                                                       |                            |
| is_in_buy_zone                | bool    | False    | replay          |                                                                                                                                                                       |                            |
| is_reloading                  | bool    | False    | replay          |                                                                                                                                                                       |                            |
| is_scoped                     | bool    | False    | replay          |                                                                                                                                                                       |                            |
| is_spotted                    | bool    | False    | replay          |                                                                                                                                                                       |                            |
| is_walking                    | bool    | False    | replay          |                                                                                                                                                                       |                            |
| second                        | float32 | True     | calculated      | tick, tick_rate                                                                                                                                                       |                            |
| player_id_fixed               | int8    | True     | merged          |                                                                                                                                                                       | player_id, round, steam_id |
| equipment_value_calc          | int16   | True     | calculated      | inv_flashbang, inv_taser, inv_hegrenade, inv_smokegrenade, inv_molotov, inv_decoy, inv_incgrenade, inv_c4, armor, has_defuser, has_helmet, inv_primary, inv_secondary |                            |

## player_vector - telemetry

Event that triggers this channel: tick_end

Converter 8.6.0 and later write this table with the types below, sorted by player, then tick; see [The player tables](#the-player-tables).

| Col Name              | Type    | Nullable | Origin | Dependents | Merge Keys                 |
| --------------------- | ------- | -------- | ------ | ---------- | -------------------------- |
| tick                  | int32   | False    | replay |            |                            |
| round                 | int16   | False    | replay |            |                            |
| player_id             | int32   | False    | replay |            |                            |
| x_pos                 | float32 | False    | replay |            |                            |
| y_pos                 | float32 | False    | replay |            |                            |
| z_pos                 | float32 | False    | replay |            |                            |
| current_ammo          | int16   | True     | replay |            |                            |
| weapon_code           | int16   | True     | replay |            |                            |
| inaccuracy            | float32 | True     | replay |            |                            |
| last_shot_time        | float32 | True     | replay |            |                            |
| recoil_index          | float32 | True     | replay |            |                            |
| phi_ang               | float32 | False    | replay |            |                            |
| theta_ang             | float32 | False    | replay |            |                            |
| is_ducked             | bool    | False    | replay |            |                            |
| is_ducking            | bool    | False    | replay |            |                            |
| duck_amount           | float32 | False    | replay |            |                            |
| duck_speed            | float32 | False    | replay |            |                            |
| fall_velocity         | float32 | False    | replay |            |                            |
| view_punch_angle_tick | int32   | False    | replay |            |                            |
| is_rescuing           | bool    | False    | replay |            |                            |
| player_id_fixed       | int8    | True     | merged |            | player_id, round, steam_id |
| team_code             | int8    | True     | merged |            | round, player_id           |

## rank_update - single_event

Event that triggers this channel: rank_update

| Col Name           | Type    | Nullable | Origin        | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ------------- | --------------- | -------------------------- |
| round              | int64   | False    | replay        |                 |                            |
| tick               | int64   | False    | replay        |                 |                            |
| player_id          | int64   | False    | replay        |                 |                            |
| rank_old           | int64   | False    | replay        |                 |                            |
| rank_new           | int64   | False    | replay        |                 |                            |
| rank_change        | int64   | False    | replay        |                 |                            |
| win_count          | int64   | False    | replay-capped |                 |                            |
| second             | float64 | True     | calculated    | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged        |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged        |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged        |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged        |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged        |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged        |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged        |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged        |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged        |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged        |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged        |                 | player_id, tick            |

## round_end - single_event

Event that triggers this channel: round_end

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys |
| ------------------ | ------- | -------- | ---------- | --------------- | ---------- |
| round              | int64   | False    | replay     |                 |            |
| tick               | int64   | False    | replay     |                 |            |
| winner_team_code   | int64   | False    | replay     |                 |            |
| win_reason_code    | int64   | False    | replay     |                 |            |
| win_reason_message | string  | False    | replay     |                 |            |
| player_count       | int64   | False    | replay     |                 |            |
| second             | float64 | True     | calculated | tick, tick_rate |            |

## round_mvp - single_event

Event that triggers this channel: round_mvp

| Col Name        | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| --------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round           | int64   | False    | replay     |                 |                            |
| tick            | int64   | False    | replay     |                 |                            |
| player_id       | int64   | False    | replay     |                 |                            |
| mvp_count       | int64   | False    | replay     |                 |                            |
| second          | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed | int64   | True     | merged     |                 | player_id, round, steam_id |

## round_start - single_event

Event that triggers this channel: round_start

| Col Name | Type    | Nullable | Origin     | Dependents      | Merge Keys |
| -------- | ------- | -------- | ---------- | --------------- | ---------- |
| round    | int64   | False    | replay     |                 |            |
| tick     | int64   | False    | replay     |                 |            |
| second   | float64 | True     | calculated | tick, tick_rate |            |

## round_state - multi_event

Events that trigger this channel: begin_new_match, bomb_defused, bomb_exploded, bomb_planted, buytime_ended, round_announce_match_start, round_announce_warmup, round_end, round_freeze_end, round_officially_ended, round_start, start_halftime

| Col Name     | Type    | Nullable | Origin       | Dependents      | Merge Keys |
| ------------ | ------- | -------- | ------------ | --------------- | ---------- |
| round        | int64   | False    | replay       |                 |            |
| tick         | int64   | False    | replay       |                 |            |
| event_type   | string  | False    | replay       |                 |            |
| t_score      | int64   | False    | replay_fixed |                 |            |
| ct_score     | int64   | False    | replay_fixed |                 |            |
| t_score_raw  | int64   | False    | replay       |                 |            |
| ct_score_raw | int64   | False    | replay       |                 |            |
| phase        | string  | False    | replay       |                 |            |
| is_warmup    | bool    | False    | replay       |                 |            |
| second       | float64 | True     | calculated   | tick, tick_rate |            |

## score_update - single_event

Event that triggers this channel: score_update

| Col Name  | Type    | Nullable | Origin     | Dependents      | Merge Keys |
| --------- | ------- | -------- | ---------- | --------------- | ---------- |
| round     | int64   | False    | replay     |                 |            |
| tick      | int64   | False    | replay     |                 |            |
| team_code | int64   | False    | replay     |                 |            |
| old_score | int64   | False    | replay     |                 |            |
| new_score | int64   | False    | replay     |                 |            |
| second    | float64 | True     | calculated | tick, tick_rate |            |

## team_change - single_event

Event that triggers this channel: player_team

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| old_team_code      | int64   | False    | replay     |                 |                            |
| new_team_code      | int64   | False    | replay     |                 |                            |
| is_bot             | bool    | False    | replay     |                 |                            |
| silent             | bool    | False    | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## tick - telemetry

Event that triggers this channel: tick_end

| Col Name                    | Type    | Nullable | Origin     | Dependents         | Merge Keys |
| --------------------------- | ------- | -------- | ---------- | ------------------ | ---------- |
| round                       | int64   | False    | replay     |                    |            |
| tick                        | int64   | False    | replay     |                    |            |
| second                      | float64 | True     | calculated | tick, tick_rate    |            |
| previous_phase              | string  | True     | calculated | event_type, second |            |
| second_since_previous_phase | float64 | True     | calculated | second             |            |

## weapon_action - multi_event

Events that trigger this channel: fire_on_empty, reload, zoom, zoom_rifle

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| event_type         | string  | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| second             | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed    | int64   | True     | merged     |                 | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                 | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                 | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                 | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                 | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                 | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                 | player_id, tick            |

## weapon_fire - single_event

Event that triggers this channel: weapon_fire

| Col Name           | Type    | Nullable | Origin     | Dependents                                     | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | ---------------------------------------------- | -------------------------- |
| round              | int64   | False    | replay     |                                                |                            |
| tick               | int64   | False    | replay     |                                                |                            |
| player_id          | int64   | False    | replay     |                                                |                            |
| player_id_pawn     | int64   | False    | replay     |                                                |                            |
| weapon_name        | string  | False    | replay     |                                                |                            |
| is_silenced        | bool    | False    | replay     |                                                |                            |
| second             | float64 | True     | calculated | tick, tick_rate                                |                            |
| player_id_fixed    | int64   | True     | merged     |                                                | player_id, round, steam_id |
| player_x_pos       | float64 | True     | merged     |                                                | player_id, tick            |
| player_y_pos       | float64 | True     | merged     |                                                | player_id, tick            |
| player_z_pos       | float64 | True     | merged     |                                                | player_id, tick            |
| player_x_vel       | float64 | True     | merged     |                                                | player_id, tick            |
| player_y_vel       | float64 | True     | merged     |                                                | player_id, tick            |
| player_z_vel       | float64 | True     | merged     |                                                | player_id, tick            |
| player_phi_ang     | float64 | True     | merged     |                                                | player_id, tick            |
| player_theta_ang   | float64 | True     | merged     |                                                | player_id, tick            |
| player_weapon_code | int64   | True     | merged     |                                                | player_id, tick            |
| player_team_code   | int64   | True     | merged     |                                                | player_id, tick            |
| missed_molotov     | bool    | True     | calculated | event_type-molotov_state, second-molotov_state |                            |

## world_item_vector - telemetry

Event that triggers this channel: tick_end

| Col Name      | Type    | Nullable | Origin     | Dependents      | Merge Keys |
| ------------- | ------- | -------- | ---------- | --------------- | ---------- |
| round         | int64   | False    | replay     |                 |            |
| tick          | int64   | False    | replay     |                 |            |
| entity_id     | int64   | False    | replay     |                 |            |
| prev_owner_id | int64   | False    | replay     |                 |            |
| item          | string  | False    | replay     |                 |            |
| def_index     | int64   | False    | replay     |                 |            |
| x_pos         | float64 | False    | replay     |                 |            |
| y_pos         | float64 | False    | replay     |                 |            |
| z_pos         | float64 | False    | replay     |                 |            |
| second        | float64 | True     | calculated | tick, tick_rate |            |
