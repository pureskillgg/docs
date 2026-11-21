---
sidebar_label: About the archive
---

# Archive

Older versions of these pages, kept because the retained window still contains
revisions they describe, and a summary of what those older revisions hold.
Nothing here describes the data set as it is published today.

Which page you need depends on the revision, not on when you downloaded it: a
revision from 2026-08-02 is still retained, still exportable today, and still
described by the archived spec. If you want to know what is being published
now, start at [PureSkill.gg Data Science](/datascience/).

## What older revisions hold

The data set keeps revisions from 2025-07-19 on ([Revision Stats] lists them),
and the older ones differ from today's. A match published today is one zip of
56 files, 55 channels and the index object, about 15 MB. Older revisions differ
as follows:

| Revisions                 | How their matches differ from today's                                                                                                                                                                                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2025-07-19 to 2026-08-02  | 30 channels, described by the [archived spec](./cs2/csds/spec.md), delivered as 31 loose objects a match, about 35 to 40 MB. The channel files are compressed with GZIP until 2026-07-07 and ZSTD from 2026-07-08.                                                                  |
| 2026-08-03                | A mix: some matches have the 30 channels above, the others the 42 below.                                                                                                                                                                                                            |
| 2026-08-04 to 2026-10-12  | 42 channels, delivered as 43 loose objects a match, about 34 MB. On 2026-10-05 a match is about 26 MB, and from 2026-10-06 about 10 MB, after `player_vector` stopped storing its ten derived columns. Matches processed after 21:22 UTC on 2026-10-12 come as one zip of 43 files. |
| 2026-10-13 and 2026-10-14 | 42 channels, as one zip of 43 files a match, about 13 MB.                                                                                                                                                                                                                           |
| 2026-10-15 and 2026-10-16 | Revoked; see the [changelog](/datascience/adx/cs2/csds/changelog).                                                                                                                                                                                                                  |
| 2026-10-17                | Mostly today's 55 channels, plus 4,891 matches processed on 2026-10-09 to 2026-10-11 with 42.                                                                                                                                                                                       |
| 2026-10-17 to 2026-11-14  | Files about half again as big as today's, about 22 MB a match, before the tuned encodings of 2026-11-15.                                                                                                                                                                            |

Two more things vary across the window:

- **Revisions straddle changes.** Until 2026-09-07, a revision that failed to
  close carried its matches into the next one, so one revision could hold more
  than one day.
- **Columns and values changed throughout.** The [changelog] dates every
  change, and each match's `header.rushb_version` and `header.ppp_version`
  name the releases that built it. Read each match's `csds` index object
  rather than assuming a channel list.

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
- **CS2 went from 30 channels to 55.** Fourteen were added in August 2026:
  `bullet_damage`, `grenade_bounce`, `grenade_vector`, `item_dropped`,
  `item_refund`, `molotov_fire`, `player_chat`, `player_connect`,
  `player_inputs`, `player_sound`, `rank_update`, `score_update`,
  `team_change` and `world_item_vector`. Two were removed: `item_remove` and
  `player_action`. Thirteen more came on 2026-10-15 and 2026-10-16: `convar`,
  `team_info`, `pause_state`, `smoke_voxel`, `world_object`, `hostage_vector`,
  `hostage_state`, `player_command`, `player_subtick_input`, `map_ping`,
  `player_round_stats`, `round_facts` and `vote`.
- **A match became one zip.** From 21:22 UTC on 2026-10-12 each match is
  delivered as one zip of its files instead of one object per file.
- **The files got smaller.** `player_vector` stopped storing its ten derived
  columns on 2026-10-06, and every channel has used tuned Parquet encodings
  since 2026-11-15.
- **Two columns went away.** `player_tick` and `player_player_id` were dropped
  from every channel that merged in player position. `tick` and `second` are no
  longer published on `player_info` or `player_personal`.
- **The tooling moved.** The tutorial needs Python 3.14 and [uv], not Python 3.9
  and Poetry.
- **Revisions are kept for one to two years.** Those more than about a year old
  are revoked and emptied in a batch about once a year, most recently in July 2026. The archived pages say old data is deleted "at our discretion", which
  understates how regular the pruning now is.

[revision stats]: /datascience/adx/cs2/csds/revision-stats
[changelog]: /datascience/adx/cs2/csds/changelog
[uv]: https://docs.astral.sh/uv/
