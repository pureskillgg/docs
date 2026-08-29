# PureSkill.gg Data Science

## FAQ

### What data is available?

The [PureSkill.gg Competitive Gameplay Data Set] contains
Counter-Strike 2 (CS2) match data from matchmaking, FACEIT, and other
third-parties.
Contains full player telemetry and timestamped game events.
A new revision is published every day. In revisions from 2026-08-04 onward,
each match is 42 data files plus an index object; revisions still retained from
before then carry 30 data files per match. The
[data set page](./adx/cs2/csds/) covers the change.

The data set carried Counter-Strike: Global Offensive (CS:GO) data until CS2
replaced the game in 2023. Those revisions are no longer retained. The
[archive](./old/) keeps the pages that described them.

### How can I get started?

With [the tutorial][tutorial] you will learn how to do some real
CS2 data science with data from the public data set.
Once you complete the tutorial, you may use the same repository to bootstrap your own project!

### Why are you doing this?

We want to see the amazing stuff you'll do with it!
Working with AI researchers using Counter-Strike to solve really hard problems inspired us to
contribute back and open this up to anyone.

We hope this work can fuel everything from one's first data science experience, to their
next hackathon, school project, all the way to groundbreaking research.

### Who can use the data?

Anyone with a use case that adheres to the license.

The full license is presented and agreed to when you subscribe to the data set,
but it's basically the [CC BY-NC-SA 4.0] license, which means you
may not use the data for commercial purposes, you must attribute PureSkill.gg,
and you must use the same license for any derived work.

### Does it cost money?

The data set is released for free, however, the process
of exporting the data will incur standard AWS fees
for using the cloud provider's storage and bandwidth.

See the [Cost FAQ](#cost-faq) for details.

### How long is the data kept?

About a year. A revision is published each day and revoked roughly twelve
months later, so the data set holds a rolling window rather than a growing
archive. As of 2026-08-27 it holds 365 daily revisions covering 2025-07-18
onward.

If you need a particular stretch of time, export it rather than assuming it
will still be there. We do not keep a copy you can ask us to restore.

### Why do I need to subscribe?

The [AWS Data Exchange], which is the cloud platform hosting the data set,
requires users to subscribe for access to hosted data products.
On subscribing, you must agree to our version of the [CC BY-NC-SA 4.0] license.
The subscription to PureSkill.gg data is always free.

### Are you selling my data?

Absolutely not!
The data set is free and for the community.
We hope the data will be used for cool stuff,
and for future improvements to Coach!

### Does this mean everyone will know how n00b I am?

Nope! Not from here at least.
All player data is [thoroughly anonymized][anonymization]:
it is impossible to determine a player's identity, virtual or otherwise.

### Can I opt-out?

Currently we do not provide a way for users of PureSkill.gg to opt-out
of inclusion in the data set.
You may, however, ask for your account to be deleted,
which will stop inclusion of future matches.

Please note that even though your match data is
in the data set, it is **not traceable back to your player identity**.

### I have more questions?

That wasn't a question.
But it's ok, you can ask in the Dojo channel on [Discord].
We want to help you and get your feedback!

## Technical FAQ

### What are the developer tools?

- **[PySkill][makenew-pyskill]:**
  Project skeleton for doing PureSkill.gg data science with Python.
  It is also the tutorial.
- **[Data Science Developer Kit (DSDK)][dsdk]:**
  Python library for working with the data.
  Read csds, create tomes, access data from the ADX, and more.
- **[CS:GO Data Science Developer Kit (CSGO DSDK)][csgo-dsdk]:**
  Python library with tools specific to Counter-Strike data science.
  The name predates CS2; it is the right library for CS2 data.
- **[PureSkill.gg Data Science Showcase][datascience-showcase]:**
  Demonstrations and examples of neat applications of PureSkill.gg data.
- **[PureSkill.gg Docs][docs]:**
  This website.

### Are the developer tools stable?

Mostly.
We don't anticipate major changes before releasing version 1 of our libraries.
Please report any issues on GitHub.

Libraries follow the principles of [semver].
Beta releases may see breaking API changes before their final release, while release candidates
will avoid this unless absolutely necessary.

Python projects use the [PEP 440] standard version format
of `1.2.3` for stable releases, `1.2.3b0` for beta releases,
and `1.2.3rc0` for release candidates.
This is a small cosmetic difference, but otherwise, the semantic meaning will follow [semver].

### What do I need to use the developer tools?

The minimum [tutorial requirements] are [Python] and [uv].

### Which version of Python do I need?

The tutorial skeleton requires **Python 3.14 or newer**.
The libraries themselves, `dsdk` and `csgo-dsdk`, support 3.11 and newer, so you
can use them from an older project if you need to.

To install an isolated Python version, [uv] can do it for you with
`uv python install`. [pyenv] for Linux and Mac, or [pyenv-win] for Windows,
also work.

### Why do I need to use uv to install dependencies?

uv guarantees each project runs in an isolated environment with pinned dependencies.
This is the only way to ensure reproducible tests and builds.
Earlier versions of the tutorial used [Poetry]; the projects moved to uv and the
lock files are no longer compatible.

You can try to use an alternative Python package manager,
but we cannot offer support.

### Can I use my favorite editor or IDE?

Yes.
If your editor or IDE integrates with Python,
ensure you refer to its documentation for using it with Python virtual environments.

### Can I contribute?

Yes! Please use [Discord] or GitHub issues.
We will consider additional forums like GitHub Discussions
as the community grows.

To contribute code or documentation,
please open a corresponding issue first before opening a pull request.
When contributing obvious fixes, you may open a pull request directly.

### Can I use $favorite_language?

Yes! The current provided tooling is in Python, but all of the underlying
data is stored as [Apache Parquet] with additional metadata in [JSON].

> Apache Parquet is an open source, column-oriented data file format designed for efficient data storage and retrieval.
> It provides efficient data compression and encoding schemes with enhanced performance to handle complex data in bulk.
> Parquet is available in multiple languages including Java, C++, Python, etc...

If you want to use another language, we still recommend starting with the [tutorial].
This is the easiest way to download the data and create new tomes, which are just more Parquet and JSON files.
Tomes are economical views of the data tailored for specific analyses, and you
build them yourself from data you have exported.

## Cost FAQ

### How much will AWS charge me?

_FPS Critic Inc., owner of PureSkill.gg, is not liable for any AWS costs you incur._

[Step 7 of the tutorial] can help you estimate your costs.
We provide the measurements below for convenience,
but we do not guarantee their accuracy or applicability to your AWS account.

Measured on the production data set on 2026-08-27:

| What                      | How big                                                      |
| ------------------------- | ------------------------------------------------------------ |
| One match                 | about 35 MB across 43 objects                                |
| One recent daily revision | 90 to 150 matches, roughly 3 to 5 GB, 4,000 to 6,500 objects |
| The whole retained window | 365 daily revisions                                          |

Exporting from the AWS Data Exchange writes those objects into an S3 bucket you
own, so you pay per object written and then for storing them. Pulling them out
of AWS afterwards adds data transfer. Check the current [S3 pricing] for your
region before starting a large export; the object count matters as much as the
byte count.

### How should I optimize my costs?

The data set is structured to help you control and optimize your costs.
It is split into daily revisions which may be exported individually, and within
a match the data is split by channel, so you can take only the channels you need.

Consider these steps:

1. AWS has a free tier which
   may reduce or eliminate the cost to get started.
2. **Skip `player_vector` and `player_status` unless you need per-tick
   telemetry.** They are about 30 MB of a match's 35 MB. Every other channel put
   together is under 2 MB, so a day without them costs roughly a tenth as much.
3. Estimate how much data you actually need by starting with one day.
   Remember that one revision is one day worth of data.
4. Be careful when exporting a large number of revisions at once.
   You might go over the free tier part-way through the export process
   and have difficulty stopping the jobs.
   We recommend you limit each export batch to one month intervals.
5. Once you have exported the data, build a [tome][dsdk] from it. A tome is a
   slice of features across many matches, small enough to keep around, and the
   tutorial covers making one.

### Where can I get financial support?

- If you are a student, ask your department or advisor if they can support you.
- If you are a professional data scientist, ask your organization
  if they can fund this as a hackathon project or self-guided learning project.
- Ask AWS for credits.
  Your company, organization, university, or department may
  have a relationship with AWS.
  If not, talk to your AWS account manager and they may help you get some credits.
- Talk to us. We can't promise financial support, but we can brainstorm a solution together.

[step 7 of the tutorial]: https://github.com/pureskillgg/makenew-pyskill/blob/master/notebooks/tutorial/7%20-%20Getting%20csds%20data%20from%20the%20ADX.ipynb
[pureskill.gg competitive gameplay data set]: ./adx/cs2/csds/
[tutorial]: https://github.com/pureskillgg/makenew-pyskill/blob/master/README.rst#-start-with-the-tutorial
[cc by-nc-sa 4.0]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[aws data exchange]: https://aws.amazon.com/data-exchange/
[anonymization]: https://github.com/pureskillgg/csgo-dsdk/blob/master/pureskillgg_csgo_dsdk/scrubber/scrub_pii.py
[apache parquet]: https://parquet.apache.org/
[json]: https://www.json.org/
[dsdk]: https://github.com/pureskillgg/dsdk
[csgo-dsdk]: https://github.com/pureskillgg/csgo-dsdk
[docs]: https://github.com/pureskillgg/docs
[makenew-pyskill]: https://github.com/pureskillgg/makenew-pyskill
[datascience-showcase]: https://github.com/pureskillgg/datascience-showcase
[semver]: https://semver.org/
[pep 440]: https://peps.python.org/pep-0440/
[discord]: https://pureskill.gg/discord
[tutorial requirements]: https://github.com/pureskillgg/makenew-pyskill#requirements
[python]: https://www.python.org/
[uv]: https://docs.astral.sh/uv/
[poetry]: https://python-poetry.org/
[pyenv]: https://github.com/pyenv/pyenv
[pyenv-win]: https://github.com/pyenv-win/pyenv-win
[s3 pricing]: https://aws.amazon.com/s3/pricing/
