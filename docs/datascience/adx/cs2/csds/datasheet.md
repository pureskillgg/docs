---
sidebar_label: Datasheet
sidebar_position: 6
description: The data set described in the Datasheets for Datasets format, from why it exists to how it is maintained.
---

# Datasheet

_Based on [Datasheets for Datasets]._ This page answers its questions for the
[Competitive CS2 Gameplay](./README.md) data set.

## Motivation

- **For what purpose was the dataset created?**
  For education and machine learning research.
  Gameplay data from video games provide a fun and relevant way to learn statistics, programming, and more. Though no specific machine learning problem is defined here,
  we provide [open source tooling][makenew-pyskill] to create baseline datasets
  that can include some target for supervised learning or an objective for unsupervised learning.
  Some example machine learning problems include:
  clustering how items are used, building win probability models,
  analyzing player movement patterns, decision making around economic purchases,
  and finding optimal pathing.

- **Who created the dataset and on behalf of which entity?**
  Ethan Batson, William Robert Freeman, and Evan Sosenko for FPS Critic, Inc.,
  which produces PureSkill.gg.

- **Who funded the creation of the dataset?**
  FPS Critic, Inc. who produces PureSkill.gg.

- **Any other comments?**
  If you would like to use the dataset for a different purpose,
  please reach out to [contact@pureskill.gg][email] or contact us on [Discord].

## Composition

- **What do the instances that comprise the dataset represent?**
  Parsed and processed individual matches of CS2.
  Warmup, knife and drawn rounds are removed, so round 1 is the first live
  round.

- **How many instances are there in total?**
  Each daily revision holds the matches processed that day. On 2026-10-09 the
  408 revisions that could still be exported held 37,881 matches.
  Most recent revisions hold 60 to 150 matches. A few hold far more: the day
  after a pipeline outage, or a day when many matches were uploaded at once
  (more than 1,100 on 2026-10-08 and on 2026-10-09).
  [Revision Stats](./revision-stats.md) counts every revision.
  A match processed since 2026-10-06 takes about 10 MB across its 43 objects,
  so a typical day is around 1 GB. Matches processed before 2026-10-05 take 30
  to 40 MB.

- **Does the dataset contain all possible instances or is it a sample of instances from a larger set?**
  It holds every match PureSkill.gg processed successfully; matches that failed
  to process are not published. Those matches come from PureSkill.gg users, a
  small fraction of the matches the wider community plays.
  Valve publishes concurrent player counts on the [Steam most played chart][cs2 chart].

- **What data does each instance consist of?**
  CS2 demo files are [parsed][demoinfocs-golang] and saved as 42 separate channels.
  The collection of these channels for a match is called csds.
  Our open source libraries [dsdk] and [csgo-dsdk] read and work with the csds
  data.

- **Is there a label or target associated with each instance?**
  No, however we provide an open source tool called [makenew-pyskill]
  to easily create a view of these matches with a target for machine learning prediction in mind.

- **Is any information missing from individual instances?**
  We are always improving our processing pipeline,
  and some matches may have been processed using older versions of certain programs.
  Notably, older matches from the FACEIT platform are missing information about player ranks.

  The channel set also changed during the retained window. Revisions through
  2026-08-02 carry 30 channels rather than 42, and the 2026-08-03 revision holds
  a mix. Fourteen channels were added: `bullet_damage`, `grenade_bounce`,
  `grenade_vector`, `item_dropped`, `item_refund`, `molotov_fire`,
  `player_chat`, `player_connect`, `player_inputs`, `player_sound`,
  `rank_update`, `score_update`, `team_change` and `world_item_vector`.
  Two were removed: `item_remove` and `player_action`.
  Read each match's `csds` index object rather than assuming a fixed channel
  list.

  Some channels are empty in some matches:

  - Servers that restrict what their recording broadcasts, as tournament
    servers do, leave `player_blind`, `player_footstep`, `item_equip` and
    `weapon_action` empty; the rest of the match is complete.
  - `player_inputs` is empty on servers that don't send button states.
  - `player_vector` and `player_status` have rows only for living players.

  Since 2026-10-06, `player_vector` no longer stores its ten derived columns;
  they are computed on load, as the [spec](./spec.md) describes.

- **Are relationships between individual instances made explicit?**
  Since we have anonymized player data,
  it is not possible to tell if a player in one match is the same as a player in a different match.
  However, since all the data were uploaded by PureSkill.gg users, an individual may appear in many matches. It is not possible to tell who the PureSkill.gg user is with the data provided.

- **Are there recommended data splits?**
  No, however we provide an open source tool called [makenew-pyskill]
  to easily create a view of these matches with a target for machine learning prediction.
  One can split the data however appropriate for the task at hand.

- **Are there any errors, sources of noise, or redundancies in the dataset?**
  There may be duplicate matches. A match's `id` is created each time a demo
  is processed, so a demo processed twice, for example one uploaded by two
  users, appears twice with different ids. Find duplicates by comparing
  `header` columns such as `map_name`, `server_name`, `build_num` and the
  final scores (`t_starters_score_final`, `ct_starters_score_final`).

  A match uploaded by hand has `platform` `unknown`, and its `match_date` is
  when it was processed, not when it was played. Since 2026-10-08 that
  includes many FACEIT matches; their `server_name` begins `FACEIT.com`.

  Within matches, there may be missing events. These are generally rare and
  non-disruptive, but could interfere with some calculations.
  Any problematic matches can be skipped for most use cases.
  Values the pipeline got wrong and later fixed are listed, with the date of
  each fix, in the [changelog](./changelog.md).

- **Is the dataset self-contained, or does it link to or otherwise rely on external resources?**
  Within the dataset, we do not link to external resources.
  Item codes such as `weapon_code` are Valve's item definition indexes.
  Radar images, and the origin and scale that place match coordinates on them,
  are not part of the data set; [datascience-showcase] includes them for 14
  maps. [Positions and View Angles](./coordinates.md) explains the coordinates.

- **Does the dataset contain data that might be considered confidential?**
  No.

- **Does the dataset contain data that, if viewed directly, might be offensive, insulting, threatening, or might otherwise cause anxiety?**
  Yes, but keep in mind this is all video game data.
  Out of an abundance of caution, we list these elements of the dataset that may be inappropriate for younger audiences below.
  CS2 has a rating by the [ESRB] of [Mature][esrb ratings] for Blood and Intense Violence.
  CS2 is basically a SWAT team simulator.
  The game includes realistic weapons, bombs, hostages, terrorists, killing, death, and grenades.
  Player names and chat messages are overwritten before publication rather than
  dropped, so the channels carrying them are present and their rows are intact.
  `player_name.name_new`, `player_name.name_old`, `player_personal.name`,
  `player_personal.clan_tag` and `player_chat.text` each hold the literal string
  `redacted` in every row. `player_chat` therefore tells you that somebody typed
  in a given round, and nothing about what they typed.
  There is no voice chat data anywhere in the dataset.

- **Does the dataset relate to people?**
  Yes, since most of the data was generated by people.
  Some data is generated from bots, but that is rare,
  and bot status is known from the `player_personal` channel.
  Names, Steam IDs, chat and the other values listed on
  [PII Removal](./pii-removal.md) are removed or replaced before publication,
  using [open source tooling][pii_remover].

- **Does the dataset identify any subpopulations?**
  Not directly.
  However, for CS2 demos from Valve Matchmaking, the server location
  is in `header.server_name`, and one may infer player region (such as US West, South America, or India).

- **Does the dataset contain data that might be considered sensitive in any way?**
  No.

## Collection Process

- **How was the data associated with each instance acquired?**
  Demos come from users of PureSkill.gg.
  For users who connect their Steam or FACEIT accounts, we fetch demos
  automatically. Users can also upload demos by hand, including from community
  and league servers.
  The `header` channel records where a match was played in `platform`
  (`steam`, `faceit` or `unknown`) and, where present, how it arrived in
  `providence` (`auto`, `user` or `adhoc`, which is a manual upload).
  A manual upload has `platform` `unknown`, and since we don't know when it was
  played, its `match_date` is when it was processed.
  From the [Steam help page on API connections] (requires login):

  > You can create game authentication codes to allow third-party websites and applications to manage your game without running the actual game client. Third-party websites and applications can use this authentication code to access your match history, your overall performance in those matches, download replays of your matches, and analyze your gameplay.

- **What mechanisms or procedures were used to collect the data ?**
  The CS2 server records a stream of events from every player and game element into a demo.
  We then collect the demo file through the APIs described above or through manual upload.

- **If the dataset is a sample from a larger set, what was the sampling strategy?**
  It is every match we processed successfully. Matches come from PureSkill.gg
  users who connect their accounts or upload demos, and ingestion limits
  apply, so it is not guaranteed to be an unbiased sample of CS2 matches.
  This is mitigated by the fact that generally the 9 other players
  in a 10 player match are not PureSkill.gg users.

- **Who was involved in the data collection process and how were they compensated?**
  The data was collected through users of the website PureSkill.gg.
  Cloud processing costs were paid by FPS Critic, Inc. who produces PureSkill.gg.

- **Over what timeframe was the data collected?**
  Collection began 2021-12-01 and continues daily.
  Old revisions are revoked and emptied in a batch about once a year, most
  recently in July 2026, so the data you can export reaches back a little over
  a year: on 2026-10-09 the oldest exportable revision was from 2025-07-19.

- **Were any ethical review processes conducted?**
  No.

- **Did you collect the data from the individuals in question directly, or obtain it via third parties or other sources?**
  PureSkill.gg users must create an account on PureSkill.gg and connect to Steam or FACEIT APIs
  from which we download the CS2 demo files.
  The user must either login to FACEIT or provide a unique, non-public key to connect to Steam.
  Both connections can be revoked at any time.

- **Were the individuals in question notified about the data collection?**
  We must collect a user's CS2 demo files to provide our services,
  and they agree to this in the PureSkill.gg [Terms of Service].
  There is data for players that did not agree to our terms of service.
  Since names, Steam IDs and the other values listed on [PII Removal](./pii-removal.md)
  are removed or replaced before publication, we include these players' data.

- **Did the individuals in question consent to the collection and use of their data?**
  PureSkill.gg Users agreed to the [Terms of Service] and linked their Steam or FACEIT accounts
  which gives us access to their CS2 demo files.
  However, people who happen to be playing on the same server did not.
  Since names, Steam IDs and the other values listed on [PII Removal](./pii-removal.md)
  are removed or replaced before publication, we include these players' data.

- **If consent was obtained, were the consenting individuals provided with a mechanism to revoke their consent in the future or for certain uses?**
  PureSkill.gg users can disconnect their connections between PureSkill.gg and FACEIT or Steam.
  PureSkill.gg complies with GDPR as outlined in our [Privacy Policy] which supports entire account deletion.

- **Has an analysis of the potential impact of the dataset and its use on data subjects been conducted?**
  We have gone to great lengths to remove what could identify a person: the
  values listed on [PII Removal](./pii-removal.md) are removed or replaced
  before publication.
  Any attempts to identify people, players' Steam IDs, or online identities
  are not permitted.

## Preprocessing, Cleaning, and Labeling

- **Was any preprocessing/cleaning/labeling of the data done?**
  Raw CS2 demo files are event streams.
  Our [parser][demoinfocs-golang] turns a demo into what we call a replay, and a
  converter builds the channels from it. The converter removes warmup, knife
  and drawn rounds, drops duplicate rows, merges each event's player positions
  in from `player_vector`, computes derived columns, and fixes known errors.
  The [changelog](./changelog.md) lists every change to these steps.

- **Was the "raw" data saved in addition to the preprocessed/cleaned/labeled data?**
  Demo files are kept for 30 days and parsed replays for 7, then deleted.
  After that a match can't be processed again, so an improvement to the
  pipeline reaches newly processed matches only.

- **Is the software used to preprocess/clean/label the instances available?**
  The scrubber that removes personal information is open source, in
  [csgo-dsdk][pii_remover]. The parser and converter are not public.

## Uses

- **Has the dataset been used for any tasks already?**
  A similar dataset was used to develop machine learning models and other assessments
  for the main service provided by PureSkill.gg, which is automated coaching.
  An older, unavailable version of these data were used in
  _[Analyzing the Differences between Professional and Amateur Esports through Win Probability]_ by authors Peter Xenopoulos, William Robert Freeman, and Claudio Silva.

- **Is there a repository that links to any or all papers or systems that use the dataset?**
  Not at present, but we may add this later.

- **What other tasks could the dataset be used for?**
  Aside from education and machine learning research,
  this could be used to analyze the game itself,
  including player tendencies and how they shift over time.

- **Is there anything about the composition of the dataset or the way it was collected and preprocessed/cleaned/labeled that might impact future uses?**
  Yes. The data changes over time: channels and columns are added and removed,
  types change, and values are fixed, as the [changelog](./changelog.md) lists.
  A revision can hold matches from both sides of a change, and old revisions
  are pruned. Read each match's `csds` index object and `header.ppp_version`
  rather than assuming one schema.

- **Are there tasks for which the dataset should not be used?**
  It should not be used in any manner that is against the DSA, including but not limited to commercial use and releasing transformed data without attribution.
  Subscribers should not attempt to identify any player's Steam ID or online identities,
  or to download the source demo file.

## Distribution

- **Will the dataset be distributed to third parties outside of the entity on behalf of which the dataset was created?**
  The dataset was created using AWS tooling and it will remain there for distribution.

- **How will the dataset be distributed?**
  The data will be distributed on the ADX.
  The license permits sharing modified versions of the dataset under a specific license.
  See the DSA for details.

- **When will the dataset be distributed?**
  It has been distributed since 2022-05-17, with a one month automatically
  renewing subscription and a new revision published every day.
  Revisions carried CS:GO data until Counter-Strike 2 replaced the game in 2023;
  every revision still retained carries CS2 data.

- **Will the dataset be distributed under a copyright or other intellectual property license, and/or under applicable terms of use?**
  Yes, under the DSA, which has similar terms to the
  [Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) license][cc by-nc-sa 4.0].
  Note that the DSA is the license, not the Creative Commons website or their generic version of the license.

- **Have any third parties imposed IP-based or other restrictions on the data associated with the instances?**
  No.

- **Do any export controls or other regulatory restrictions apply to the dataset or to individual
  instances?**
  No.

## Maintenance

- **Who will be supporting/hosting/maintaining the dataset?**
  FPS Critic, Inc. who produces PureSkill.gg.

- **How can the owner/curator/manager of the dataset be contacted (e.g., email address)?**
  Email [contact@pureskill.gg][email] or reach out on [Discord].

- **Is there an erratum?**
  Fixes to the data are listed, with the date each reached production, in the
  [changelog](./changelog.md).

- **Will the dataset be updated?**
  The dataset will be updated every day with new data.

- **If the dataset relates to people, are there applicable limits on the retention of the data
  associated with the instances?**
  Yes. Revisions are revoked and emptied about a year after they are
  published; the next answer has the details.

- **Will older versions of the dataset continue to be supported/hosted/maintained?**
  Revisions are kept for about a year, then revoked and emptied in a batch
  about once a year, most recently in July 2026. On 2026-10-09 the 408
  exportable revisions covered 2025-07-19 onward. Download what you need
  rather than assuming a revision will still be there later.
  Pruned revisions are archived for our own records. If you have a good reason
  to need one back, [contact us][email] and we may be able to restore it.

- **If others want to extend/augment/build on/contribute to the dataset, is there a mechanism for them to do so?**
  Please email [contact@pureskill.gg][email] or reach out on [Discord]
  if you want to extend the provided csds files in any manner.
  Subscribers are free to release transformations with restrictions as outlined in the DSA.

[cc by-nc-sa 4.0]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[discord]: https://pureskill.gg/discord
[email]: mailto:contact@pureskill.gg
[datasheets for datasets]: https://arxiv.org/abs/1803.09010
[makenew-pyskill]: https://github.com/pureskillgg/makenew-pyskill
[dsdk]: https://github.com/pureskillgg/dsdk
[csgo-dsdk]: https://github.com/pureskillgg/csgo-dsdk
[datascience-showcase]: https://github.com/pureskillgg/datascience-showcase
[cs2 chart]: https://store.steampowered.com/charts/mostplayed
[demoinfocs-golang]: https://github.com/markus-wa/demoinfocs-golang
[esrb]: https://www.esrb.org
[esrb ratings]: https://www.esrb.org/ratings-guide/
[pii_remover]: https://github.com/pureskillgg/csgo-dsdk/blob/master/pureskillgg_csgo_dsdk/scrubber/scrub_pii.py
[steam help page on api connections]: https://help.steampowered.com/en/wizard/HelpWithGameIssue/?appid=730&issueid=128
[terms of service]: https://pureskill.gg/site-terms/
[privacy policy]: https://pureskill.gg/privacy-policy/
[analyzing the differences between professional and amateur esports through win probability]: https://dl.acm.org/doi/abs/10.1145/3485447.3512277
