---
sidebar_label: Enums
sidebar_position: 1.2
description: What the codes in the data mean, from team and win reason to weapon, hit group and rank.
---

# Enums

What the codes in the data mean. The values and labels below were read from
the 1,752 matches published from 2026-10-01 to 2026-10-08, unless a section
says otherwise.

## Teams

`team_code`, every `*_team_code` column, `winner_team_code`, and
`team_change.old_team_code` and `new_team_code`.

| Code | Team                                                           |
| ---: | -------------------------------------------------------------- |
|    0 | Unassigned, seen as `old_team_code` when a player joins a team |
|    1 | Spectator (the game's code; not seen in these matches)         |
|    2 | Terrorists                                                     |
|    3 | Counter-Terrorists                                             |

## Round end

`round_end.win_reason_code`, with the game's message for it in
`win_reason_message`.

| Code | Message                             | Winner             | Meaning                                 |
| ---: | ----------------------------------- | ------------------ | --------------------------------------- |
|    1 | `#SFUI_Notice_Target_Bombed`        | Terrorists         | The bomb exploded.                      |
|    7 | `#SFUI_Notice_Bomb_Defused`         | Counter-Terrorists | The bomb was defused.                   |
|    8 | `#SFUI_Notice_CTs_Win`              | Counter-Terrorists | The Terrorists were eliminated.         |
|    9 | `#SFUI_Notice_Terrorists_Win`       | Terrorists         | The Counter-Terrorists were eliminated. |
|   11 | `#SFUI_Notice_All_Hostages_Rescued` | Counter-Terrorists | Hostages rescued (hostage maps).        |
|   12 | `#SFUI_Notice_Target_Saved`         | Counter-Terrorists | Time ran out with no bomb planted.      |
|   13 | `#SFUI_Notice_Hostages_Not_Rescued` | Terrorists         | Time ran out on a hostage map.          |
|   17 | `#SFUI_Notice_Terrorists_Surrender` | Counter-Terrorists | The Terrorists surrendered.             |
|   18 | `#SFUI_Notice_CTs_Surrender`        | Terrorists         | The Counter-Terrorists surrendered.     |

No other code appears. A drawn round would be code 10, but drawn rounds are
removed before publication.

## Hit groups

`player_hurt.hit_box_code`: where the damage landed. The names are the game's
hit groups; the data holds the codes 0 to 8.

| Code | Hit group              |
| ---: | ---------------------- |
|    0 | Generic (no hit group) |
|    1 | Head                   |
|    2 | Chest                  |
|    3 | Stomach                |
|    4 | Left arm               |
|    5 | Right arm              |
|    6 | Left leg               |
|    7 | Right leg              |
|    8 | Neck                   |

## Weapon types

`item_equip.weapon_type_code`.

| Code | Type         | Examples                             |
| ---: | ------------ | ------------------------------------ |
|    0 | Knife        |                                      |
|    1 | Pistol       | P2000, Glock-18, Desert Eagle        |
|    2 | SMG          | MAC-10, MP9, MP7                     |
|    3 | Rifle        | AK-47, M4A4, Galil AR                |
|    4 | Shotgun      | XM1014, MAG-7, Nova                  |
|    5 | Sniper rifle | AWP, SSG 08, SCAR-20                 |
|    6 | Machine gun  | Negev, M249                          |
|    7 | C4           |                                      |
|    8 | Taser        | Zeus x27                             |
|    9 | Grenade      | Flashbang, HE Grenade, Smoke Grenade |

## Weapons and items

`player_vector.weapon_code`, every `*_weapon_code` column,
`grenade_vector.grenade_weapon_code`, and `def_index` in `item_equip`,
`item_pickup`, `item_dropped`, `item_refund` and `world_item_vector` are all
Valve's item definition index. [weapon_codes.csv](./assets/weapon_codes.csv)
lists every code seen in the data except 0, with the game's name for it and its type.

| Code | Item          | Code | Item      | Code | Item               |
| ---: | ------------- | ---: | --------- | ---: | ------------------ |
|    1 | Desert Eagle  |   24 | UMP-45    |   42 | Knife (CT default) |
|    2 | Dual Berettas |   25 | XM1014    |   43 | Flashbang          |
|    3 | Five-SeveN    |   26 | PP-Bizon  |   44 | HE Grenade         |
|    4 | Glock-18      |   27 | MAG-7     |   45 | Smoke Grenade      |
|    7 | AK-47         |   28 | Negev     |   46 | Molotov            |
|    8 | AUG           |   29 | Sawed-Off |   47 | Decoy Grenade      |
|    9 | AWP           |   30 | Tec-9     |   48 | Incendiary Grenade |
|   10 | FAMAS         |   31 | Zeus x27  |   49 | C4                 |
|   11 | G3SG1         |   32 | P2000     |   50 | Kevlar Vest        |
|   13 | Galil AR      |   33 | MP7       |   51 | Kevlar + Helmet    |
|   14 | M249          |   34 | MP9       |   55 | Defuse Kit         |
|   16 | M4A4          |   35 | Nova      |   59 | Knife (T default)  |
|   17 | MAC-10        |   36 | P250      |   60 | M4A1-S             |
|   19 | P90           |   38 | SCAR-20   |   61 | USP-S              |
|   23 | MP5-SD        |   39 | SG 553    |   63 | CZ75-Auto          |
|      |               |   40 | SSG 08    |   64 | R8 Revolver        |

Codes 500 and up are knife skins, such as 507 for the Karambit; the data names
all of them `knife`, and the CSV gives Valve's name for each.

Prefer the code to the item name. The short names in `item_equip` and
`item_pickup` are shared between weapons that use the same slot: `hkp2000` is
both the P2000 and the USP-S, `m4a1` both the M4A4 and the M4A1-S, `mp7` both
the MP7 and the MP5-SD, and `deagle` both the Desert Eagle and the R8 Revolver.
`item_dropped` and `world_item_vector` use display names such as `AK-47`
instead. `item_equip.def_index` is often null or 0, so take the code from
another channel where you can.

## Ranks

`player_info.rank_type` says which ladder `player_info.rank` is on.

| `rank_type` | Ladder             | `rank`                                                |
| ----------: | ------------------ | ----------------------------------------------------- |
|          11 | Premier            | The CS Rating, from 0 up; the highest seen is 28,467. |
|          12 | Competitive        | The skill group on that map, 0 to 18 (below).         |
|           7 | Wingman            | The Wingman skill group, 0 to 18 (below).             |
|          -1 | Not a Valve ladder | 0. FACEIT matches and most manual uploads.            |

Skill groups, for Competitive and Wingman: 0 unranked, 1 Silver I, 2 Silver
II, 3 Silver III, 4 Silver IV, 5 Silver Elite, 6 Silver Elite Master, 7 Gold
Nova I, 8 Gold Nova II, 9 Gold Nova III, 10 Gold Nova Master, 11 Master
Guardian I, 12 Master Guardian II, 13 Master Guardian Elite, 14 Distinguished
Master Guardian, 15 Legendary Eagle, 16 Legendary Eagle Master, 17 Supreme
Master First Class, 18 The Global Elite. The names are the game's; the data
holds the numbers.

## Round phases

`round_state.phase`: `first` and `second` for the halves, `halftime` between
them, and `postgame` after the last round.

## Event types

`event_type` in each multi-event channel takes these values:

| Channel         | `event_type` values                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bomb_action`   | `bomb_begin_plant`, `bomb_pickup`, `bomb_dropped`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `bomb_defuse`   | `bomb_begin_defuse`                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `bomb_state`    | `bomb_planted`, `bomb_defused`, `bomb_exploded`                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `grenade_state` | `flashbang_detonate`, `hegrenade_detonate`, `smokegrenade_detonate`, `smokegrenade_expired`, `decoy_started`, `decoy_detonate`                                                                                                                                                                                                                                                                                                                                    |
| `molotov_state` | `inferno_startburn`, `inferno_expire`                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `weapon_action` | `reload`, `zoom`, `fire_on_empty`                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `round_state`   | `begin_new_match`, `round_announce_match_start`, `round_prestart`, `round_start`, `round_poststart`, `cs_round_start_beep`, `cs_round_final_beep`, `round_freeze_end`, `freezetime_ended_inferred`, `buytime_ended`, `bomb_planted`, `bomb_defused`, `bomb_exploded`, `round_end`, `round_officially_ended`, `cs_pre_restart`, `announce_phase_end`, `round_announce_last_round_half`, `round_announce_match_point`, `round_announce_final`, `cs_win_panel_match` |

The spec lists a few more event types for some channels, such as
`bomb_abort_plant` and `inferno_extinguish`; none appeared in these matches.

## Bombsites

`site_code` in `bomb_action` and `bomb_state` is not A or B. It is the game's
id for the bombsite's trigger, and it differs from match to match: Mirage
alone had 325 different values in these matches. Tell the sites apart by
position, or by the callout in `player_status.place_name`.

## Radar colours

`player_info.radar_color_code`: 0 to 4 are the five teammate colours on the
radar, and -1 means none. The data doesn't say which colour each number is.
