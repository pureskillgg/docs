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

We want to see what amazing stuff people will do with it!

### Who can use the data?

Anyone with a use case that adheres to the license.

The full license is presented and agreed to when you subscribe to the data set,
but it's basically the [CC BY-NC-SA 4.0] license, which means you
may not use the data for commercial purposes, you must attribute PureSkill.gg,
and you must use the same license for any derived work.

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

[pureskill.gg competitive cs:go gameplay data set]: ./adx/csgo/csds/
[tutorial]: https://github.com/pureskillgg/makenew-pyskill/blob/master/README.rst#-start-with-the-tutorial
[cc by-nc-sa 4.0]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[aws data exchange]: https://aws.amazon.com/data-exchange/
[anonymization]: https://github.com/pureskillgg/csgo-dsdk/blob/master/pureskillgg_csgo_dsdk/scrubber/scrub_pii.py
