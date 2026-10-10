---
sidebar_label: Changelog by Channel
sidebar_position: 3
description: Every change to the published CS2 CSDS data, channel by channel.
---

{/* Generated from igl-gotv-v2 scripts/csds-changelog/changes.yaml by render.py. Edit that file, not this page. */}

# CSDS Changelog by Channel

The [changelog](./changelog.md), channel by channel, newest first. Changes
that touch every channel are under [All channels](#all-channels), and
changes to the `csds` index object under [Index object](#index-object).
Dates are the day (UTC) a change reached production.

## All channels

- **2026-09-07**, delivery. The daily revision now closes reliably. Before, when a close failed, that day's matches were published in the next revision, so one revision could hold more than one day.
- **2026-07-08**, file format. Parquet files are compressed with ZSTD instead of GZIP. Values are unchanged; your Parquet reader needs ZSTD support.
- **2026-07-07**, columns removed. The leftover row-number column `__index_level_0__`, never listed in the index, is no longer written in most channels. `header` and `player_vector` kept it until 2026-08-22.
- **2026-07-07**, file format. Files are written by a newer Parquet library, in format version 2.6 instead of 1.0.
- **2024-08-05**, values changed. `player_id`, `attacker_id` and `assister_id`, and with them every `*_id_fixed` and merged position column, are remapped round by round to the game's controller numbering, so events join to the right player.
- **2024-08-05**, fixes. Event rows whose player cannot be identified are kept, without the player's position columns.
- **2024-07-28**, fixes. The id remapping is skipped when a match's ids are already small, as on FACEIT.
- **2024-06-06**, fixes. Demos recorded after the CS2 update of 2024-05-29 parse again. The parser library update also fixes player data that could be corrupted or missing.
- **2024-04-28**, fixes. Demos recorded after the CS2 update of 2024-04-25 parse again.
- **About 2024-02-24**, delivery. Publishing fixes after AWS changed Data Exchange permissions. Matches from the days before may have been published late.
- **2024-02-12**, delivery. No matches are dated 2024-02-08 to 2024-02-11: the CS2 update of 2024-02-06 broke demo parsing until this release.
- **2023-11-23**, values changed. In some matches player ids came out about 65,000 too high; they are corrected, so events join to the right player.
- **2023-11-05**, CS2 data begins. The first CS2 matches are published, with 30 channels, described in the [archived spec](/datascience/old/cs2/csds/spec). `item_remove`, `player_name` and `bot_takeover` have no rows. `player_vector.second_diff` and a `__index_level_0__` column in every channel are written but not listed in the index, and `header.tick_save_rate` is a fixed 21.

## Index object

- **2026-10-06**, index object. Every column's entry gives the type it is written as and whether it can be null, and every merged and calculated column is declared nullable. Before, most columns declared a narrower type than the one written (`int32`, `float32`) or one with no width (`int`), and merged and calculated columns declared neither.
- **2026-09-07**, index object. The `tick` channel's category is now `telemetry` (was `single_event`).
- **2026-08-22**, index object. The index stops listing 62 columns that were never written. They are the header's `protocol`, `playback_time`, `playback_ticks`, `playback_frames`, `signon_length` and `second`, and the `player_tick` and `player_player_id` entries (and their `attacker_` and `assister_` forms) in 21 event channels. Duplicate entries are gone too: `player_vector`'s velocities, `round_state.second` and several header columns.
- **2026-08-03**, index object. A channel entry can carry `available`. False means the demo did not carry that data, so an empty channel means "not recorded" rather than "nothing happened". It is set on `bot_takeover`, `bullet_damage`, `player_inputs`, `player_sound`, `rank_update` and `round_mvp`.

## bomb_action

- **2026-10-06**, types changed: `event_type`. Written as the column's own type when a match has no value for it or the channel is empty. Before, such a column was written with Parquet's null type, so its type changed from match to match.
- **2026-10-05**, fixes: `player_id`. Set on `bomb_pickup` rows. It was null on all of them, so those rows joined to no player and carried no player position.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.

## bomb_defuse

- **2026-10-06**, types changed: `event_type`. Written as the column's own type when a match has no value for it or the channel is empty. Before, such a column was written with Parquet's null type, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-08-22**, types changed: `has_kit`. Was int64 holding 0 or 1, now bool, as the index always declared. Still nullable.

## bomb_state

- **2026-10-06**, types changed: `event_type`. Written as the column's own type when a match has no value for it or the channel is empty. Before, such a column was written with Parquet's null type, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.

## bot_takeover

- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-08-03**, column added: `is_controlling`. True when a player takes over a bot, false when they give it back. `bot_takeover` has rows for the first time in CS2 data.
- **2026-08-03**, index object. A channel entry can carry `available`. False means the demo did not carry that data, so an empty channel means "not recorded" rather than "nothing happened". It is set on `bot_takeover`, `bullet_damage`, `player_inputs`, `player_sound`, `rank_update` and `round_mvp`.

## bullet_damage

- **2026-10-05**, fixes: `num_penetrations`. Counts the surfaces the bullet went through. It was 0 on every row.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-08-03**, channel added. Per-bullet detail for each `player_hurt`: distance, damage direction, penetrations, and no-scope and in-air flags. Valve matchmaking demos only.
- **2026-08-03**, index object. A channel entry can carry `available`. False means the demo did not carry that data, so an empty channel means "not recorded" rather than "nothing happened". It is set on `bot_takeover`, `bullet_damage`, `player_inputs`, `player_sound`, `rank_update` and `round_mvp`.

## grenade_bounce

- **2026-10-05**, column added: `grenade_id`. One id per thrown grenade for the whole match (int64). Join the three grenade channels on it. From parser 5.6.0 the grenades are numbered 1, 2, 3 in the order the parser first meets them, so a match parsed again gets the same ids; parser 5.5.0, in production for part of 2026-10-05, drew them at random on each parse. `entity_id` is reused within a match, so grouping on it can merge different grenades. It can be null on `grenade_state`.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-08-03**, channel added. Every surface a thrown grenade hit.

## grenade_state

- **2026-10-05**, column added: `grenade_id`. One id per thrown grenade for the whole match (int64). Join the three grenade channels on it. From parser 5.6.0 the grenades are numbered 1, 2, 3 in the order the parser first meets them, so a match parsed again gets the same ids; parser 5.5.0, in production for part of 2026-10-05, drew them at random on each parse. `entity_id` is reused within a match, so grouping on it can merge different grenades. It can be null on `grenade_state`.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-10-05**, values changed: `tick_throw`. Null where no throw was matched, not 0, -2 or -3. Declared nullable.
- **2026-10-03**, fixes: `entity_id_fixed`. A decoy with no `decoy_started` event keeps its -2 instead of being overwritten.
- **2026-06-05**, fixes: `entity_id_fixed`. -2 for a decoy with more than one start event. Such matches used to fail processing and were not published.

## grenade_vector

- **2026-10-05**, column added: `grenade_id`. One id per thrown grenade for the whole match (int64). Join the three grenade channels on it. From parser 5.6.0 the grenades are numbered 1, 2, 3 in the order the parser first meets them, so a match parsed again gets the same ids; parser 5.5.0, in production for part of 2026-10-05, drew them at random on each parse. `entity_id` is reused within a match, so grouping on it can merge different grenades. It can be null on `grenade_state`.
- **2026-10-05**, column added: `grenade_weapon_code`. The grenade's Valve item id (int64): 43 flashbang, 44 HE grenade, 45 smoke grenade, 46 molotov, 47 decoy and 48 incendiary. These are the same codes every other `*_weapon_code` column uses.
- **2026-10-05**, column removed: `grenade_type_code`. It held the parser library's own grenade numbering, 501 to 506, which collides with the item ids of knives. Read `grenade_weapon_code` instead.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-08-03**, channel added. The flight path of each thrown grenade, a row whenever its position changed.

## header

- **2026-10-06**, types changed: `bomb_time`, `ppp_version`, `rushb_version`. Written as the column's own type when a match has no value for it or the channel is empty. Before, such a column was written with Parquet's null type, so its type changed from match to match.
- **2026-10-05**, column added: `rank_type`. The ladder the match was played on (int64), the rank type its players carry: 7 Wingman, 11 Premier, 12 Competitive; 0 when nobody is ranked; -1 off Valve's ladders, as on FACEIT. Null when the demo has no player information.
- **2026-10-05**, column removed: `network_protocol`. It was 1234 in every match, a fixed value rather than the demo's.
- **2026-10-03**, values changed: `t_starters_avg_rank`, `ct_starters_avg_rank`, `t_starters_avg_wins`, `ct_starters_avg_wins`. Averaged over the first half's players only, rounds up to `max_rounds / 2` (12, or 8 in Wingman). Before, CS:GO's 15-round half was used, which mixed in the other team's players, so both teams often got the same average. A team with no players is now null instead of -1.
- **2026-10-03**, values changed: `t_starters_score_final`, `ct_starters_score_final`. Each starting team's own final score, followed through the half-time and overtime side swaps. Before, it was the larger of the side scores, which could give a team the other team's score.
- **2026-10-03**, values changed: `tick_save_rate`. Now 64, since every tick is kept. It was a fixed 21 that did not describe the data.
- **2026-09-07**, columns added: `freeze_time`, `round_time_defuse`, `bomb_time`, `max_rounds`. The server's own settings for freeze time (seconds), round time (minutes), bomb timer (seconds) and maximum rounds. Null when the demo does not record the setting; `bomb_time` has been null in every match checked.
- **2026-08-22**, column added: `is_gotv_recording`. True when the match was recorded with GOTV transmission restricted, as on tournament servers. Such matches lack the per-player channels GOTV restricts, such as `player_footstep` and `item_equip`.
- **2026-08-22**, column added: `is_wingman`. True for a Wingman match.
- **2026-08-22**, column added: `max_unique_players`. Distinct human players over the whole match. Above the lobby size when someone was substituted or came back on another account.
- **2026-08-22**, column removed: `__index_level_0__`. A leftover row-number column, never listed in the index, is gone from the last two channels that still had it.
- **2026-08-22**, index object. The index stops listing 62 columns that were never written. They are the header's `protocol`, `playback_time`, `playback_ticks`, `playback_frames`, `signon_length` and `second`, and the `player_tick` and `player_player_id` entries (and their `attacker_` and `assister_` forms) in 21 event channels. Duplicate entries are gone too: `player_vector`'s velocities, `round_state.second` and several header columns.
- **2026-06-05**, values changed: `providence`. A match without the platform's metadata file is now published, without these columns. Before, it failed processing and was not published.
- **2026-01-25**, values changed: `network_protocol`. Always 1234; the demo no longer provides a meaningful value.
- **2024-07-07**, column added: `unique_steamids`. Number of distinct players in `player_personal`.
- **2024-07-07**, fixes: `t_starters_score_final`, `ct_starters_score_final`. Missing scores no longer spoil the result.

## item_dropped

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-08-03**, channel added. A weapon leaving a player's hands, with the reason (`death`, `replaced` or `manual`).

## item_equip

- **2026-10-05**, column removed: `def_index`. It was 0 on every row, because CS2's equip event carries no item id. `item_pickup.def_index` carries it.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.

## item_pickup

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.

## item_refund

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-08-03**, channel added. Buy refunds.

## item_remove (removed 2026-08-03)

- **2026-08-03**, channel removed. It never had rows in CS2 data; it was a placeholder kept from CS:GO.

## molotov_fire

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-08-22**, column added: `entity_id_fixed`. The `molotov_state.entity_id_fixed` of the fire this flame belongs to, or -1 if unmatched. Join on this, not on `entity_id`, which the game reuses.
- **2026-08-03**, channel added. Each flame of each molotov or incendiary fire, when it ignites and when it goes out.

## molotov_state

- **2026-10-06**, types changed: `was_extinguished_by_smoke`, `was_extinguished_by_thrown_smoke`, `was_thrown_into_smoke`. Booleans, not 0 and 1. They describe a burn, so they are null, not 0, on every row but `inferno_startburn`.
- **2026-10-05**, column added: `extinguisher_not_found`. True where the fire ended early but no smoke was near enough to credit (bool). Before, `extinguisher_id`, `extinguisher_id_fixed`, `smoke_entity_id` and `smoke_entity_id_fixed` held -2 there.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-10-05**, values changed: `player_id`, `player_id_fixed`, `tick_throw`, `burn_duration`. Null, not -1, where no thrower was found: every `inferno_expire` row, and a round whose throws and fires don't pair up. `burn_duration` is null on `inferno_expire` rows; every start row still has one. Declared nullable.
- **2026-10-05**, values changed: `extinguisher_id`, `extinguisher_id_fixed`, `smoke_entity_id`, `smoke_entity_id_fixed`. Null on `inferno_expire` rows and where nobody put the fire out, not -1 or 0; the -2 moved to `extinguisher_not_found`. A real player 0 who put a fire out keeps `extinguisher_id` 0, where before it read the same as nobody. Declared nullable.
- **2026-08-22**, column added: `smoke_entity_id_fixed`. Joinable id of the smoke that put the fire out, matching its `grenade_state.entity_id_fixed`. It is 0 when the fire was not put out and -2 when no smoke was found. `smoke_entity_id` is the raw id, which the game reuses within a match.
- **2026-08-22**, column added: `fraction_extinguished`. Share of the fire's flames, 0 to 1, that a smoke put out.
- **2026-08-22**, column added: `was_thrown_into_smoke`. 1 when the molotov or incendiary landed inside a smoke that was already up.
- **2026-08-22**, values changed: `was_extinguished_by_smoke`. No longer set for every incendiary that simply burned out. Reads 0 rather than -1 when the fire was not put out. Where `molotov_fire` is present, a fire counts as put out when any of its flames was, so partial extinguishes count. Smokes are taken to last 17.47 seconds (was 17).
- **2026-08-22**, values changed: `extinguisher_id`, `extinguisher_id_fixed`, `smoke_entity_id`. Only a smoke within 250 units of the fire is credited; otherwise -2. Before, smokes far from the fire were credited (the median was over 1,000 units away).
- **2026-08-22**, values changed: `was_extinguished_by_thrown_smoke`. Written in every match, as 0 or 1. Before, it was listed in the index but written only in some matches, and was never 1.

## other_death

- **2026-10-06**, types changed: `other_type`, `weapon_name`. Written as the column's own type when a match has no value for it or the channel is empty. Before, such a column was written with Parquet's null type, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-10-05**, values changed: `attacker_id`, `attacker_id_fixed`. Null where there is no attacker or assister, not 65535. Declared nullable.
- **2026-08-22**, types changed: `is_attacker_blind`, `is_noscope`, `is_through_smoke`. Was int64 holding 0 or 1, now bool, as the index always declared. Still nullable.

## player_action (removed 2026-08-03)

- **2026-08-03**, channel removed. Empty since CS2 demos stopped carrying these events (see 2026-01-22).
- **About 2026-01-22**, Change in CS2 demos. CS2 demos stopped carrying these events around this date; most matches from here on have no rows. The channel was removed on 2026-08-03.

## player_blind

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2023-12-09**, values changed. Keeps only flashes on players alive at that tick. CS2 also reports flashes on dead and spectating players.

## player_chat

- **2026-10-06**, types changed: `text`. Written as the column's own type when a match has no value for it or the channel is empty. Before, such a column was written with Parquet's null type, so its type changed from match to match.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-08-22**, types changed: `is_chat_all`. Was int64 holding 0 or 1, now bool, as the index always declared. Still nullable.
- **2026-08-03**, channel added. In-game chat. `text` reads `redacted` in the published data.

## player_connect

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-08-03**, channel added. Player and bot connects, warm-up included.

## player_death

- **2026-10-05**, types changed: `player_id_fixed`, `attacker_id_fixed`, `assister_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-10-05**, values changed: `attacker_id`, `attacker_id_fixed`, `assister_id`, `assister_id_fixed`. Null where there is no attacker or assister, not 65535. Declared nullable.
- **2026-08-22**, types changed: `is_attacker_blind`, `is_flash_assist`, `is_noscope`, `is_through_smoke`. Was int64 holding 0 or 1, now bool, as the index always declared. Still nullable.

## player_disconnect

- **2026-10-06**, types changed: `disconnect_reason`. Written as the column's own type when a match has no value for it or the channel is empty. Before, such a column was written with Parquet's null type, so its type changed from match to match.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.

## player_footstep

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.

## player_hurt

- **2026-10-05**, types changed: `player_id_fixed`, `attacker_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-10-05**, values changed: `attacker_id`, `attacker_id_fixed`. Null where there is no attacker or assister, not 65535. Declared nullable.
- **2026-10-05**, values changed: `weapon_name`. Null for damage with no weapon, not an empty string.

## player_info

- **2026-10-05**, fixes. Every player who spawns in a round that reaches freeze end has a row for that round. Before, a player missing from the round's roster, such as one who joined or reconnected late, had none, so their rows in that round joined to no player.
- **2026-10-03**, fixes: `rank_platform`, `elo_platform`. On FACEIT matches, each player's FACEIT level and Elo now belong to the right player. Before, they were matched by row position and could be another player's.
- **2026-09-07**, column added: `player_controller_id`. The player's controller id, as already in `player_status` and `player_personal`. Tells apart two players who share a `player_id` in one round.
- **2026-09-07**, fixes. A match in which two different players share a `round` and `player_id_fixed` now fails processing and is not published.
- **2026-07-07**, column added: `rank_type`. Which ladder `rank` is on: 11 Premier (CS Rating), 12 Competitive (skill group 0 to 18), 7 Wingman; 0 or -1 when unknown. Every player in a match has the same value.
- **2026-07-07**, column added: `elo_platform`. The player's FACEIT Elo, on FACEIT matches only. The column is absent from other matches.
- **2026-06-05**, values changed: `rank_raw`, `rank_platform`. A match without the platform's metadata file is now published, without these columns. Before, it failed processing and was not published.
- **2024-02-12**, fixes: `team_code`. The parser library update fixes players who could be given the wrong team, and disconnected players who were still treated as playing.

## player_inputs

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-08-03**, channel added. Which buttons each player held, a row whenever that changed. Empty on Valve matchmaking demos, which do not carry it.
- **2026-08-03**, index object. A channel entry can carry `available`. False means the demo did not carry that data, so an empty channel means "not recorded" rather than "nothing happened". It is set on `bot_takeover`, `bullet_damage`, `player_inputs`, `player_sound`, `rank_update` and `round_mvp`.

## player_name

- **2026-10-06**, types changed: `name_new`, `name_old`. Written as the column's own type when a match has no value for it or the channel is empty. Before, such a column was written with Parquet's null type, so its type changed from match to match.
- **2026-08-03**, values changed. Records name changes. It had no rows in any CS2 data before.

## player_personal

- **2026-10-05**, fixes. Every player who spawns in a round that reaches freeze end has a row for that round. Before, a player missing from the round's roster, such as one who joined or reconnected late, had none, so their rows in that round joined to no player.
- **2026-06-07**, fixes: `player_id`. When a round records the same `player_id` for two players, the player's controller id is used instead. A match that would still have duplicate `tick` and `player_id_fixed` rows fails processing and is not published.
- **2023-12-09**, column added: `player_controller_id`. The player's controller id, stable for a player slot. Joins `player_status` rows to `player_personal`.

## player_sound

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-08-03**, channel added. Sounds a player made and how far they carried. Empty on Valve matchmaking demos, which do not carry it.
- **2026-08-03**, index object. A channel entry can carry `available`. False means the demo did not carry that data, so an empty channel means "not recorded" rather than "nothing happened". It is set on `bot_takeover`, `bullet_damage`, `player_inputs`, `player_sound`, `rank_update` and `round_mvp`.

## player_spawn

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-10-05**, fixes: `round`. The round the player spawned into. Before, every row carried the round before it.

## player_status

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, types changed. Written compactly, with the same values. Each integer column is the smallest signed type that holds it, `int8`, `int16` or `int32`, where it was `int64`. The floats read from the demo are `float32`, where they were `double`. `place_name` is dictionary-encoded. The spec's tables give every column's type. pandas reads nullable `Int8`, `Int16` or `Int32` where it read `Int64`, and a category for `place_name`. Element-wise arithmetic stays narrow and can wrap (with `int16` `money`, `money * 5` gives 14,464 for 16,000), so cast to a wider type first. How to read old and new files together is in [The player tables](./spec.md#the-player-tables).
- **2026-10-05**, file format. Rows are sorted by `player_id`, then `tick`, where they were in tick order; sort by `tick`, then `player_id`, for tick order. The floats are stored with Parquet's byte stream split encoding, which fastparquet can't read. pyarrow (pandas' default engine), polars and DuckDB read both the old and the new files.
- **2026-10-05**, fixes: `inv_flashbang`, `equipment_value_calc`. `inv_flashbang` counts the flashbangs held, up to 2, and drops to 0 at the throw of the last one. Before, it read 1 for two flashbangs and could stay at 1 for about 0.7 seconds after the throw. `equipment_value_calc`, which counts them, follows.
- **2026-08-22**, column added: `is_reloading`. Whether the player is reloading (bool). Replaces `reload_visually_complete`.
- **2026-08-22**, column removed: `reload_visually_complete`. Null on every row since 2025-08-21. Use `is_reloading`.
- **2026-08-22**, types changed: `burst_mode`, `is_silenced`. Was int64 holding 0 or 1, now bool, as the index always declared. Still nullable.
- **2026-06-07**, fixes: `player_id`. When a round records the same `player_id` for two players, the player's controller id is used instead. A match that would still have duplicate `tick` and `player_id_fixed` rows fails processing and is not published.
- **2025-08-21**, values changed: `reload_visually_complete`. No longer filled, so null on every row. Removed on 2026-08-22 in favour of `is_reloading`.
- **2023-12-09**, column added: `player_controller_id`. The player's controller id, stable for a player slot. Joins `player_status` rows to `player_personal`.

## player_vector

- **2026-10-06**, columns removed: `second`, `x_vel`, `y_vel`, `z_vel`, `speed_2d`, `movement_angle`, `movement_angle_diff`, `phi_vel`, `theta_vel`, `ang_vel`. **Breaking:** these ten columns are no longer stored, so code that reads them from `player_vector` breaks. Each was computed from other columns, and together they were most of the file, which is now under a third of its size. Compute them on load with [pureskillgg-csgo-dsdk](https://pypi.org/project/pureskillgg-csgo-dsdk/) 3.3.1 or later: `add_player_vector_derived_columns(df)` adds all ten, from the columns that `player_vector_source_columns()` lists (`tick`, `round`, `player_id`, the positions and the angles). The index still lists the ten, with origin `calculated-deleted`.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed: `x_vel`, `y_vel`, `z_vel`, `theta_vel`, `phi_vel`, `ang_vel`, `speed_2d`, `movement_angle`. Computed per player per round, so a player's first sample in each round is 0. Before, positions and view angles were differenced across rounds, and a respawn read as a jump, as much as 365,000 units a second in our test matches. A velocity component over 3,500 within a round, the game's `sv_maxvelocity`, is taken as a teleport and reads 0. `speed_2d`, `movement_angle` and `ang_vel` follow from these.
- **2026-10-05**, values changed: `movement_angle_diff`. The angle between where the player looks (`theta_ang`) and where they move, in -180 to 180: 0 moving the way they look, ±90 sideways, ±180 backwards, and null while standing still. Before, it was `theta_ang` minus `movement_angle` with 360 added once to a negative result, so it ran from -180 to 360, the same angle could read 350 or -10, and standing still read -1.
- **2026-10-05**, types changed. Written compactly, with the same values. Each integer column is the smallest signed type that holds it, `int8`, `int16` or `int32`, where it was `int64`. The floats read from the demo are `float32`, where they were `double`. `place_name` is dictionary-encoded. The spec's tables give every column's type. pandas reads nullable `Int8`, `Int16` or `Int32` where it read `Int64`, and a category for `place_name`. Element-wise arithmetic stays narrow and can wrap (with `int16` `money`, `money * 5` gives 14,464 for 16,000), so cast to a wider type first. How to read old and new files together is in [The player tables](./spec.md#the-player-tables).
- **2026-10-05**, file format. Rows are sorted by `player_id`, then `tick`, where they were in tick order; sort by `tick`, then `player_id`, for tick order. The floats are stored with Parquet's byte stream split encoding, which fastparquet can't read. pyarrow (pandas' default engine), polars and DuckDB read both the old and the new files.
- **2026-10-05**, fixes: `current_ammo`. The number of bullets in the magazine, with 0 for an empty one. Before, every value was one low and an empty magazine read 4294967295. A replay parsed before this change and converted again after it holds -1 for an empty magazine, with the other values still one low.
- **2026-08-22**, column removed: `second_diff`. Internal working columns that were written but never listed in the index.
- **2026-08-22**, column removed: `__index_level_0__`. A leftover row-number column, never listed in the index, is gone from the last two channels that still had it.
- **2026-08-22**, index object. The index stops listing 62 columns that were never written. They are the header's `protocol`, `playback_time`, `playback_ticks`, `playback_frames`, `signon_length` and `second`, and the `player_tick` and `player_player_id` entries (and their `attacker_` and `assister_` forms) in 21 event channels. Duplicate entries are gone too: `player_vector`'s velocities, `round_state.second` and several header columns.
- **2026-06-07**, fixes: `player_id`. When a round records the same `player_id` for two players, the player's controller id is used instead. A match that would still have duplicate `tick` and `player_id_fixed` rows fails processing and is not published.
- **2026-06-05**, fixes: `team_code`. Matches with a bot takeover are published; they used to fail processing.
- **2026-04-29**, columns removed: `x_aimpunch`, `y_aimpunch`, `aim_punch_angle_vel_x`, `aim_punch_angle_vel_y`, `aim_punch_angle_vel_z`. The aim-punch columns are no longer written.

## rank_update

- **2026-10-05**, types changed: `rank_change`. An integer (int64), like `rank_old` and `rank_new`. Before, a double holding whole numbers.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-08-03**, channel added. Rank changes at the end of the match, official matchmaking only. `win_count` above 2500 is published as 2501, as `player_info.wins` is.
- **2026-08-03**, index object. A channel entry can carry `available`. False means the demo did not carry that data, so an empty channel means "not recorded" rather than "nothing happened". It is set on `bot_takeover`, `bullet_damage`, `player_inputs`, `player_sound`, `rank_update` and `round_mvp`.

## round_end

- **2026-08-03**, column removed: `legacy_code`. No CS2 source.
- **2026-08-03**, values changed: `win_reason_code`, `win_reason_message`, `player_count`. Real round ends again. `win_reason_code` and `win_reason_message` come from the game, and `player_count` is the number of players on the team at the end of the round, bots included. Since 2024-02-12 the channel had been rebuilt from `round_state` with fixed values.
- **2024-02-12**, values changed: `win_reason_code`, `win_reason_message`, `legacy_code`, `player_count`. CS2 demos stopped carrying round-end events. The channel is rebuilt from `round_state`: `win_reason_code` is 8 (CT win) or 9 (T win), `win_reason_message` is the generic team-win message, `legacy_code` is 0 and `player_count` is 20.

## round_mvp

- **2026-08-03**, column added: `mvp_count`. The player's running MVP total. `round_mvp` has rows again, one whenever a player's MVP count rises; it had been empty on most matches since early 2024.
- **2026-08-03**, columns removed: `mvp_reason_code`, `music_kit_mvps`. No CS2 source.
- **2026-08-03**, index object. A channel entry can carry `available`. False means the demo did not carry that data, so an empty channel means "not recorded" rather than "nothing happened". It is set on `bot_takeover`, `bullet_damage`, `player_inputs`, `player_sound`, `rank_update` and `round_mvp`.
- **About 2024-03-01**, Change in CS2 demos. From February 2024 a growing share of matches have no rows; by July 2024 none of the matches checked do. The channel has rows again from 2026-08-03.

## round_start

- **2026-08-03**, columns removed: `time_limit`, `frag_limit`, `objective`. Always 0, 0 and empty in CS2 data.
- **2026-08-03**, values changed. Real round starts again, one row per round, round 1 included. The rebuilt channel used since 2024-02-12 was one row short.
- **2024-08-05**, values changed. When the demo has no round starts, the channel is rebuilt from those new `round_state` rows instead of from `round_prestart`.
- **2024-02-12**, values changed. CS2 demos stopped carrying round-start events. The channel is rebuilt from `round_state` and has one row fewer than the rounds played.

## round_state

- **2026-10-05**, fixes: `event_type`. The `freezetime_ended_inferred` row, the first tick a player moves in a round, no longer fires early on a late player's respawn. In 8 of the 927 rounds of our 50 test matches it came 43 to 3,520 ticks before `round_freeze_end`; it now lands one tick after it.
- **2026-08-22**, index object. The index stops listing 62 columns that were never written. They are the header's `protocol`, `playback_time`, `playback_ticks`, `playback_frames`, `signon_length` and `second`, and the `player_tick` and `player_player_id` entries (and their `attacker_` and `assister_` forms) in 21 event channels. Duplicate entries are gone too: `player_vector`'s velocities, `round_state.second` and several header columns.
- **2026-08-03**, values changed. The `round_start` and `round_end` event rows are back (missing since 2024-02-12). Each round now has two `round_start` rows: the game's own, and the one the converter adds after `round_poststart` (since 2024-08-05).
- **2026-08-03**, fixes: `t_score`, `ct_score`. On `round_end` rows, the final round is no longer counted twice in 24-round matches (a CS:GO 30-round rule had been applied).
- **2024-08-05**, values changed. A `round_start` row is added for each round, one tick after `round_poststart`.
- **2024-07-28**, fixes. `freezetime_ended_inferred` ignores the first 5 ticks of a round, where the spawn teleport looked like movement.
- **2024-07-07**, values changed: `event_type`. New event `freezetime_ended_inferred`: one row per round, at the first tick any player moves.
- **2024-02-12**, values changed. No more `round_start` and `round_end` event rows: CS2 demos stopped carrying them.

## score_update

- **2026-08-03**, channel added. Each change in a team's score.

## team_change

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.
- **2026-08-03**, channel added. Players switching teams, including the silent half-time swap.

## tick

- **2026-10-05**, values changed: `second_since_previous_phase`. Null before the match's first phase, not -1. Declared nullable.
- **2026-09-07**, index object. The `tick` channel's category is now `telemetry` (was `single_event`).
- **2026-08-22**, columns removed: `next_valid_tick`, `next_valid_tick_round`. Internal working columns that were written but never listed in the index.
- **2026-07-07**, values changed: `previous_phase`, `second_since_previous_phase`. When several phase events share a tick, the phase now follows a fixed order instead of whichever event sorted last.
- **2024-08-05**, columns added: `next_valid_tick`, `next_valid_tick_round`. Internal working columns, written but not listed in the index. Removed on 2026-08-22.

## weapon_action

- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.

## weapon_fire

- **2026-10-06**, types changed: `missed_molotov`. A boolean, not 0 and 1.
- **2026-10-05**, types changed: `player_id_fixed`. An integer in every match, with nulls where no player matched. Before, a match in which any row found no player wrote the column as a double, so its type changed from match to match.
- **2026-10-05**, values changed. The `*_x_vel`, `*_y_vel` and `*_z_vel` columns merged from `player_vector` take its per-round velocities, so they no longer jump on a respawn.

## world_item_vector

- **2026-08-03**, channel added. Positions of items lying on the ground, a row whenever one moved.
