---
sidebar_label: Quickstart
sidebar_position: 0.5
description: From an approved subscription to your first query, in Python.
---

# Quickstart

From an approved subscription to your first query, in Python, using one day of
matches. [Getting the Data](./getting-the-data.md) explains each step in more
depth, and the [CSDS Spec](./spec.md) lists every channel and column.

## 1. Subscribe

Subscribe on the [product page]. We review each request, which takes a few
days; say what you plan to do with the data.

Once you are approved, open AWS Data Exchange in the **us-east-1** region,
choose **Entitled data**, open the product, then the data set
`pureskillgg-csgo-production-dataexchange-csds-0`, and copy its **Data set
ID** from the data set overview.

## 2. Install

You need Python 3.11 or newer, AWS credentials that [boto3] can find, the
[AWS CLI] for step 4, and the two PureSkill.gg libraries:

```shell
pip install "pureskillgg-dsdk>=4.0.1" "pureskillgg-csgo-dsdk>=3.3.1"
```

The data set lives in us-east-1, so point boto3 there, for example with the
environment variable `AWS_DEFAULT_REGION=us-east-1`.

## 3. Export one day to S3

Data Exchange delivers a revision into an S3 bucket you own. Create one in
us-east-1 first, so the export doesn't add data transfer charges, then export
one day's revision:

```python
from datetime import date, timedelta

from pureskillgg_dsdk import export_multiple_adx_dataset_revisions_to_s3

DATA_SET_ID = "paste the Data set ID here"
DAY = date.today() - timedelta(days=7)  # any day from the past year

export_multiple_adx_dataset_revisions_to_s3(
    "your-bucket",
    DATA_SET_ID,
    start_date=DAY.isoformat(),
    end_date=(DAY + timedelta(days=1)).isoformat(),
)
print("exported", DAY.strftime("csds/%Y/%m/%d"))
```

That exports the revision created on `DAY`: every match processed that day,
usually 60 to 150 matches of 43 objects each. Revisions are pruned once they
are about a year old, so pick a day from the past year. The [Cost FAQ](../../../README.md#cost-faq)
says what that costs.

## 4. Download it

Copy the day to your machine with the AWS CLI, putting in the
`csds/YYYY/MM/DD` path that step 3 printed. Keep that part of the path: the
files' keys are how the libraries find them.

```shell
aws s3 sync s3://your-bucket/csds/YYYY/MM/DD/ data/csds/YYYY/MM/DD/ --exclude "*/player_vector" --exclude "*/player_status"
```

The two excluded channels are the per-tick telemetry, about 7 MB of each
match's 10 MB. Leave the `--exclude` options out if you want player positions
every tick.

## 5. Load one match

Each match is a folder holding one file per channel and an index object named
`csds` that lists them. Point a loader at a match's index:

```python
import glob
import os

from pureskillgg_dsdk import DsReaderFs, GameDsLoader

ROOT = "data"
keys = sorted(
    os.path.relpath(path, ROOT).replace(os.sep, "/")
    for path in glob.glob(os.path.join(ROOT, "csds", "*", "*", "*", "*", "csds"))
)
print(len(keys), "matches")

loader = GameDsLoader(reader=DsReaderFs(root_path=ROOT, manifest_key=keys[0]))
match = loader.get_channels([{"channel": "header"}, {"channel": "player_death"}])
print(match["header"][["map_name", "match_date", "platform"]])
print(match["player_death"][["round", "tick", "weapon_name", "is_headshot"]].head())
```

If you downloaded `player_vector`, add the ten columns it computes on load,
such as velocity and movement angle:

```python
from pureskillgg_csgo_dsdk import add_player_vector_derived_columns

player_vector = loader.get_channel({"channel": "player_vector"})
add_player_vector_derived_columns(player_vector)
```

## 6. Query the whole day

A tome is one table of a channel across many matches, with each row tagged
with its match's `match_key`. Build tomes for the day, then query them with
pandas:

```python
from pureskillgg_dsdk import TomeCuratorFs

day = "-".join(keys[0].split("/")[1:4])  # the day you downloaded, from its key
curator = TomeCuratorFs(
    default_header_name=f"header.{day},{day}",
    ds_type="csds",
    tome_collection_root_path="tomes",
    ds_collection_root_path=ROOT,
)
tomes = curator.build_basic_tomes(["player_death"])
header = tomes.header.get_dataframe()
deaths = tomes.tomes["player_death"].get_dataframe()

kills = deaths[
    deaths["attacker_id"].notna() & (deaths["attacker_id"] != deaths["player_id"])
]
kills = kills.merge(header[["key", "map_name"]], left_on="match_key", right_on="key")
print(kills.groupby(["map_name", "weapon_name"]).size().sort_values().tail(10))
```

That keeps the deaths another player caused, dropping falls, suicides and the
like, and prints the ten most common map and weapon pairs among the day's
kills.

## Next

- [How the Data Fits Together](./how-it-fits-together.md): ticks, rounds,
  players and sides, and how to join events to positions.
- [CSDS Spec](./spec.md): every channel and column.
- [Enums](./enums.md): what the codes mean, from win reasons to weapons.
- [Positions and View Angles](./coordinates.md): what `x`, `y`, `z`,
  `theta_ang` and `phi_ang` measure.
- [Changelog](./changelog.md): what changed in the data, and when.
- [Datasheet](./datasheet.md): how the data was collected and processed, and
  what it may be missing.

[product page]: https://aws.amazon.com/marketplace/pp/prodview-v3o7zrt6okwmo
[boto3]: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html
[aws cli]: https://aws.amazon.com/cli/
