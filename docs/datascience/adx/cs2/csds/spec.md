---
sidebar_position: 1
---

# CSDS Spec

Documentation for CSDS channels built by FPS Critic, Inc.

One match is published as a JSON index object named `csds` plus one file per
channel, 55 in all, for 56 objects per match. The index lists the channels,
where each one sits, and what columns it declares. Every channel file is
[Apache Parquet], `header` included.

This document describes the channel set published since 2026-08-04, plus the
`convar`, `team_info`, `pause_state`, `smoke_voxel`, `world_object`,
`hostage_vector`, `hostage_state`, `player_command`, `player_subtick_input`,
`map_ping`, `player_round_stats`, `round_facts` and `vote` channels added after it;
the [changelog](./changelog.md) dates them. Matches processed before `convar`
have 42 channels, those processed before `team_info` and `pause_state` have 43,
those processed before `smoke_voxel` lack it, and those processed before
`world_object`, `hostage_vector` and `hostage_state` lack them; those processed before `player_command` and `player_subtick_input` lack those two,
and those processed before `map_ping`, `player_round_stats`, `round_facts` and `vote` lack those four. Revisions
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

| Origin                | Meaning                                                                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `replay`              | Written by the demo parser, straight off the game's own event stream.                                                                                                                                             |
| `replay_fixed`        | A parser value the pipeline recomputed. The uncorrected value stays in the matching `*_raw` column, except for `player_status`'s server-clock times, which are moved onto the recording's clock with no raw copy. |
| `replay-capped`       | A parser value clamped at the top, so an unusually high number cannot single a player out.                                                                                                                        |
| `replay-redacted`     | A parser value overwritten by the PII scrubber.                                                                                                                                                                   |
| `calculated`          | Derived by the pipeline from the columns named under Dependents.                                                                                                                                                  |
| `calculated-redacted` | Derived, then overwritten by the PII scrubber.                                                                                                                                                                    |
| `merged`              | Copied in from another channel by joining on the columns named under Merge Keys.                                                                                                                                  |

Redaction is not one operation, and the redacted columns are still there. Names
and chat text become the literal string `redacted`, `player_personal.steam_id`
becomes a per-match alias (`A`, `B`, `C` and so on) that means nothing outside
its own match, `player_status.ping` becomes `0`, and in `convar` only the
`steamworks_sessionid_server` row's value becomes `redacted`. The rows are untouched, so
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
| site               | string  | True     | replay     |                 |                            |
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
| site               | string  | True     | replay     |                 |                            |
| x_pos              | float64 | True     | replay     |                 |                            |
| y_pos              | float64 | True     | replay     |                 |                            |
| z_pos              | float64 | True     | replay     |                 |                            |
| timer_seconds      | float64 | True     | replay     |                 |                            |
| timer_ends_at_tick | int64   | True     | replay     |                 |                            |
| explode_at_tick    | int64   | True     | replay     |                 |                            |
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

## convar - single_event

Event that triggers this channel: none

Every server setting the demo carried, one row per setting each time the server
sent it, in the order sent. `value` is the server's own string; parse it per
setting. Valve matchmaking servers send their settings once, at tick 0. FACEIT
and league servers send a warmup configuration first and the match rules later,
so the setting in effect at a tick is the last row for that name at or before
it. `steamworks_sessionid_server`, the server's Steam session, has its `value`
replaced with the literal string `redacted`.

| Col Name | Type    | Nullable | Origin          | Dependents      | Merge Keys |
| -------- | ------- | -------- | --------------- | --------------- | ---------- |
| round    | int64   | False    | replay          |                 |            |
| tick     | int64   | False    | replay          |                 |            |
| name     | string  | False    | replay          |                 |            |
| value    | string  | False    | replay-redacted |                 |            |
| second   | float64 | True     | calculated      | tick, tick_rate |            |

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
| vel_x               | float64 | True     | replay     |                 |                            |
| vel_y               | float64 | True     | replay     |                 |                            |
| vel_z               | float64 | True     | replay     |                 |                            |
| origin_x            | float64 | True     | replay     |                 |                            |
| origin_y            | float64 | True     | replay     |                 |                            |
| origin_z            | float64 | True     | replay     |                 |                            |
| thrower_vel_x       | float64 | True     | replay     |                 |                            |
| thrower_vel_y       | float64 | True     | replay     |                 |                            |
| thrower_vel_z       | float64 | True     | replay     |                 |                            |
| second              | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed     | int64   | True     | merged     |                 | player_id, round, steam_id |

## header - header

`server_start_tick` is the game server's tick when the recording's tick 0
was recorded. The game counts some times from the server's start; the
converter uses this to put `player_status.progress_bar_start`,
`last_injury_time` and `deploy_tick` on the recording's clock. Null on a
demo with no server tick messages. From parser 6.0.0.

From parser 6.2.0 the header also says more about how the match was set up
and how the recording went:

- `round_time` is the round length in seconds that the game itself reports
  (`m_iRoundTime`), as most of the match's rounds started with it. It is not
  always `round_time_defuse` × 60: on FACEIT and league servers the first
  round starts under a warmup configuration (two minutes) and the match rules
  (1.92 minutes, 115 seconds) are applied a few thousand ticks in, so
  `round_time_defuse` can hold the warmup value while `round_time` holds the
  one the match was played with. Null on a demo with no game-rules entity.
- `objective` is what the map asks of the players: `bomb`, `hostage`, `none`
  (neither) or `both`. Null when the demo does not carry the map's flags.
- `patch_version` is the network protocol of the build that recorded the
  demo; `build_num` is the game build. (The old `network_protocol` column was
  always 1234 and was removed in parser 5.6.0; this is a different, real
  value.)
- `is_pov_recording` is true for a recording made on a player's own computer
  rather than on a server.
- `is_truncated` is true when the demo ended early. Every table holds what the
  demo reached; the match is incomplete. A demo cut in the middle of a message
  is rejected instead and is not delivered.

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
| is_queued_matchmaking      | bool    | True     | replay              |                                                                                                  |            |
| queued_matchmaking_mode    | int64   | True     | replay              |                                                                                                  |            |
| server_start_tick          | int64   | True     | replay              |                                                                                                  |            |
| round_time                 | int64   | True     | replay              |                                                                                                  |            |
| objective                  | string  | True     | replay              |                                                                                                  |            |
| patch_version              | int64   | False    | replay              |                                                                                                  |            |
| is_pov_recording           | bool    | False    | replay              |                                                                                                  |            |
| is_truncated               | bool    | False    | replay              |                                                                                                  |            |
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

## hostage_state - multi_event

Events that trigger this channel: being_carried, being_untied, dead, following_player, getting_dropped, getting_picked_up, hurt, idle, rescued

One row each time a hostage changes state, plus a `hurt` row each time it takes damage. `event_type` is the state it moved into, or `hurt`; `old_state` is the state it left, null for `hurt`. A pick-up goes `being_untied`, `getting_picked_up`, `being_carried`; a drop goes `getting_dropped`, then `idle`. `player_id` is the player carrying or leading the hostage, the rescuer for `rescued`, the killer for `dead` and the attacker for `hurt`, null when there is none. The position and `health` are the hostage's at that moment. Hostages are created again each round, so `entity_id` names a hostage within one round. Empty on bomb maps.

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| entity_id          | int64   | False    | replay     |                 |                            |
| event_type         | string  | False    | replay     |                 |                            |
| old_state          | string  | True     | replay     |                 |                            |
| player_id          | int64   | True     | replay     |                 |                            |
| x_pos              | float64 | False    | replay     |                 |                            |
| y_pos              | float64 | False    | replay     |                 |                            |
| z_pos              | float64 | False    | replay     |                 |                            |
| health             | int64   | False    | replay     |                 |                            |
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

## hostage_vector - telemetry

Event that triggers this channel: tick_end

Each hostage every tick, on hostage maps: where it is, its `state`, `health` and `carrier_id`, the player leading or carrying it (null when none). `state` is one of idle, being_untied, getting_picked_up, being_carried, following_player, getting_dropped, rescued and dead. Hostages are created again each round, so `entity_id` names a hostage within one round. Empty on bomb maps.

| Col Name   | Type    | Nullable | Origin     | Dependents      | Merge Keys |
| ---------- | ------- | -------- | ---------- | --------------- | ---------- |
| round      | int64   | False    | replay     |                 |            |
| tick       | int64   | False    | replay     |                 |            |
| entity_id  | int64   | False    | replay     |                 |            |
| x_pos      | float64 | False    | replay     |                 |            |
| y_pos      | float64 | False    | replay     |                 |            |
| z_pos      | float64 | False    | replay     |                 |            |
| state      | string  | False    | replay     |                 |            |
| health     | int64   | False    | replay     |                 |            |
| carrier_id | int64   | True     | replay     |                 |            |
| second     | float64 | True     | calculated | tick, tick_rate |            |

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

## map_ping - single_event

Event that triggers this channel: map_ping

One row per marker a player placed with the ping button: the marker on the
map, not network latency, which is `player_status.ping`. `round` and `tick` are
when the marker appeared, and `x_pos`, `y_pos` and `z_pos` are where it stands.
`player_id` is the player who placed it, null when the marker names no player.
Pressing again on the same marker makes it urgent: `is_urgent` becomes true and
`ping_type` 13, and the row holds those values. Otherwise `ping_type` is 0 or 1
in the matches checked; Valve does not document it. The `player_*` columns are
the pinging player's own position and view at that tick, not the marker's.

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | True     | replay     |                 |                            |
| x_pos              | float64 | False    | replay     |                 |                            |
| y_pos              | float64 | False    | replay     |                 |                            |
| z_pos              | float64 | False    | replay     |                 |                            |
| ping_type          | int64   | True     | replay     |                 |                            |
| is_urgent          | bool    | False    | replay     |                 |                            |
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

## pause_state - multi_event

Events that trigger this channel: pause_end, pause_start, technical_pause_end, technical_pause_start, timeout_end, timeout_start

One start row and one end row per pause. `timeout_*` is a tactical timeout,
`technical_pause_*` a technical pause, and `pause_*` any other pause, such as
an admin pausing the match. `team_code` is the side that called it, null for a
plain pause. `t_timeouts_left` and `ct_timeouts_left` count each side's
tactical timeouts left; a technical pause leaves them alone.
`remaining_seconds` is the calling side's timeout clock. A pause still in
force when the demo ends has a start row and no end row. Most matchmaking
matches have no rows.

| Col Name          | Type    | Nullable | Origin     | Dependents      | Merge Keys |
| ----------------- | ------- | -------- | ---------- | --------------- | ---------- |
| round             | int64   | False    | replay     |                 |            |
| tick              | int64   | False    | replay     |                 |            |
| event_type        | string  | False    | replay     |                 |            |
| team_code         | int64   | True     | replay     |                 |            |
| t_timeouts_left   | int64   | False    | replay     |                 |            |
| ct_timeouts_left  | int64   | False    | replay     |                 |            |
| remaining_seconds | float64 | True     | replay     |                 |            |
| second            | float64 | True     | calculated | tick, tick_rate |            |

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

## player_command - telemetry

Event that triggers this channel: user_cmd

One row per user command: what each player's game sent the server for one
tick, so about a million rows a match. `mouse_dx` and `mouse_dy` are the mouse
movement in raw counts; in-game, each count turns the view by 0.022° times the
player's sensitivity. `forward_move` and `left_move` are the movement keys, −1,
0 or 1 (backward and right are negative). `weapon_select` is the entity index of
the weapon the player switched to on that command, and 0 on the 99.7% of
commands without a switch. `command_number` counts each player's commands. The
view angles and held buttons a command also carries are in `player_vector`
(`theta_ang`, `phi_ang`) and `player_inputs`: join on `round`, `tick` and
`player_id`. Matches whose demos don't carry full user commands (older CS2
recordings) have no rows, and their `available` flag in the index object is
false.

| Col Name        | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| --------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round           | int64   | False    | replay     |                 |                            |
| tick            | int64   | False    | replay     |                 |                            |
| player_id       | int64   | False    | replay     |                 |                            |
| command_number  | int64   | False    | replay     |                 |                            |
| mouse_dx        | int64   | False    | replay     |                 |                            |
| mouse_dy        | int64   | False    | replay     |                 |                            |
| forward_move    | float64 | False    | replay     |                 |                            |
| left_move       | float64 | False    | replay     |                 |                            |
| weapon_select   | int64   | False    | replay     |                 |                            |
| second          | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed | int64   | True     | merged     |                 | player_id, round, steam_id |

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

Every step, jump and landing a player was heard making, one row each, from the
sounds the game played. `kind` is `step`, `jump` or `land`. `surface` is what
was stepped or landed on (`Concrete`, `Sand`, `Wood` and so on), and empty for
a jump. Every jump also plays a step at takeoff, so a jump row comes with a
step row at about the same tick. Walking and crouching make no sound, so they
make no steps, and small drops make no landing. A player has at most one row
of each kind on a tick. The merged position columns are the player's, from
`player_vector` at that tick. Matches parsed before parser 5.7.0 (2026-10-12)
hold a different channel: jumps and landings only, with no `kind` or `surface`.
Before parser 6.0.0 (2026-10-14), a step the game played twice on one tick, at
a jump or a landing, was two rows (about 1 step in 300). Before converter 8.8.0
(2026-10-14), the channel had no position columns. See the
[changelog](./changelog.md).

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | False    | replay     |                 |                            |
| kind               | string  | False    | replay     |                 |                            |
| surface            | string  | False    | replay     |                 |                            |
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

`game_rank_if_win`, `game_rank_if_loss` and `game_rank_if_tie` are the rating
the game itself predicts the player will hold after the match if their team
wins, loses or ties, the "+N / -N" on the Premier scoreboard. The game sets
them once at the start of the match, so every round repeats them. They are 0
outside Premier, as on FACEIT and league demos. From parser 6.0.0.

| Col Name          | Type    | Nullable | Origin        | Dependents           | Merge Keys                 |
| ----------------- | ------- | -------- | ------------- | -------------------- | -------------------------- |
| round             | int64   | False    | replay        |                      |                            |
| player_id         | int64   | False    | replay        |                      |                            |
| team_code         | int64   | False    | replay        |                      |                            |
| wins              | int64   | False    | replay-capped |                      |                            |
| rank              | int64   | False    | replay        |                      |                            |
| rank_type         | int64   | False    | replay        |                      |                            |
| radar_color_code  | int64   | False    | replay        |                      |                            |
| game_rank_if_win  | int64   | True     | replay        |                      |                            |
| game_rank_if_loss | int64   | True     | replay        |                      |                            |
| game_rank_if_tie  | int64   | True     | replay        |                      |                            |
| player_id_fixed   | int64   | True     | merged        |                      | player_id, round, steam_id |
| rank_raw          | int     | True     | calculated    | player_info:rank     |                            |
| rank_platform     | float64 | True     | calculated    | player_personal:rank |                            |

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

`crosshair_code` and the four `viewmodel_*` columns are each player's client
settings. In this data set they are redacted: the crosshair code reads
`"redacted"` and the viewmodel values are null, because a custom crosshair code
is close to unique per player and could link a player across matches.

| Col Name             | Type    | Nullable | Origin          | Dependents       | Merge Keys |
| -------------------- | ------- | -------- | --------------- | ---------------- | ---------- |
| round                | int64   | False    | replay          |                  |            |
| player_id            | int64   | False    | replay          |                  |            |
| player_controller_id | int64   | False    | replay          |                  |            |
| player_id_pawn       | int64   | False    | replay          |                  |            |
| name                 | string  | False    | replay-redacted |                  |            |
| clan_tag             | string  | False    | replay-redacted |                  |            |
| steam_id             | string  | False    | replay-redacted |                  |            |
| crosshair_code       | string  | True     | replay-redacted |                  |            |
| viewmodel_offset_x   | float64 | True     | replay-redacted |                  |            |
| viewmodel_offset_y   | float64 | True     | replay-redacted |                  |            |
| viewmodel_offset_z   | float64 | True     | replay-redacted |                  |            |
| viewmodel_fov        | float64 | True     | replay-redacted |                  |            |
| is_bot               | bool    | True     | calculated      | steam_id         |            |
| player_id_fixed      | int64   | True     | calculated      | steam_id, is_bot |            |

## player_round_stats - single_event

Event that triggers this channel: round_officially_ended

The game's own scoreboard numbers: one row per player per round, as the server
counted them. They are read at the round's `round_officially_ended`, or, when
that never comes (the last round, on most matches), at the next round's start
or the end of the demo. The per-round columns count that round alone:

- `kills`, `deaths`, `assists` and `headshot_kills`.
- `damage`: the health actually taken from enemies, so overkill and team damage
  don't count. `utility_damage` is the scoreboard's utility damage.
- `enemies_flashed`.
- `equipment_value`, `money_saved`, `kill_reward` and `cash_earned`, in dollars.
- `live_time`: seconds alive in the round.
- `objective`: the scoreboard's objective count, one for a bomb plant or
  defuse.

`total_damage` and `total_utility_damage` are running totals for the match so
far. The server keeps 30 rounds of these numbers, so after round 30 (in
overtime) the per-round columns are null. There is a row for every player on a
team when the round is read, and for a player who has left if the server still
holds their numbers for the round. On our 50-match test set, `kills`, `deaths`
and `headshot_kills` agree with `player_death` on more than 99% of
player-rounds, and `damage` agrees with the health taken from enemies in
`player_hurt` on 99.2%.

| Col Name             | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| -------------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round                | int64   | False    | replay     |                 |                            |
| tick                 | int64   | False    | replay     |                 |                            |
| player_id            | int64   | False    | replay     |                 |                            |
| kills                | int64   | True     | replay     |                 |                            |
| deaths               | int64   | True     | replay     |                 |                            |
| assists              | int64   | True     | replay     |                 |                            |
| damage               | int64   | True     | replay     |                 |                            |
| utility_damage       | int64   | True     | replay     |                 |                            |
| enemies_flashed      | int64   | True     | replay     |                 |                            |
| equipment_value      | int64   | True     | replay     |                 |                            |
| money_saved          | int64   | True     | replay     |                 |                            |
| kill_reward          | int64   | True     | replay     |                 |                            |
| live_time            | int64   | True     | replay     |                 |                            |
| headshot_kills       | int64   | True     | replay     |                 |                            |
| objective            | int64   | True     | replay     |                 |                            |
| cash_earned          | int64   | True     | replay     |                 |                            |
| total_damage         | int64   | True     | replay     |                 |                            |
| total_utility_damage | int64   | True     | replay     |                 |                            |
| second               | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed      | int64   | True     | merged     |                 | player_id, round, steam_id |

## player_sound - single_event

Event that triggers this channel: player_sound

Every sound the game played, one row per sound. That covers each player's
steps, jumps and landings (the ones `player_footstep` has), pickups and damage
heard by others, and the world's and the grenades' sounds: dropped items
landing, molotovs catching fire, bounces, explosions. Gunshots and reloads
aren't in it; `weapon_fire` has the shots. `sound` is the game's name for the
sound (`Player.PickupWeapon`), or its hash as 8 hex digits when the parser's
list of names lacks it, which is under 1 sound in 1,000 on recent matches.
`source` says what made it: `player`, `weapon` (one a player carries),
`grenade`, `world` or `other`. `player_id` is the player, the carrier of the
weapon or the thrower of the grenade, and null when no player is known: world
sounds, and under 1% of sounds whose source the parser can't place (`source`
`other`). A sound whose source reaches the recording later in the same tick,
such as a bought weapon or a molotov's fire, gets its player then, and an armor
purchase goes to the player whose armor rose on that tick. Before parser 6.0.0
(2026-10-14) those had no player and were `other`, about 3% of sounds. The
merged position columns are that player's, and null when `player_id` is. A
sound the game played twice on one tick, such as a grenade bouncing off two
surfaces, is two rows. A demo with no sound messages falls back to the
`player_sound` game event, one row per event with `sound` `player_sound`.
Matches parsed before parser 5.7.0 (2026-10-12) took the channel from that
event alone, which most demos don't carry, and had `radius`, `duration` and
`is_step`; see the [changelog](./changelog.md).

| Col Name           | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | --------------- | -------------------------- |
| round              | int64   | False    | replay     |                 |                            |
| tick               | int64   | False    | replay     |                 |                            |
| player_id          | int64   | True     | replay     |                 |                            |
| sound              | string  | False    | replay     |                 |                            |
| source             | string  | False    | replay     |                 |                            |
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

From parser 6.0.0 the table also carries the player's and the held weapon's
own state. `progress_bar_start` and `progress_bar_duration` are the defuse
progress bar: `progress_bar_start` is when the player's last defuse began, in
seconds on the clock of `second`, and keeps that value after the defuse ends;
`progress_bar_duration` is the bar's length in seconds while it shows (10, or
5 with a kit) and negative otherwise. CS2 doesn't use the bar for planting.
`last_injury_time` is when the player last took damage, on the clock of
`second`. Both times are null until first set. `is_in_reload` is the held
weapon's reload flag; unlike `is_reloading` it falls as soon as a reload
stops, and about a third of reloads end early in a weapon switch.
`reserve_ammo` is the held weapon's reserve and drops by one magazine per
completed reload; null for knives, grenades and equipment. `deploy_tick` is
the tick the held weapon was drawn, joinable on `tick`. The game keeps
`progress_bar_start`, `last_injury_time` and `deploy_tick` on the game server's
clock; the converter moves them onto the recording's clock with
`header.server_start_tick`, hence `replay_fixed`, and keeps no `*_raw` copy.

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
| progress_bar_start            | float64 | True     | replay_fixed    |                                                                                                                                                                       |                            |
| progress_bar_duration         | int64   | True     | replay          |                                                                                                                                                                       |                            |
| last_injury_time              | float64 | True     | replay_fixed    |                                                                                                                                                                       |                            |
| is_in_reload                  | bool    | True     | replay          |                                                                                                                                                                       |                            |
| reserve_ammo                  | int64   | True     | replay          |                                                                                                                                                                       |                            |
| deploy_tick                   | int64   | True     | replay_fixed    |                                                                                                                                                                       |                            |
| second                        | float32 | True     | calculated      | tick, tick_rate                                                                                                                                                       |                            |
| player_id_fixed               | int8    | True     | merged          |                                                                                                                                                                       | player_id, round, steam_id |
| equipment_value_calc          | int16   | True     | calculated      | inv_flashbang, inv_taser, inv_hegrenade, inv_smokegrenade, inv_molotov, inv_decoy, inv_incgrenade, inv_c4, armor, has_defuser, has_helmet, inv_primary, inv_secondary |                            |

## player_subtick_input - telemetry

Event that triggers this channel: user_cmd

One row per sub-tick step inside a user command: a button pressed or released,
and when. `button` is the button's bit, as in `player_inputs.buttons_mask` (1
attack, 2 jump, 4 duck, 8 forward, 16 back, 512 left, 1024 right, …); steps that
only carry analog movement have button 0. `when` is the moment as a fraction of
the command's tick. It is below 1, and slightly negative on about 3.5% of steps
(a median of −0.03): presses recorded just before the tick began. A few reach
−2. About 1.7 million rows across the 50-match corpus.

| Col Name        | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| --------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round           | int64   | False    | replay     |                 |                            |
| tick            | int64   | False    | replay     |                 |                            |
| player_id       | int64   | False    | replay     |                 |                            |
| button          | int64   | False    | replay     |                 |                            |
| pressed         | bool    | False    | replay     |                 |                            |
| when            | float64 | False    | replay     |                 |                            |
| second          | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed | int64   | True     | merged     |                 | player_id, round, steam_id |

## player_vector - telemetry

Event that triggers this channel: tick_end

Converter 8.6.0 and later write this table with the types below, sorted by player, then tick; see [The player tables](#the-player-tables).

From parser 6.0.0 the table also carries the game's own movement and spray
state. `is_airborne` is true when nothing is under the player's feet.
`x_vel_engine`, `y_vel_engine` and `z_vel_engine` are the game's velocity at
the tick, in units a second. dsdk's `x_vel`, `y_vel` and `z_vel`, which it
calculates from positions, describe the move into the tick, half a tick
earlier, so the two disagree most after missed ticks, on stairs and in the
air. `shots_fired` counts the shots of the current spray and drops back to 0
soon after the player stops firing. `velocity_modifier` is the slowdown from
being hit, 1 when there is none. `view_offset_z` is the eye's height above
the player's position, about 64 standing and 46 crouched; the eye's height
on the map is `z_pos + view_offset_z`. `aim_punch_pitch` and `aim_punch_yaw`
are the recoil kick the player's shots have put on their aim, in degrees,
pitch negative upward; across a spray they trace the weapon's recoil
pattern. The game holds the last shot's value rather than letting it decay,
so both are null unless the player fired within the last second (64 ticks),
counting the shot's own tick.

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
| is_airborne           | bool    | True     | replay |            |                            |
| x_vel_engine          | float64 | True     | replay |            |                            |
| y_vel_engine          | float64 | True     | replay |            |                            |
| z_vel_engine          | float64 | True     | replay |            |                            |
| shots_fired           | int64   | True     | replay |            |                            |
| velocity_modifier     | float64 | True     | replay |            |                            |
| view_offset_z         | float64 | True     | replay |            |                            |
| aim_punch_pitch       | float64 | True     | replay |            |                            |
| aim_punch_yaw         | float64 | True     | replay |            |                            |
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

## round_facts - single_event

Event that triggers this channel: round_end

The fun fact the scoreboard shows when a round ends: one row per `round_end`
row. `fun_fact_token` is Valve's localization token for the fact, as sent (for
example `#funfact_kills_headshots:f`, where the `:f` suffix is part of the token), never the rendered text. `player_id` is the
player the fact is about, and null for a fact about a team or the round (shots
fired, a win without casualties, the round time). `fun_fact_data1` to
`fun_fact_data3` are the numbers the fact quotes, and what they mean depends on
the token: a count, seconds, an amount of money. A round can end without a fun
fact (every surrender does), and then the token, `player_id` and the data
columns are all null.

| Col Name        | Type    | Nullable | Origin     | Dependents      | Merge Keys                 |
| --------------- | ------- | -------- | ---------- | --------------- | -------------------------- |
| round           | int64   | False    | replay     |                 |                            |
| tick            | int64   | False    | replay     |                 |                            |
| fun_fact_token  | string  | True     | replay     |                 |                            |
| player_id       | int64   | True     | replay     |                 |                            |
| fun_fact_data1  | int64   | True     | replay     |                 |                            |
| fun_fact_data2  | int64   | True     | replay     |                 |                            |
| fun_fact_data3  | int64   | True     | replay     |                 |                            |
| second          | float64 | True     | calculated | tick, tick_rate |                            |
| player_id_fixed | int64   | True     | merged     |                 | player_id, round, steam_id |

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

`overtime` is the overtime period, 0 in regulation and 1 in the first
overtime, one number for every row of a round; `phase` still says "first" or
"second" within each overtime. `t_loss_streak` and `ct_loss_streak` are each
side's run of round losses as the game counts it for the loss bonus. They
climb by one per loss and step down on a win rather than resetting to 0.

| Col Name       | Type    | Nullable | Origin       | Dependents      | Merge Keys |
| -------------- | ------- | -------- | ------------ | --------------- | ---------- |
| round          | int64   | False    | replay       |                 |            |
| tick           | int64   | False    | replay       |                 |            |
| event_type     | string  | False    | replay       |                 |            |
| t_score        | int64   | False    | replay_fixed |                 |            |
| ct_score       | int64   | False    | replay_fixed |                 |            |
| t_score_raw    | int64   | False    | replay       |                 |            |
| ct_score_raw   | int64   | False    | replay       |                 |            |
| phase          | string  | False    | replay       |                 |            |
| is_warmup      | bool    | False    | replay       |                 |            |
| overtime       | int64   | False    | replay       |                 |            |
| t_loss_streak  | int64   | False    | replay       |                 |            |
| ct_loss_streak | int64   | False    | replay       |                 |            |
| second         | float64 | True     | calculated   | tick, tick_rate |            |

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

## smoke_voxel - telemetry

Event that triggers this channel: tick_end

A smoke's volume as the game sends it. The rows are not the smoke itself: they
are the cells the smoke's fill starts from (`kind` `seed`) and the map's
surfaces around the smoke (`kind` `block`), from which each player's game fills
the smoke in.

- Cells are 20 units on a world grid: cell n spans 20n to 20n + 20 on each axis,
  so a point is in cell `floor(x / 20)`, `floor(y / 20)`, `floor(z / 20)`.
- A `block` row covers the 4 × 4 × 4 cells from its corner `cell_x`, `cell_y`,
  `cell_z`. The cell at corner + (x, y, z) is part of the map where bit x + 4y +
  16z of the block's mask is set. The mask comes in two halves, each 0 to
  2^32 - 1: `mask_lo` holds bits 0 to 31 (layers z = 0 and 1) and `mask_hi` bits
  32 to 63 (z = 2 and 3), so the whole mask is `mask_lo | mask_hi << 32`. They
  are split because a reader such as pandas loads a nullable 64-bit integer as a
  float, which would round the mask. A later row for the same block and
  `grenade_id` replaces it.
- A `seed` row is one cell the fill starts from. `seed_value` is a byte the game
  sends with each seed (5 or 0; its meaning is unknown).
- To get the smoke's shape, fill outward from the seed cells to the six face
  neighbours, through cells that lie in a received block and are not set, for 4
  steps. Checked against the smoke CS2 draws, about three quarters of that shape
  is smoke, and it covers about three quarters of the smoke.
- The smoke is gone at its `smokegrenade_expired` row in `grenade_state`, even
  if rows for it came later. Demos from builds before the voxel data have no
  rows.

| Col Name   | Type    | Nullable | Origin     | Dependents      | Merge Keys |
| ---------- | ------- | -------- | ---------- | --------------- | ---------- |
| round      | int64   | False    | replay     |                 |            |
| tick       | int64   | False    | replay     |                 |            |
| entity_id  | int64   | False    | replay     |                 |            |
| grenade_id | int64   | False    | replay     |                 |            |
| update_nr  | int64   | False    | replay     |                 |            |
| kind       | string  | False    | replay     |                 |            |
| cell_x     | int64   | False    | replay     |                 |            |
| cell_y     | int64   | False    | replay     |                 |            |
| cell_z     | int64   | False    | replay     |                 |            |
| mask_lo    | int64   | True     | replay     |                 |            |
| mask_hi    | int64   | True     | replay     |                 |            |
| seed_value | int64   | True     | replay     |                 |            |
| second     | float64 | True     | calculated | tick, tick_rate |            |

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

## team_info - single_event

Event that triggers this channel: team_info

Each side's team name (`clan_name`), `flag`, surrender flag and score in each
half, one row whenever any of them changes. `team_code` is the side, not the
team: at halftime the names and half scores move to the other side's rows,
the scores a moment before the names. Overtime rounds don't change the half
scores. Matchmaking and Premier matches have empty names; FACEIT and league
matches name both teams.

| Col Name          | Type    | Nullable | Origin     | Dependents      | Merge Keys |
| ----------------- | ------- | -------- | ---------- | --------------- | ---------- |
| round             | int64   | False    | replay     |                 |            |
| tick              | int64   | False    | replay     |                 |            |
| team_code         | int64   | False    | replay     |                 |            |
| clan_name         | string  | False    | replay     |                 |            |
| flag              | string  | False    | replay     |                 |            |
| surrendered       | bool    | False    | replay     |                 |            |
| score_first_half  | int64   | False    | replay     |                 |            |
| score_second_half | int64   | False    | replay     |                 |            |
| second            | float64 | True     | calculated | tick, tick_rate |            |

## tick - telemetry

Event that triggers this channel: tick_end

`host_time_us` and `host_time_sd_us` are the server's computation time per
frame and its standard deviation, in microseconds, from the latest network tick
message before the frame. A 64-tick frame lasts 15,625 microseconds; on our
50-match test set the median is about 2,200 and the 99th percentile about 5,000.

| Col Name                    | Type    | Nullable | Origin     | Dependents         | Merge Keys |
| --------------------------- | ------- | -------- | ---------- | ------------------ | ---------- |
| round                       | int64   | False    | replay     |                    |            |
| tick                        | int64   | False    | replay     |                    |            |
| host_time_us                | int64   | True     | replay     |                    |            |
| host_time_sd_us             | int64   | True     | replay     |                    |            |
| second                      | float64 | True     | calculated | tick, tick_rate    |            |
| previous_phase              | string  | True     | calculated | event_type, second |            |
| second_since_previous_phase | float64 | True     | calculated | second             |            |

## vote - single_event

Events that trigger this channel: vote_passed, vote_failed

One row per team vote that finished: a kick, a tactical timeout or a
surrender. `event_type` is `passed` or `failed`, and `team_code` is the team
that voted. `vote_type` is set on passed votes and `fail_reason` on failed ones,
because each outcome message carries only its own. `issue_index` says what the
vote was about: 0 a kick, 1 a timeout and 2 a surrender, in every match checked.
`start_tick` is when the vote was called, and `yes_votes`, `no_votes` and
`potential_votes` are the tally when it finished. A demo does not record who
called a vote or whom a kick was aimed at, so neither is here.

| Col Name        | Type    | Nullable | Origin     | Dependents      | Merge Keys |
| --------------- | ------- | -------- | ---------- | --------------- | ---------- |
| round           | int64   | False    | replay     |                 |            |
| tick            | int64   | False    | replay     |                 |            |
| start_tick      | int64   | True     | replay     |                 |            |
| event_type      | string  | False    | replay     |                 |            |
| vote_type       | int64   | True     | replay     |                 |            |
| issue_index     | int64   | True     | replay     |                 |            |
| team_code       | int64   | False    | replay     |                 |            |
| yes_votes       | int64   | True     | replay     |                 |            |
| no_votes        | int64   | True     | replay     |                 |            |
| potential_votes | int64   | True     | replay     |                 |            |
| fail_reason     | int64   | True     | replay     |                 |            |
| second          | float64 | True     | calculated | tick, tick_rate |            |

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

Rows where a gun fired a bullet also carry the server's own record of the
shot. `inaccuracy_total` is the inaccuracy the game applied to it, including the
movement and jumping part that `player_vector.inaccuracy` (the firing penalty
only) leaves out; on about a quarter of shots the total is more than 10% higher.
`seed` is the random seed for the shot's spread, `origin_x`, `origin_y` and
`origin_z` are where it was fired from, and `angle_pitch` and `angle_yaw` its
direction in degrees. Valve's matchmaking servers also send `inaccuracy_move`
and `inaccuracy_air` (the movement and air parts of the total),
`aim_punch_pitch` and `aim_punch_yaw` (the recoil kick on the view at the shot,
in degrees), and `attack_tick` and `attack_tick_frac` (the tick, and the
fraction of it, when the player clicked: almost always 3 ticks before to 1
after the row's `tick`). These columns are null on grenade, knife and other
rows that fire no bullet, and the Valve-only ones are null on FACEIT and league
matches. Older matches don't have them.

| Col Name           | Type    | Nullable | Origin     | Dependents                                     | Merge Keys                 |
| ------------------ | ------- | -------- | ---------- | ---------------------------------------------- | -------------------------- |
| round              | int64   | False    | replay     |                                                |                            |
| tick               | int64   | False    | replay     |                                                |                            |
| player_id          | int64   | False    | replay     |                                                |                            |
| player_id_pawn     | int64   | False    | replay     |                                                |                            |
| weapon_name        | string  | False    | replay     |                                                |                            |
| is_silenced        | bool    | False    | replay     |                                                |                            |
| inaccuracy_total   | float64 | True     | replay     |                                                |                            |
| seed               | int64   | True     | replay     |                                                |                            |
| origin_x           | float64 | True     | replay     |                                                |                            |
| origin_y           | float64 | True     | replay     |                                                |                            |
| origin_z           | float64 | True     | replay     |                                                |                            |
| angle_pitch        | float64 | True     | replay     |                                                |                            |
| angle_yaw          | float64 | True     | replay     |                                                |                            |
| inaccuracy_move    | float64 | True     | replay     |                                                |                            |
| inaccuracy_air     | float64 | True     | replay     |                                                |                            |
| aim_punch_pitch    | float64 | True     | replay     |                                                |                            |
| aim_punch_yaw      | float64 | True     | replay     |                                                |                            |
| attack_tick        | int64   | True     | replay     |                                                |                            |
| attack_tick_frac   | float64 | True     | replay     |                                                |                            |
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

## world_object - multi_event

Events that trigger this channel: broken, cleanup, closed, closing, moving, open, opening, spawned

The map's doors and breakable parts, one row per change. `class` is what the object is: `door`, a door that swings open; `brush_door`, a door built into the map itself (cs_office's garage door, Vertigo's port-o-potty doors); `prop`, a breakable prop; `breakable`, a vent (Nuke, Mirage); and `brush`, a pane of Nuke's glass.

A `door` gets a `spawned` row when it is created, then `opening`, `open`, `closing` and `closed` as it moves; every door is created again, closed, at each round start. A `brush_door` gets `spawned` and then one `moving` row for each tick it moves, with its position and angle. `broken` is an object destroyed during a round. `by_player_id` is the player who broke it, null when no player did: the bomb, props knocked into each other, and Nuke's glass, which never names one. `cleanup` rows are the map being reset for the next round, not breaks. Maps with no doors or breakables have no rows.

| Col Name     | Type    | Nullable | Origin     | Dependents      | Merge Keys |
| ------------ | ------- | -------- | ---------- | --------------- | ---------- |
| round        | int64   | False    | replay     |                 |            |
| tick         | int64   | False    | replay     |                 |            |
| entity_id    | int64   | False    | replay     |                 |            |
| class        | string  | False    | replay     |                 |            |
| event_type   | string  | False    | replay     |                 |            |
| x_pos        | float64 | False    | replay     |                 |            |
| y_pos        | float64 | False    | replay     |                 |            |
| z_pos        | float64 | False    | replay     |                 |            |
| pitch        | float64 | False    | replay     |                 |            |
| yaw          | float64 | False    | replay     |                 |            |
| roll         | float64 | False    | replay     |                 |            |
| by_player_id | int64   | True     | replay     |                 |            |
| second       | float64 | True     | calculated | tick, tick_rate |            |
