---
sidebar_label: Changelog
sidebar_position: 2
description: Every change to the published CS2 CSDS data, newest first.
---

{/* Generated from igl-gotv-v2 scripts/csds-changelog/changes.yaml by render.py. Edit that file, not this page. */}

# CSDS Changelog

Every change to the published CS2 CSDS data since it began on 2023-11-05:
channels and columns added or removed, type changes, changed values, fixes,
and changes to the index object, the file format and delivery. Newest first.
The same changes are listed channel by channel on the
[changelog by channel](./changelog-by-channel.md).

- **Dates** are the day (UTC) a change reached production. A match sits in
  the revision for the day it was processed, so the revision for a change's
  date can hold matches from both before and after it. See
  [Changes over time](./spec.md#changes-over-time) in the spec.
- **About** marks a date known only roughly.
- **Releases** name the part of the pipeline that changed: the parser, which
  reads the demo (its version is in `header.rushb_version`); the converter,
  which builds the channels (`header.ppp_version`); the scrubber, which
  removes personal data; and the publisher, which sends matches to Data
  Exchange.

## 2026-10-03

_Converter 8.5.3._

**Values changed**

- `header.t_starters_avg_rank`, `header.ct_starters_avg_rank`, `header.t_starters_avg_wins`, `header.ct_starters_avg_wins`: Averaged over the first half's players only, rounds up to `max_rounds / 2` (12, or 8 in Wingman). Before, CS:GO's 15-round half was used, which mixed in the other team's players, so both teams often got the same average. A team with no players is now null instead of -1.
- `header.t_starters_score_final`, `header.ct_starters_score_final`: Each starting team's own final score, followed through the half-time and overtime side swaps. Before, it was the larger of the side scores, which could give a team the other team's score.
- `header.tick_save_rate`: Now 64, since every tick is kept. It was a fixed 21 that did not describe the data.

**Fixes**

- `grenade_state.entity_id_fixed`: A decoy with no `decoy_started` event keeps its -2 instead of being overwritten.
- `player_info.rank_platform`, `player_info.elo_platform`: On FACEIT matches, each player's FACEIT level and Elo now belong to the right player. Before, they were matched by row position and could be another player's.

## 2026-09-07

_Parser 5.3.7 to 5.4.0, converter 8.3.1 to 8.5.0, publisher 4.0.3._

**Columns added**

- `player_info.player_controller_id`: The player's controller id, as already in `player_status` and `player_personal`. Tells apart two players who share a `player_id` in one round.
- `header.freeze_time`, `header.round_time_defuse`, `header.bomb_time`, `header.max_rounds`: The server's own settings for freeze time (seconds), round time (minutes), bomb timer (seconds) and maximum rounds. Null when the demo does not record the setting; `bomb_time` has been null in every match checked.

**Fixes**

- `player_info`: A match in which two different players share a `round` and `player_id_fixed` now fails processing and is not published.

**Index object**

- `tick`: The `tick` channel's category is now `telemetry` (was `single_event`).

**Delivery**

- The daily revision now closes reliably. Before, when a close failed, that day's matches were published in the next revision, so one revision could hold more than one day.

## 2026-08-22

_Parser 5.3.4 to 5.3.6, converter 8.2.3 and 8.3.0._

**Columns added**

- `player_status.is_reloading`: Whether the player is reloading (bool). Replaces `reload_visually_complete`.
- `header.is_gotv_recording`: True when the match was recorded with GOTV transmission restricted, as on tournament servers. Such matches lack the per-player channels GOTV restricts, such as `player_footstep` and `item_equip`.
- `header.is_wingman`: True for a Wingman match.
- `header.max_unique_players`: Distinct human players over the whole match. Above the lobby size when someone was substituted or came back on another account.
- `molotov_state.smoke_entity_id_fixed`: Joinable id of the smoke that put the fire out, matching its `grenade_state.entity_id_fixed`. It is 0 when the fire was not put out and -2 when no smoke was found. `smoke_entity_id` is the raw id, which the game reuses within a match.
- `molotov_state.fraction_extinguished`: Share of the fire's flames, 0 to 1, that a smoke put out.
- `molotov_state.was_thrown_into_smoke`: 1 when the molotov or incendiary landed inside a smoke that was already up.
- `molotov_fire.entity_id_fixed`: The `molotov_state.entity_id_fixed` of the fire this flame belongs to, or -1 if unmatched. Join on this, not on `entity_id`, which the game reuses.

**Columns removed**

- `player_status.reload_visually_complete`: Null on every row since 2025-08-21. Use `is_reloading`.
- `player_vector.second_diff`, `tick.next_valid_tick`, `tick.next_valid_tick_round`: Internal working columns that were written but never listed in the index.
- `header.__index_level_0__`, `player_vector.__index_level_0__`: A leftover row-number column, never listed in the index, is gone from the last two channels that still had it.

**Types changed**

- `bomb_defuse.has_kit`, `other_death.is_attacker_blind`, `other_death.is_noscope`, `other_death.is_through_smoke`, `player_death.is_attacker_blind`, `player_death.is_flash_assist`, `player_death.is_noscope`, `player_death.is_through_smoke`, `player_chat.is_chat_all`, `player_status.burst_mode`, `player_status.is_silenced`: Was int64 holding 0 or 1, now bool, as the index always declared. Still nullable.

**Values changed**

- `molotov_state.was_extinguished_by_smoke`: No longer set for every incendiary that simply burned out. Reads 0 rather than -1 when the fire was not put out. Where `molotov_fire` is present, a fire counts as put out when any of its flames was, so partial extinguishes count. Smokes are taken to last 17.47 seconds (was 17).
- `molotov_state.extinguisher_id`, `molotov_state.extinguisher_id_fixed`, `molotov_state.smoke_entity_id`: Only a smoke within 250 units of the fire is credited; otherwise -2. Before, smokes far from the fire were credited (the median was over 1,000 units away).
- `molotov_state.was_extinguished_by_thrown_smoke`: Written in every match, as 0 or 1. Before, it was listed in the index but written only in some matches, and was never 1.

**Index object**

- `header`, `player_vector`, `round_state`: The index stops listing 62 columns that were never written. They are the header's `protocol`, `playback_time`, `playback_ticks`, `playback_frames`, `signon_length` and `second`, and the `player_tick` and `player_player_id` entries (and their `attacker_` and `assister_` forms) in 21 event channels. Duplicate entries are gone too: `player_vector`'s velocities, `round_state.second` and several header columns.

## 2026-08-03

_Parser 3.0.0 to 5.3.1, converter 8.0.0 to 8.2.2, scrubber 3.1.0._

**Channels added**

- `bullet_damage`: Per-bullet detail for each `player_hurt`: distance, damage direction, penetrations, and no-scope and in-air flags. Valve matchmaking demos only.
- `grenade_bounce`: Every surface a thrown grenade hit.
- `grenade_vector`: The flight path of each thrown grenade, a row whenever its position changed.
- `item_dropped`: A weapon leaving a player's hands, with the reason (`death`, `replaced` or `manual`).
- `item_refund`: Buy refunds.
- `molotov_fire`: Each flame of each molotov or incendiary fire, when it ignites and when it goes out.
- `player_chat`: In-game chat. `text` reads `redacted` in the published data.
- `player_connect`: Player and bot connects, warm-up included.
- `player_inputs`: Which buttons each player held, a row whenever that changed. Empty on Valve matchmaking demos, which do not carry it.
- `player_sound`: Sounds a player made and how far they carried. Empty on Valve matchmaking demos, which do not carry it.
- `rank_update`: Rank changes at the end of the match, official matchmaking only. `win_count` above 2500 is published as 2501, as `player_info.wins` is.
- `score_update`: Each change in a team's score.
- `team_change`: Players switching teams, including the silent half-time swap.
- `world_item_vector`: Positions of items lying on the ground, a row whenever one moved.

**Channels removed**

- `item_remove`: It never had rows in CS2 data; it was a placeholder kept from CS:GO.
- `player_action`: Empty since CS2 demos stopped carrying these events (see 2026-01-22).

**Columns added**

- `round_mvp.mvp_count`: The player's running MVP total. `round_mvp` has rows again, one whenever a player's MVP count rises; it had been empty on most matches since early 2024.
- `bot_takeover.is_controlling`: True when a player takes over a bot, false when they give it back. `bot_takeover` has rows for the first time in CS2 data.

**Columns removed**

- `round_mvp.mvp_reason_code`, `round_mvp.music_kit_mvps`: No CS2 source.
- `round_end.legacy_code`: No CS2 source.
- `round_start.time_limit`, `round_start.frag_limit`, `round_start.objective`: Always 0, 0 and empty in CS2 data.

**Values changed**

- `round_end.win_reason_code`, `round_end.win_reason_message`, `round_end.player_count`: Real round ends again. `win_reason_code` and `win_reason_message` come from the game, and `player_count` is the number of players on the team at the end of the round, bots included. Since 2024-02-12 the channel had been rebuilt from `round_state` with fixed values.
- `round_start`: Real round starts again, one row per round, round 1 included. The rebuilt channel used since 2024-02-12 was one row short.
- `round_state`: The `round_start` and `round_end` event rows are back (missing since 2024-02-12). Each round now has two `round_start` rows: the game's own, and the one the converter adds after `round_poststart` (since 2024-08-05).
- `player_name`: Records name changes. It had no rows in any CS2 data before.

**Fixes**

- `round_state.t_score`, `round_state.ct_score`: On `round_end` rows, the final round is no longer counted twice in 24-round matches (a CS:GO 30-round rule had been applied).

**Index object**

- `bot_takeover`, `bullet_damage`, `player_inputs`, `player_sound`, `rank_update`, `round_mvp`: A channel entry can carry `available`. False means the demo did not carry that data, so an empty channel means "not recorded" rather than "nothing happened". It is set on `bot_takeover`, `bullet_damage`, `player_inputs`, `player_sound`, `rank_update` and `round_mvp`.

## 2026-07-08

_Converter 7.2.0._

**File format**

- Parquet files are compressed with ZSTD instead of GZIP. Values are unchanged; your Parquet reader needs ZSTD support.

## 2026-07-07

_Parser 2.10.0 to 2.12.2, converter 7.0.0 to 7.1.1._

**Columns added**

- `player_info.rank_type`: Which ladder `rank` is on: 11 Premier (CS Rating), 12 Competitive (skill group 0 to 18), 7 Wingman; 0 or -1 when unknown. Every player in a match has the same value.
- `player_info.elo_platform`: The player's FACEIT Elo, on FACEIT matches only. The column is absent from other matches.

**Columns removed**

- The leftover row-number column `__index_level_0__`, never listed in the index, is no longer written in most channels. `header` and `player_vector` kept it until 2026-08-22.

**Values changed**

- `tick.previous_phase`, `tick.second_since_previous_phase`: When several phase events share a tick, the phase now follows a fixed order instead of whichever event sorted last.

**File format**

- Files are written by a newer Parquet library, in format version 2.6 instead of 1.0.

## 2026-06-07

_Converter 6.11.4._

**Fixes**

- `player_personal.player_id`, `player_status.player_id`, `player_vector.player_id`: When a round records the same `player_id` for two players, the player's controller id is used instead. A match that would still have duplicate `tick` and `player_id_fixed` rows fails processing and is not published.

## 2026-06-05

_Converter 6.11.3._

**Values changed**

- `header.providence`, `player_info.rank_raw`, `player_info.rank_platform`: A match without the platform's metadata file is now published, without these columns. Before, it failed processing and was not published.

**Fixes**

- `grenade_state.entity_id_fixed`: -2 for a decoy with more than one start event. Such matches used to fail processing and were not published.
- `player_vector.team_code`: Matches with a bot takeover are published; they used to fail processing.

## 2026-04-29

_Parser 2.8.0 and 2.9.0._

**Columns removed**

- `player_vector.x_aimpunch`, `player_vector.y_aimpunch`, `player_vector.aim_punch_angle_vel_x`, `player_vector.aim_punch_angle_vel_y`, `player_vector.aim_punch_angle_vel_z`: The aim-punch columns are no longer written.

## 2026-01-25

_Parser 2.7.1._

**Values changed**

- `header.network_protocol`: Always 1234; the demo no longer provides a meaningful value.

## About 2026-01-22

_No release; a change in what cs2 demos carry._

**Change in CS2 demos**

- `player_action`: CS2 demos stopped carrying these events around this date; most matches from here on have no rows. The channel was removed on 2026-08-03.

## 2025-08-21

_Parser 2.6.0._

**Values changed**

- `player_status.reload_visually_complete`: No longer filled, so null on every row. Removed on 2026-08-22 in favour of `is_reloading`.

## 2024-08-05

_Converter 6.10.0 to 6.10.7._

**Columns added**

- `tick.next_valid_tick`, `tick.next_valid_tick_round`: Internal working columns, written but not listed in the index. Removed on 2026-08-22.

**Values changed**

- `player_id`, `attacker_id` and `assister_id`, and with them every `*_id_fixed` and merged position column, are remapped round by round to the game's controller numbering, so events join to the right player.
- `round_state`: A `round_start` row is added for each round, one tick after `round_poststart`.
- `round_start`: When the demo has no round starts, the channel is rebuilt from those new `round_state` rows instead of from `round_prestart`.

**Fixes**

- Event rows whose player cannot be identified are kept, without the player's position columns.

## 2024-07-28

_Converter 6.9.2 to 6.9.4._

**Fixes**

- The id remapping is skipped when a match's ids are already small, as on FACEIT.
- `round_state`: `freezetime_ended_inferred` ignores the first 5 ticks of a round, where the spawn teleport looked like movement.

## 2024-07-07

_Converter 6.9.1._

**Columns added**

- `header.unique_steamids`: Number of distinct players in `player_personal`.

**Values changed**

- `round_state.event_type`: New event `freezetime_ended_inferred`: one row per round, at the first tick any player moves.

**Fixes**

- `header.t_starters_score_final`, `header.ct_starters_score_final`: Missing scores no longer spoil the result.

## 2024-06-06

_Parser 2.4.2._

**Fixes**

- Demos recorded after the CS2 update of 2024-05-29 parse again. The parser library update also fixes player data that could be corrupted or missing.

## 2024-04-28

_Parser 2.4.0 and 2.4.1._

**Fixes**

- Demos recorded after the CS2 update of 2024-04-25 parse again.

## About 2024-03-01

_No release; a change in what cs2 demos carry._

**Change in CS2 demos**

- `round_mvp`: From February 2024 a growing share of matches have no rows; by July 2024 none of the matches checked do. The channel has rows again from 2026-08-03.

## About 2024-02-24

_Publisher 1.2.4 and 1.3.0._

**Delivery**

- Publishing fixes after AWS changed Data Exchange permissions. Matches from the days before may have been published late.

## 2024-02-12

_Parser 2.2.0, converter 6.7.0 and 6.8.0._

**Values changed**

- `round_end.win_reason_code`, `round_end.win_reason_message`, `round_end.legacy_code`, `round_end.player_count`: CS2 demos stopped carrying round-end events. The channel is rebuilt from `round_state`: `win_reason_code` is 8 (CT win) or 9 (T win), `win_reason_message` is the generic team-win message, `legacy_code` is 0 and `player_count` is 20.
- `round_start`: CS2 demos stopped carrying round-start events. The channel is rebuilt from `round_state` and has one row fewer than the rounds played.
- `round_state`: No more `round_start` and `round_end` event rows: CS2 demos stopped carrying them.

**Fixes**

- `player_info.team_code`: The parser library update fixes players who could be given the wrong team, and disconnected players who were still treated as playing.

**Delivery**

- No matches are dated 2024-02-08 to 2024-02-11: the CS2 update of 2024-02-06 broke demo parsing until this release.

## 2023-12-09

_Parser 2.1.0, converter 6.6.0._

**Columns added**

- `player_status.player_controller_id`, `player_personal.player_controller_id`: The player's controller id, stable for a player slot. Joins `player_status` rows to `player_personal`.

**Values changed**

- `player_blind`: Keeps only flashes on players alive at that tick. CS2 also reports flashes on dead and spectating players.

## 2023-11-23

_Converter 6.5.6._

**Values changed**

- In some matches player ids came out about 65,000 too high; they are corrected, so events join to the right player.

## 2023-11-05

_Parser 2.0.0, converter 6.5.5._

**CS2 data begins**

- The first CS2 matches are published, with 30 channels, described in the [archived spec](/datascience/old/cs2/csds/spec). `item_remove`, `player_name` and `bot_takeover` have no rows. `player_vector.second_diff` and a `__index_level_0__` column in every channel are written but not listed in the index, and `header.tick_save_rate` is a fixed 21.
