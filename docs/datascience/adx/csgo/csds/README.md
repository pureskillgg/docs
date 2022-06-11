# PureSkill.gg Competitive CS:GO Gameplay

_This data set is hosted as a [product on the AWS Data Exchange][product page]._

Competitive Counter-Strike: Global Offensive (CS:GO)
match data from matchmaking, FACEIT, and other third-parties.
Contains full player telemetry and timestamped game events.
These data are extracted from CS:GO replay files called demos.
Data for each match is split across 33 files, collectively called csds.

Please visit **[docs.pureskill.gg/datascience][datascience docs]**
for full introduction to PureSkill.gg data science,
additional documentation, and a copy of this document.

## License (CC BY-NC-SA 4.0)

Please read through the Data Subscriber Agreement (DSA).
The DSA is available on the [Product Page] under the Usage section.

The key requirements of DSA state you may not use the data for commercial purposes,
you must attribute PureSkill.gg, and you must use the same license for any derived work.
A ["human-readable" summary of the license][cc by-nc-sa 4.0] is provided by Creative Commons,
but this is not a substitute for the DSA.

## Attribution

As outlined in the DSA, if you publish a visualization,
video, text summary, or other transformed version of the data, you must provide attribution.
We ask that the shared media contain the text "Data provided by PureSkill.gg."
with that exact capitalization.

Please let us know if you publish content derived from the data set
by sending an email to [contact@pureskill.gg][email]
or by contacting us on our [Discord].

## Pricing Information

The dataset is provided free of charge.

Downloading the data set will incur standard AWS usage fees.
FPS Critic Inc., owner of PureSkill.gg, is not liable for any AWS costs you incur.

## Gaining Access

We want to understand your amazing project and help you get up and running with the data set.
When you [subscribe to this data product][product page], we will need to approve your subscription request.
Please outline your use case in the request and allow a few days for review.
We may send a follow up email before confirming your request.

Once approved, you can access the developer channels on [Discord], just let us know your Discord username.

## Need Help?

If you have questions, email us at contact@pureskill.gg
or reach out on [Discord].

## About PureSkill.gg

PureSkill.gg provides AI-powered coaching for CS:GO players of all ranks
to hone their skills, rank up, and dominate the game.

- [Website]
- [Discord]
- [YouTube]
- [LinkedIn]
- [Twitter]
- [Facebook]
- [Instagram]

## Datasheet

_Based on [Datasheets for Datasets]._

### Data Dictionary

A [Data Dictionary](./assets/csds_dictionary.csv) is available.
This is a standardized CSV file that catalogues all tables and columns in the data set.

### Glossary

- [AWS] - Amazon Web Services.
- [ADX] - AWS Data Exchange.
- DSA - Data Subscriber Agreement.
  Find this in your AWS account under the ADX subscription to this data set.
- PII - Personally Identifiable Information.
- channel - One of the 33 files that combine to make a csds object.
- csds - The name given to the collection of 33 files extracted from a CS:GO demo.
- demo - The name given to the server-recorded stream of event data from a match of CS:GO.
  Sometimes ends in the .dem file extension.
- [CS:GO] - Counter-Strike: Global Offensive.
  The game created by Valve that is played to generate this dataset.
- [Valve] - The company that makes CS:GO.
- [Steam] - The platform created by Valve that CS:GO players use to play the game online.
- [FACEIT] - A third-party platform used to play CS:GO online.

### Motivation

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

### Composition

- **What do the instances that comprise the dataset represent?**
  Parsed and processed individual matches of CS:GO.

- **How many instances are there in total?**
  Approximately 60,000 matches of CS:GO with ~250 added each day.

- **Does the dataset contain all possible instances or is it a sample of instances from a larger set?**
  It is a complete picture of all CS:GO demos available to PureSkill.gg.
  There are [500,000 people playing CS:GO at any point in a day][cs:go chart],
  and assuming a match takes 1 hour and 10 players,
  there are 1.2 million matches played every day.
  The dataset here is a subset of those matches played by the larger CS:GO community.

- **What data does each instance consist of?**
  CS:GO demo files are [parsed][demoinfocs-golang] and saved as 33 separate channels.
  The collection of these channels for a match is called csds.
  We provide an [open source SDK][makenew-pyskill] to work with the csds data.

- **Is there a label or target associated with each instance?**
  No, however we provide an open source tool called [makenew-pyskill]
  to easily create a view of these matches with a target for machine learning prediction in mind.

- **Is any information missing from individual instances?**
  We are always improving our processing pipeline,
  and some matches may have been processed using older versions of certain programs.
  Notably, older matches from the FACEIT platform are missing information about player ranks.

- **Are relationships between individual instances made explicit?**
  Since we have anonymized player data,
  it is not possible to tell if a player in one match is the same as a player in a different match.
  However, since all the data were uploaded by PureSkill.gg users, an individual may appear in many matches. It is not possible to tell who the PureSkill.gg user is with the data provided.

- **Are there recommended data splits?**
  No, however we provide an open source tool called [makenew-pyskill]
  to easily create a view of these matches with a target for machine learning prediction.
  One can split the data however appropriate for the task at hand.

- **Are there any errors, sources of noise, or redundancies in the dataset?**
  There may be duplicate matches in the dataset.
  These can be deduplicated by comparing calculated values from the header channel.
  Within matches, there may be missing ticks and missing events.
  These are generally rare and non-disruptive, but could interfere with some calculations.
  Any problematic matches can be skipped for most use cases.

- **Is the dataset self-contained, or does it link to or otherwise rely on external resources?**
  Within the dataset, we do not link to external resources.
  However, properties of game items, map backgrounds for visualizations, and much more are available online. At present, we do not maintain a current or historical version of such files.

- **Does the dataset contain data that might be considered confidential?**
  No.

- **Does the dataset contain data that, if viewed directly, might be offensive, insulting, threatening, or might otherwise cause anxiety?**
  Yes, but keep in mind this is all video game data.
  Out of an abundance of caution, we list these elements of the dataset that may be inappropriate for younger audiences below.
  CS:GO has a rating by the [ESRB] of [Mature][esrb ratings] for [Blood and Intense Violence][esrb cs:go].
  CS:GO is basically a SWAT team simulator.
  The game includes realistic weapons, bombs, hostages, terrorists, killing, death, and grenades.
  There are no player names, text chat, or voice chat data in the dataset.
  It is possible to draw offensive pictures by shooting a wall and if visualized,
  this may be considered offensive.

- **Does the dataset relate to people?**
  Yes, since most of the data was generated by people.
  Some data is generated from bots, but that is rare,
  and bot status is known from the `player_personal` channel.
  Note that this and other channels do not contain any personal information,
  which has been removed using [open source tooling][pii_remover].

- **Does the dataset identify any subpopulations?**
  Not directly.
  However, for CS:GO demos from Valve Matchmaking, the server location
  is in the name, and one may infer player region (such as US West, South America, or India).

- **Does the dataset contain data that might be considered sensitive in any way?**
  No.

### Collection Process

- **How was the data associated with each instance acquired?**
  Demos were provided by users of PureSkill.gg.
  We automatically acquire demos from Steam and FACEIT.
  Automatic demo acquisition requires a user to connect their account to PureSkill.gg.
  Some users may manually upload demos into the system.
  For manually uploaded demos, we do not know the actual date they were played,
  so the match_played date is actually the uploaded date.
  The acquisition method is saved under providence (as user or auto)
  and the server provider is saved under platform (steam, faceit, or unknown).
  Both of these are in the header channel.
  From the [Steam help page on API connections] (requires login):

  > You can create game authentication codes to allow third-party websites and applications to manage your game without running the actual game client. Third-party websites and applications can use this authentication code to access your match history, your overall performance in those matches, download replays of your matches, and analyze your gameplay.

- **What mechanisms or procedures were used to collect the data ?**
  The CS:GO server records a stream of events from every player and game element into a demo.
  We then collect the demo file through the APIs described above or through manual upload.

- **If the dataset is a sample from a larger set, what was the sampling strategy?**
  It is a full sample of data from PureSkill.gg, except for any demos with errors.
  This is a subset of the many, many CS:GO matches played every day.
  It is not guaranteed that this dataset is unbiased because all of the demos come from PureSkill.gg users.
  This is mitigated by the fact that generally the 9 other players
  in a 10 player match are not PureSkill.gg users.
  There are thousands of PureSkill.gg users with valid API connections (required to upload data).

- **Who was involved in the data collection process and how were they compensated?**
  The data was collected through users of the website PureSkill.gg.
  Cloud processing costs were paid by FPS Critic, Inc. who produces PureSkill.gg.

- **Over what timeframe was the data collected?**
  2021-12-01 to present.

- **Were any ethical review processes conducted?**
  No.

- **Did you collect the data from the individuals in question directly, or obtain it via third parties or other sources?**
  PureSkill.gg users must create an account on PureSkill.gg and connect to Steam or FACEIT APIs
  from which we download the CS:GO demo files.
  The user must either login to FACEIT or provide a unique, non-public key to connect to Steam.
  Both connections can be revoked at any time.

- **Were the individuals in question notified about the data collection?**
  We must collect a user's CS:GO demo files to provide our services,
  and they agree to this in the PureSkill.gg [Terms of Service].
  There is data for players that did not agree to our terms of service.
  Since the processed data we are providing here do not contain anything identifiable
  or that can otherwise be linked back to their Steam account, we include these player's data.

- **Did the individuals in question consent to the collection and use of their data?**
  PureSkill.gg Users agreed to the [Terms of Service] and linked their Steam or FACEIT accounts
  which gives us access to their CS:GO demo files.
  However, people who happen to be playing on the same server did not.
  Since the processed data we are providing here do not contain anything identifiable
  or that can otherwise be linked back to their Steam account, we include these player's data.

- **If consent was obtained, were the consenting individuals provided with a mechanism to revoke their consent in the future or for certain uses?**
  PureSkill.gg users can disconnect their connections between PureSkill.gg and FACEIT or Steam.
  PureSkill.gg complies with GDPR as outlined in our [Privacy Policy] which supports entire account deletion.

- **Has an analysis of the potential impact of the dataset and its use on data subjects been conducted?**
  We have gone through great lengths to prevent any way to identify a person in the dataset.
  It should be impossible.
  Any attempts to identify people, players' Steam IDs, or online identities
  are not permitted.
  Therefore it will not impact the data subjects.

### Preprocessing, Cleaning, and Labeling

- **Was any preprocessing/cleaning/labeling of the data done?**
  Raw CS:GO demo files are event streams.
  The events and tables can be accessed with a [parser][demoinfocs-golang].
  The CS:GO demo files are first processed by our parser,
  and the output of the parser is what we call a replay.
  The replay is transformed by a Post Parser Processor (PPP)
  where we engineer new columns, clean up extraneous round data, and fix certain values.

- **Was the "raw" data saved in addition to the preprocessed/cleaned/labeled data?**
  CS:GO demo files are deleted quickly after they are processed.
  If we need to add new features based on demos,
  we can update the pipeline and new data will contain the new information.
  Since new matches are streaming in automatically each day,
  it will be sufficient to update that step to create a new dataset with the improved feature.

- **Is the software used to preprocess/clean/label the instances available?**
  Not at present, but we may release this in the future.

### Uses

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
  No.

- **Are there tasks for which the dataset should not be used?**
  It should not be used in any manner that is against the DSA, including but not limited to commercial use and releasing transformed data without attribution.
  Subscribers should not attempt to identify any player's Steam ID or online identities,
  or to download the source demo file.

### Distribution

- **Will the dataset be distributed to third parties outside of the entity on behalf of which the dataset was created?**
  The dataset was created using AWS tooling and it will remain there for distribution.

- **How will the dataset be distributed?**
  The data will be distributed on the ADX.
  The license permits sharing modified versions of the dataset under a specific license.
  See the DSA for details.

- **When will the dataset be distributed?**
  Starting on 2022-05-17 with a one month automatically renewing subscription.

- **Will the dataset be distributed under a copyright or other intellectual property license, and/or under applicable terms of use?**
  Yes, under the DSA, which has similar terms to the
  [Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) license][cc by-nc-sa 4.0].
  Note that the DSA is the license, not the Creative Commons website or their generic version of the license.

- **Have any third parties imposed IP-based or other restrictions on the data associated with the instances?**
  We removed all PII or traces back to any Steam ID or online identities.
  Steam is the platform used to play CS:GO, and while a game account may be anonymous,
  we have taken great care to remove any possibility of scraping valid Steam IDs or online identifiers
  from the data or the ability to download the CS:GO demo file.

- **Do any export controls or other regulatory restrictions apply to the dataset or to individual
  instances?**
  No.

### Maintenance

- **Who will be supporting/hosting/maintaining the dataset?**
  FPS Critic, Inc. who produces PureSkill.gg.

- **How can the owner/curator/manager of the dataset be contacted (e.g., email address)?**
  Email [contact@pureskill.gg][email] or reach out on [Discord].

- **Is there an erratum?**
  Not yet.

- **Will the dataset be updated?**
  The dataset will be updated every day with new data.

- **If the dataset relates to people, are there applicable limits on the retention of the data
  associated with the instances?**
  No

- **Will older versions of the dataset continue to be supported/hosted/maintained?**
  We may delete old, unusable data at our discretion.
  Additionally, we may delete old data to reduce cost.

- **If others want to extend/augment/build on/contribute to the dataset, is there a mechanism for them to do so?**
  Please email [contact@pureskill.gg][email] or reach out on [Discord]
  if you want to extend the provided csds files in any manner.
  Subscribers are free to release transformations with restrictions as outlined in the DSA.

[cc by-nc-sa 4.0]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[product page]: https://us-east-1.console.aws.amazon.com/dataexchange/home?region=us-east-1#/products/prodview-v3o7zrt6okwmo
[discord]: https://pureskill.gg/discord
[website]: https://pureskill.gg/
[youtube]: https://www.youtube.com/channel/UCmgWqRfvuX94XwbuN9CEu_A
[linkedin]: https://www.linkedin.com/company/itspureskillgg
[twitter]: https://twitter.com/itspureskillgg
[facebook]: https://www.facebook.com/itspureskillgg
[instagram]: https://www.instagram.com/itspureskillgg
[email]: mailto:contact@pureskill.gg
[datasheets for datasets]: https://arxiv.org/abs/1803.09010
[aws]: https://aws.amazon.com/
[adx]: https://aws.amazon.com/data-exchange
[cs:go]: https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/
[faceit]: https://www.faceit.com/
[steam]: https://steamcommunity.com/
[valve]: https://www.valvesoftware.com/
[makenew-pyskill]: https://github.com/pureskillgg/makenew-pyskill
[cs:go chart]: https://steamcharts.com/app/730
[demoinfocs-golang]: https://github.com/markus-wa/demoinfocs-golang
[esrb]: https://www.esrb.org
[esrb ratings]: https://www.esrb.org/ratings-guide/
[esrb cs:go]: https://www.esrb.org/ratings/100491/Counter-Strike%3A+Global+Offensive
[pii_remover]: https://github.com/pureskillgg/csgo-dsdk/blob/master/pureskillgg_csgo_dsdk/scrubber/scrub_pii.py
[steam help page on api connections]: https://help.steampowered.com/en/wizard/HelpWithGameIssue/?appid=730&issueid=128
[terms of service]: https://pureskill.gg/site-terms/
[privacy policy]: https://pureskill.gg/privacy-policy/
[analyzing the differences between professional and amateur esports through win probability]: https://dl.acm.org/doi/abs/10.1145/3485447.3512277
[datascience docs]: https://docs.pureskill.gg/datascience
