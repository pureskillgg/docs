---
sidebar_label: Known Flaws
sidebar_position: 5.5
description: What in the published data is wrong, missing or easy to trip over, and how to work around it.
---

# Known Flaws

What we know is wrong, missing or easy to trip over in the published data, and
how to work around it. When a flaw is fixed, the fix and its date go in the
[changelog](./changelog.md).

## Matches uploaded by hand

A match a user uploads by hand has `platform` `unknown`, and its
`match_date` is when it was processed, not when it was played.

Since 2026-10-08 that includes many FACEIT matches. Tell them apart by
`header.server_name`, which begins `FACEIT.com` for a match played on a FACEIT
server.

## Linking players across matches

Player identities are replaced in each match, but player fingerprinting can
link some players across matches, as a
[thesis on identifying Counter-Strike players by their mouse movement in demos][fingerprinting]
shows. Such a link ties matches to the same unknown player; it doesn't reveal
who they are, and trying to find out is not permitted by the license
agreement.

## Item names and codes in `item_equip`

- `item_equip.def_index`, the item code, is null in most rows (85% in the
  matches published from 2026-10-01 to 10-08) and sometimes 0.
- The short item names in `item_equip` and `item_pickup` are shared between
  weapons that use the same slot: `hkp2000` is both the P2000 and the USP-S,
  `m4a1` both the M4A4 and the M4A1-S, `mp7` both the MP7 and the MP5-SD, and
  `deagle` both the Desert Eagle and the R8 Revolver. Use an item code where
  the row has one. `item_dropped` and `world_item_vector` use display names
  such as `AK-47` instead.

## Duplicate matches

A match's `id` is created each time a demo is processed, so a demo processed
twice, for example one uploaded by two users, appears twice with different
ids. Find them by comparing the `header` entries that describe the match itself,
not its processing (such as when it was processed, or by which versions).

## Empty channels

- Servers that restrict what their recording broadcasts, as tournament
  servers do, leave `player_blind`, `player_footstep`, `item_equip` and
  `weapon_action` empty; the rest of the match is complete.
- `player_inputs` and `player_sound` are empty in most matches, because most
  demos don't carry those events. The index object marks a channel whose events
  the demo didn't carry with `available: false`.
- `player_vector` and `player_status` have rows only for living players.

## Missing values

- Older matches from FACEIT are missing player ranks.
- Within a match, events can be missing. This is rare, but can upset some
  calculations; skipping the match is usually enough.

## Changes across the retained window

- **The channel set changed.** Revisions through 2026-08-02 carry 30 channels
  rather than 42, and the 2026-08-03 revision holds a mix. Fourteen channels
  were added: `bullet_damage`, `grenade_bounce`, `grenade_vector`,
  `item_dropped`, `item_refund`, `molotov_fire`, `player_chat`,
  `player_connect`, `player_inputs`, `player_sound`, `rank_update`,
  `score_update`, `team_change` and `world_item_vector`. Two were removed:
  `item_remove` and `player_action`. Read each match's `csds` index object
  rather than assuming a fixed channel list.
- **`player_vector` stores fewer columns.** Since 2026-10-06 it no longer
  stores its ten derived columns; compute them on load, as the
  [spec](./spec.md) describes.
- **Older matches were processed by older versions of the pipeline.** The
  [changelog](./changelog.md) lists every change, and `header.rushb_version`
  and `header.ppp_version` say which versions built a match.

[fingerprinting]: https://digital.ub.uni-paderborn.de/hs/content/titleinfo/8205986/full.pdf
