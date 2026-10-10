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
  we provide [open source tooling][pureskillgg github] to create baseline datasets
  that can include some target for supervised learning or an objective for unsupervised learning.
  Some example machine learning problems include:
  clustering how items are used, building win probability models,
  analyzing player movement patterns, decision making around economic purchases,
  and finding optimal pathing.

- **Who created the dataset and on behalf of which entity?**
  The [PureSkill.gg team][team], for FPS Critic, Inc., which produces
  PureSkill.gg.

- **Who funded the creation of the dataset?**
  FPS Critic, Inc. who produces PureSkill.gg.

- **Any other comments?**
  No.

## Composition

- **What do the instances that comprise the dataset represent?**
  Parsed and processed individual matches of CS2.
  Warmup, knife and drawn rounds are removed, so round 1 is the first live
  round. Personal information is removed as well as we can; see
  [PII Removal](./pii-removal.md).

- **How many instances are there in total?**
  Each daily revision holds the matches processed that day.
  [Revision Stats](./revision-stats.md) gives the matches, files and size of
  every revision.

- **Does the dataset contain all possible instances or is it a sample of instances from a larger set?**
  It holds every match PureSkill.gg processed successfully; matches that failed
  to process are not published. Those matches come from PureSkill.gg users, a
  small fraction of the matches the wider community plays.
  Valve publishes concurrent player counts on the [Steam most played chart][cs2 chart].

- **What data does each instance consist of?**
  We extract the data from CS2 demo files with our own processing, and save it
  as 42 separate channels.
  The collection of these channels for a match is called csds.
  Our open source libraries [dsdk] and [csgo-dsdk] read and work with the csds
  data.

- **Is there a label or target associated with each instance?**
  No. There are many possible machine learning projects with the data, and a
  target is whatever the user defines for theirs. We note that player rank is
  available and often useful, including for unsupervised tasks.

- **Is any information missing from individual instances?**
  Sometimes. We are always improving our processing pipeline, so older matches
  were processed by older versions of it, and some channels are empty in some
  matches. [Known Flaws](./known-flaws.md) lists what to watch for, and the
  [changelog](./changelog.md) lists every change to the data and when it
  reached production.

- **Are relationships between individual instances made explicit?**
  Not explicitly, but they exist: many matches come from the same player, or
  the same group of players queueing together.
  Player identities are replaced in each match, so telling whether a player
  in one match is the same as a player in another is very difficult. It is
  possible with player fingerprinting, as a
  [thesis on identifying Counter-Strike players by their mouse movement in demos][fingerprinting]
  shows. A link like that ties matches to the same unknown player; finding that
  player's actual profile or identity would still be hard, and trying is not
  permitted by the license agreement. Nothing in the data says which player is
  the PureSkill.gg user. See
  [Known Flaws](./known-flaws.md).

- **Are there recommended data splits?**
  Yes: we strongly recommend splitting by match. Rows from one match share
  players, rounds and moments, so a match with rows in both the training and
  the test data leaks information between them.

- **Are there any errors, sources of noise, or redundancies in the dataset?**
  There may be duplicate matches. A match's `id` is created each time a demo
  is processed, so a demo processed twice, for example one uploaded by two
  users, appears twice with different ids. Find duplicates by comparing the
  `header` entries that describe the match itself, not its processing.

  Within matches, there may be missing events. These are generally rare and
  non-disruptive, but could interfere with some calculations.
  Any problematic matches can be skipped for most use cases.
  [Known Flaws](./known-flaws.md) lists the others we know of. Values the
  pipeline got wrong and later fixed are listed, with the date of each fix, in
  the [changelog](./changelog.md).

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
  Not directly, but it almost certainly includes players under 18: Steam and
  PureSkill.gg allow players from 13 years old.

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
  A manually uploaded match may include no PureSkill.gg user at all: users
  often upload professional matches they are curious about.

  Valve built this access for third-party services like ours. Steam's own
  [help page on API connections][steam help page on api connections] (requires
  login) says:

  > You can create game authentication codes to allow third-party websites and applications to manage your game without running the actual game client. Third-party websites and applications can use this authentication code to access your match history, your overall performance in those matches, download replays of your matches, and analyze your gameplay.

- **What mechanisms or procedures were used to collect the data?**
  The CS2 server records a stream of events from every player and game element into a demo.
  We then collect the demo file through the APIs described above or through manual upload.
  We read the demo with the open source [demoinfocs-golang] library as a first
  step, then run our own processing steps on what it reads.

- **If the dataset is a sample from a larger set, what was the sampling strategy?**
  It is every match we processed successfully. Matches come from PureSkill.gg
  users who connect their accounts or upload demos, and ingestion limits
  apply, so it is not guaranteed to be an unbiased sample of CS2 matches.
  The bias is smaller than it sounds: a match usually has one PureSkill.gg
  user in it, and the other nine players are not users.

- **Who was involved in the data collection process and how were they compensated?**
  The data was collected through users of the website PureSkill.gg.
  Cloud processing costs were paid by FPS Critic, Inc. who produces PureSkill.gg.

- **Over what timeframe was the data collected?**
  Collection began 2021-12-01 and continues daily.
  Revisions more than about a year old are revoked and emptied in a batch about
  once a year, most recently in July 2026, so the data you can export reaches
  back between one and two years: on 2026-10-09 the oldest exportable revision
  was from 2025-07-19.

- **Were any ethical review processes conducted?**
  Yes. In October 2026 an AI agent reviewed the data set's ethics and FPS
  Critic, Inc. signed off on its findings. It was an internal review, not an
  institutional review board. See the [AI Ethics Review](./ethics-review.md).

- **Did you collect the data from the individuals in question directly, or obtain it via third parties or other sources?**
  PureSkill.gg users must create an account on PureSkill.gg and connect to Steam or FACEIT APIs
  from which we download the CS2 demo files.
  The user must either log in to FACEIT or provide a unique, non-public key to connect to Steam.
  Both connections can be revoked at any time.

- **Were the individuals in question notified about the data collection?**
  We must collect a user's CS2 demo files to provide our services, and our
  [Privacy Policy] says we analyze users' replay files. Neither it nor our
  [Terms of Service] mentions this data set yet; we are updating the Privacy
  Policy to name it.
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
  are not permitted by the license agreement.

## Preprocessing, Cleaning, and Labeling

- **Was any preprocessing/cleaning/labeling of the data done?**
  Raw CS2 demo files are event streams.
  The open source [demoinfocs-golang] library is the tool we read them with: it
  listens to a demo's events and hands each one on. Which events we listen
  to, and what we extract from each, is our own proprietary extraction, and it
  turns a demo into what we call a replay. A converter then builds the channels
  from the replay: it removes warmup, knife and drawn rounds, drops duplicate
  rows, merges each event's player positions in from `player_vector`, computes
  derived columns, and fixes known errors.
  The [changelog](./changelog.md) lists every change to these steps.

- **Was the "raw" data saved in addition to the preprocessed/cleaned/labeled data?**
  Demo files are kept for 30 days and parsed replays for 7, then deleted.
  After that a match can't be processed again, so an improvement to the
  pipeline reaches newly processed matches only.

- **Is the software used to preprocess/clean/label the instances available?**
  The scrubber that removes personal information is open source, in
  [csgo-dsdk][pii_remover]. Our extraction and processing code is proprietary.

## Uses

- **Has the dataset been used for any tasks already?**
  A similar dataset was used to develop machine learning models and other assessments
  for the main service provided by PureSkill.gg, which is automated coaching.
  An older, unavailable version of these data was used in
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
  It may not be used to develop, train or test cheats.

## Distribution

- **Will the dataset be distributed to third parties outside of the entity on behalf of which the dataset was created?**
  The dataset was created using AWS tooling and it will remain there for distribution.

- **How will the dataset be distributed?**
  The data will be distributed on the ADX.
  The license permits sharing modified versions of the dataset under a specific license.
  See the DSA for details.

- **When will the dataset be distributed?**
  It has been distributed since 2022-05-17, through a one-month subscription
  that renews automatically, with a new revision published every day.
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
  Yes. Revisions are revoked and emptied once they are more than about a year
  old. Pruning runs in a batch about once a year, so a revision stays
  exportable for one to two years; the next answer has the details.

- **Will older versions of the dataset continue to be supported/hosted/maintained?**
  Revisions are kept for at least about a year. Those older than that are
  revoked and emptied in a batch about once a year, most recently in July
  2026, so a revision can stay exportable for up to about two years. On
  2026-10-09 the 408
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
[pureskillgg github]: https://github.com/pureskillgg
[team]: https://pureskill.gg/our-team/
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
[fingerprinting]: https://digital.ub.uni-paderborn.de/hs/content/titleinfo/8205986/full.pdf
