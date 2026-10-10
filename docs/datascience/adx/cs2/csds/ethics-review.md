---
unlisted: true
description: An internal ethics review of the Competitive CS2 Gameplay data set, carried out by an AI agent and signed off by FPS Critic, Inc. in October 2026.
---

# AI Ethics Review

In October 2026 we reviewed the ethics of the
[Competitive CS2 Gameplay](./README.md) data set. An AI agent (Claude, made by
Anthropic) did the work: it checked the [Datasheet](./datasheet.md)'s claims
against our code and our data, and wrote up what it found. A person at
FPS Critic, Inc. went through every finding and made the final call on each.

This is an internal review. No institutional review board or other independent
body was involved.

Reviewer of record: FPS Critic, Inc., 2026-10-09.

## How we checked

- We ran our [PII removal](./pii-removal.md) code on 50 real matches and
  compared what came out with what the PII Removal page says.
- Using only what a subscriber receives, we tested whether a player could be
  singled out within a match, or followed from one match to another, on one
  week of published data. We counted the results and never recorded names,
  Steam IDs or match ids.
- We did not try to find out who any player is, and did not look players up
  on any outside site.
- We read our [Terms of Service] and [Privacy Policy] as they stood on
  2026-10-09.

## What we found

### Names and accounts are removed as described

Every value listed on [PII Removal](./pii-removal.md) is removed or replaced
before publication. Nobody was identified in any test.

### Some players can be followed from match to match

For some players, enough of the published data carries over from one match to
the next that their matches can be linked to each other. Following a player
like this is not the same as knowing who they are: the data holds no names,
account ids or chat text, and nobody was identified. We have decided to leave this
as a [known flaw](./known-flaws.md) rather than remove more data. Trying to
identify anyone is not permitted by the license agreement.

### Consent

PureSkill.gg users connect their accounts so we can analyze their matches. Our
Terms of Service do not mention this data set, and our Privacy Policy allows
sharing data only in a form that does not identify people. We are updating the
Privacy Policy to name the data set.

Most players in a match are not PureSkill.gg users and were not asked. We
include them because the data records only what happened in a video game, on a
public server, with names and account ids removed. It's much like a game on a
public sports field: anyone there could have recorded it.

### What someone could learn about a player

If someone did manage to tie a player's matches to a real person, they would
learn when that person plays, roughly where (the server region), and how well.
In principle, play times could show something like a teenager playing during
school hours. That is a real stretch, but it is possible.

### Minors

Steam and PureSkill.gg allow players from 13 years old, so the data almost
certainly includes players under 18, both users and the people they played
with.

### Deletion

The data set carries no names or account ids, so it can't be searched for a
particular person. A published revision is never edited; it stays as published
until it is pruned, and subscribers keep the copies they export.

### Misuse: cheat development

This is the most serious concern we found. The data set records where each
player was aiming on every tick and, in matches whose demos carry them, which
buttons they pressed. That is the kind of data someone could use to train a
cheat that imitates human play.
The data set may not be used to develop, train or test cheats. We approve each
subscription by hand, ask what it is for, and turn down any we think could
serve cheating.

### Who benefits

The data set is free, for education and machine-learning research. Its use is
modest. Apart from cheat development, we judge the risks above to be low, and
we think that benefit is enough to keep publishing it.

### Who is in the data

Matches come from PureSkill.gg users and the players they met, so the data
leans toward players who seek coaching. The [Datasheet](./datasheet.md) says
so.

[terms of service]: https://pureskill.gg/site-terms/
[privacy policy]: https://pureskill.gg/privacy-policy/
