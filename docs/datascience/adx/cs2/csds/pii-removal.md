---
sidebar_label: PII Removal
sidebar_position: 4
description: What we remove or change in the published data so it does not carry players' personal information.
---

# PII Removal

Before a match is published, we remove or change these values, because they
could identify a player.

| Where                                       | What we do                                                                                                                                                     |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player_personal.name`, `clan_tag`          | Replaced with `redacted`.                                                                                                                                      |
| `player_name.name_new`, `name_old`          | Replaced with `redacted`.                                                                                                                                      |
| `player_personal.steam_id`                  | Replaced with a letter per player (`A`, `B`, `C`, …) in order of first appearance. The letters restart each match.                                             |
| `player_chat.text`                          | Replaced with `redacted`.                                                                                                                                      |
| `player_status.ping`                        | Set to 0.                                                                                                                                                      |
| `player_info.wins`, `rank_update.win_count` | Values above 2500 are published as 2501.                                                                                                                       |
| `header.sharecode`, `demo_id`               | Replaced with `redacted`.                                                                                                                                      |
| The `csds` index object                     | `sharecode`, `demoId` and `metadata.bucket` are replaced with `redacted`, internal job ids with the match's public `id`, and `matchDate` is cut to the minute. |

In the index object, each changed column's `origin` ends in `-redacted` or
`-capped`.

Everything else is published as the game and the pipeline recorded it. That
includes `header.server_name`, as the server named itself, and
`header.match_date`, to the second; only the index object's `matchDate` is cut
to the minute.
