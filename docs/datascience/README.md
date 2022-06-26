# PureSkill.gg Data Science

## FAQ

### What data is available?

The [PureSkill.gg Competitive CS:GO Gameplay Data Set] contains
Competitive Counter-Strike: Global Offensive (CS:GO) match data
from matchmaking, FACEIT, and other third-parties.
Contains full player telemetry and timestamped game events.

### How can I get started?

With [the tutorial][tutorial] you will learn how to do some real
CS:GO data science with data from the public data set.
Once you complete the tutorial, you may use the same repository to bootstrap you own project!

### Why are you doing this?

We want to see the amazing stuff you'll do with it!
Working with AI researchers using CS:GO to solve really hard problems inspired us to
contribute back and unlock this potential for anyone.

We hope this work can fuel everything from one's first data science experience, to their
next hackathon, school project—all the way to groundbreaking research.

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

See the [Cost FAQ][#cost-faq] for details.

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
But it's ok, you can reach out in the Dojo channel on [Discord].
We want to help you and get your feedback!

## Technical FAQ

### What are the developer tools?

- **[PySkill][makenew-pyskill]:**
  Project skeleton for doing PureSkill.gg data science with Python.
- **[Data Science Developer Kit (DSDK)][dsdk]:**
  Python library for working with the data.
  Read csds, create tomes, access data from the ADX, and more.
- **[CS:GO Data Science Developer Kit (CSGO DSDK)][csgo-dsdk]:**
  Python library with tools specific to CS:GO data science.
- **[PureSkill.gg Data Science Showcase][datascience-showcase]:**
  Demonstrations and examples of neat applications of PureSkill.gg data.
- **[PureSkill.gg Docs][docs]:**
  This website.

### Are the developer tools stable?

Mostly.
We don't anticipate majors changes before releasing version 1 of our libraries.
During the initial period following the announcement, we will be working
with early adopters to squash bugs and smooth out the APIs.
Please report any issues on GitHub.

Libraries follow the principals of [semver].
Beta releases may see breaking API changes before their final release, while release candidates
will avoid this unless absolutely necessary.

Python projects use the [PEP 440] standard version format
of `1.2.3` for stable releases, `1.2.3b0` for beta releases,
and `1.2.3rc0` for release candidates.
This is a small cosmetic difference, but otherwise, the semantic meaning will follow [semver].

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

If you want to use another language, we still recommend stating with the [tutorial].
This is the easiest way to download the data and create new tomes, which are just more Parquet and JSON files.
Tomes are economical views of the data tailored for specific analyses.

## Cost FAQ

### How much will AWS charge me?

_FPS Critic Inc., owner of PureSkill.gg, is not liable for any AWS costs you incur._

[Step 7 of the tutorial] can help you estimate your costs,
We provide those and the estimates below for convenience,
but we do not guarantee their accuracy or applicability to your AWS account.

TL;DR: It costs about $1.50 to download a day of data, or $4-5 per 1,000 matches.
Downloading tomes is much less expensive. Many tomes are pennies to download
and include data from 6+ months of matches.

The data set is structured to help you control and optimize your costs.

- The data set is split into daily revisions which may be downloaded individually.
- On average, a revision is 13GB, contains 350 matches,
  and costs about $1.50 to download.
- We maintain a companion Tome data set which is very economical
  to work with.
  Tomes contain slices of features across many matches.

### How should I optimize my costs?

1. You probably don't need as much data as you think.
2. AWS has a generous free tier which
   may reduce or the eliminate the cost to get started.
3. If you can use available tomes for your project,
   don't bother downloading individual match data.
   Most tomes cost pennies to download and contain
   data for across many matches.
4. Otherwise, start with one day of data to discover your costs.
5. Estimate how much data you actually need to get started experimenting.
6. Be careful when downloading a large number of revisions at once.
   You might go over the free tier part-way though the export process
   and have difficulty stopping the jobs.
   We recommend you limit each export batch to one month intervals.
7. If you share a tome generator with us, we may be able to make the tome
   for you and share it back to the data set.

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
[pureskill.gg competitive cs:go gameplay data set]: ./adx/csgo/csds/
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