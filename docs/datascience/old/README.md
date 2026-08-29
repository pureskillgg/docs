---
sidebar_label: About the archive
---

# Archive

Older versions of these pages, kept because the retained window still contains
revisions they describe. Nothing here describes the data set as it is published
today.

Which page you need depends on the revision, not on when you downloaded it: a
revision from 2026-07-31 is still retained, still exportable today, and still
described by the archived spec. If you want to know what is being published
now, start at [PureSkill.gg Data Science](/datascience/).

## What is in here

| Page                                                | Describes                                                                       | Last current |
| --------------------------------------------------- | ------------------------------------------------------------------------------- | ------------ |
| [Data Science FAQ](./datascience-faq.md)            | Python 3.9 and Poetry tooling, 2022 download cost estimates, the CS:GO data set | 2022-07-04   |
| [Competitive CS2 Gameplay](./cs2/csds/README.md)    | The CS2 data set at 31 files per match                                          | 2024-02-24   |
| [CSDS Spec (CS2)](./cs2/csds/spec.md)               | 30 CS2 channels                                                                 | 2024-02-24   |
| [Competitive CS:GO Gameplay](./csgo/csds/README.md) | The data set while it carried CS:GO data                                        | 2024-02-24   |
| [CSDS Spec (CS:GO)](./csgo/csds/spec.md)            | 32 CS:GO channels                                                               | 2024-02-24   |
| [Revision Stats (CS:GO)](./csgo/csds/revisions.md)  | CS:GO matches per day                                                           | 2022         |

The three CS:GO pages keep their original addresses under
`/datascience/adx/csgo/`, so links published before the archive was created
still resolve.

## What changed since

- **CS:GO data stopped being produced.** Counter-Strike: Global Offensive was
  replaced by Counter-Strike 2 in September 2023, and the pipeline no longer
  parses CS:GO demos. There is one AWS Data Exchange product throughout; it
  carries CS2 data now and retains no CS:GO revisions. Four CS:GO channels have
  no CS2 equivalent: `item_remove`, `player_action`, `player_fall` and
  `player_interaction`.
- **CS2 went from 30 channels to 42.** Fourteen were added: `bullet_damage`,
  `grenade_bounce`, `grenade_vector`, `item_dropped`, `item_refund`,
  `molotov_fire`, `player_chat`, `player_connect`, `player_inputs`,
  `player_sound`, `rank_update`, `score_update`, `team_change` and
  `world_item_vector`. Two were removed: `item_remove` and `player_action`.
  Published revisions changed over during the first days of August 2026:
  revisions through 2026-07-31 carry the old set, 2026-08-02 holds a mix, and
  2026-08-04 onward carry the new one.
- **Two columns went away.** `player_tick` and `player_player_id` were dropped
  from every channel that merged in player position. `tick` and `second` are no
  longer published on `player_info` or `player_personal`.
- **The tooling moved.** The tutorial needs Python 3.14 and [uv], not Python 3.9
  and Poetry.
- **Revisions are kept for about a year.** Revisions older than that are
  revoked and emptied. The archived pages say old data is deleted "at our
  discretion", which understates how regular the pruning now is.

[uv]: https://docs.astral.sh/uv/
