# PureSkill.gg Competitive CS2 Gameplay

_This data set is hosted as a [product on the AWS Data Exchange][product page]._

Competitive Counter-Strike 2 (CS2)
match data from matchmaking, FACEIT, and other third-parties.
Contains full player telemetry and timestamped game events.
These data are extracted from CS2 replay files called demos.
Each match is published as 43 objects, collectively called csds:
42 channel files plus a JSON index object, also named `csds`, that lists them.
The [CSDS Spec](./spec.md) documents every channel and column.
New here? The [Quickstart](./quickstart.md) goes from subscribing to a first
query, and [Getting the Data](./getting-the-data.md) explains how the data is
delivered.

Revisions through 2026-08-02 carry 31 objects per match instead of 43, and the
2026-08-03 revision holds a mix of both. The
[archived spec](/datascience/old/cs2/csds/spec) describes the older set.

Please visit **[docs.pureskill.gg/datascience][datascience docs]**
for full introduction to PureSkill.gg data science,
additional documentation, and a copy of this document.

## License (CC BY-NC-SA 4.0)

The data is licensed under [CC BY-NC-SA 4.0][cc by-nc-sa 4.0]:
you may not use it for commercial purposes, you must attribute PureSkill.gg,
and you must share any derived work under the same license.

Subscribing on AWS Data Exchange also means accepting the Data Subscriber Agreement (DSA),
which is on the [Product Page] under the Usage section.

## Attribution

As the license requires, if you publish a visualization,
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

PureSkill.gg provides AI-powered coaching for CS2 players of all ranks
to hone their skills, rank up, and dominate the game.

- [Website]
- [Discord]
- [YouTube]
- [LinkedIn]
- [Twitter]
- [Facebook]
- [Instagram]

## Data Dictionary

A [Data Dictionary](./assets/csds_dictionary.csv) is available.
This is a standardized CSV file that catalogues all tables and columns in the data set.

## Glossary

- [AWS] - Amazon Web Services.
- [ADX] - AWS Data Exchange.
- DSA - Data Subscriber Agreement.
  Find this in your AWS account under the ADX subscription to this data set.
- PII - Personally Identifiable Information.
- channel - One of the 42 data files that combine to make a csds object.
- csds - The name given to the collection of files extracted from a CS2 demo,
  and also the name of the JSON index object that lists them.
- demo - The name given to the server-recorded stream of event data from a match of CS2.
  Sometimes ends in the .dem file extension.
- [CS2] - Counter-Strike 2.
  The game created by Valve that is played to generate this dataset.
- [Valve] - The company that makes CS2.
- [Steam] - The platform created by Valve that CS2 players use to play the game online.
- [FACEIT] - A third-party platform used to play CS2 online.

## Datasheet

The [Datasheet](./datasheet.md) answers the questions of
[Datasheets for Datasets] for this data set: why it exists, what it holds, how it
was collected and processed, and how it is maintained.

[cc by-nc-sa 4.0]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[product page]: https://aws.amazon.com/marketplace/pp/prodview-v3o7zrt6okwmo
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
[cs2]: https://store.steampowered.com/app/730/
[faceit]: https://www.faceit.com/
[steam]: https://steamcommunity.com/
[valve]: https://www.valvesoftware.com/
[datascience docs]: https://docs.pureskill.gg/datascience
