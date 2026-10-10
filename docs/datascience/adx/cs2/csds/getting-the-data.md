---
sidebar_label: Getting the Data
sidebar_position: 0.7
description: Access, daily revisions, exporting, the file layout and the index object.
---

# Getting the Data

How the data set is delivered, from subscribing to reading the files. The
[Quickstart](./quickstart.md) walks through the same steps for one day.

## Access

The data set is a free product on AWS Data Exchange. Subscribe on the
[product page]; we review each request, which takes a few days. Subscribing
means agreeing to the Data Subscriber Agreement (DSA). The data itself is
licensed under [CC BY-NC-SA 4.0][license].

Once approved, the data set appears in the AWS Data Exchange console under
**Entitled data**, in the **us-east-1** region, as
`pureskillgg-csgo-production-dataexchange-csds-0`. Its **Data set ID** is
what the export functions below take.

## Revisions

- **One revision a day.** A revision opens at 00:00 UTC and collects every
  match processed that UTC day. It is published when the next one opens. Its
  comment is the moment it was created, which is how the export functions
  pick revisions by date.
- **Processed, not played.** A match sits in the revision for the day it was
  processed, which can differ from the day it was played. Before 2026-09-07, a
  revision that failed to close carried its matches into the next one.
- **Pruned once a year.** Revisions more than about a year old are revoked and
  emptied in a batch about once a year, so the window runs from one to two
  years. Revoked revisions still appear in the revision list but can't be
  exported. [Revision Stats](./revision-stats.md) lists what each revision
  holds.

## Exporting

Data Exchange delivers a revision by writing its objects into an S3 bucket you
own. The [dsdk] library wraps the calls:

| Function                                                                                     | What it does                                                                                                           |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `export_multiple_adx_dataset_revisions_to_s3(bucket, data_set_id, start_date=…, end_date=…)` | Exports every revision created from `start_date` up to, not including, `end_date`.                                     |
| `export_single_adx_dataset_revision_to_s3(bucket, data_set_id, revision_id)`                 | Exports one revision; the latest one if `revision_id` is left out.                                                     |
| `enable_auto_exporting_adx_dataset_revisions_to_s3(bucket, data_set_id)`                     | Exports each new revision as it is published, until `disable_auto_exporting_adx_dataset_revisions_to_s3(data_set_id)`. |
| `download_adx_dataset_revision(root_path, data_set_id, revision_id)`                         | Downloads a revision straight to disk, one object at a time. A day is thousands of objects, so this is slow.           |
| `get_adx_dataset_revisions(data_set_id, start_date=…, end_date=…)`                           | Lists the revisions created in a date range.                                                                           |

They use [boto3]'s credentials and default region, so set the region to
us-east-1. Each export keeps every object's own key, as the
[File layout](#file-layout) shows; pass `prefix=` to put the keys under a
folder. In the console, a revision's export to Amazon S3 does the same when
its key pattern is `${Asset.Name}`.

**Permissions.** The AWS identity that exports needs `dataexchange:GetDataSet`,
`ListDataSetRevisions`, `GetRevision`, `CreateJob`, `StartJob` and `GetJob`,
plus `ListRevisionAssets` to download to disk, and `CreateEventAction`,
`ListEventActions` and `DeleteEventAction` to turn auto-export on and off.
It also needs `s3:PutObject` on the bucket. Auto-export writes as Data
Exchange itself, so the bucket's policy must allow that:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "dataexchange.amazonaws.com" },
      "Action": ["s3:PutObject", "s3:PutObjectAcl"],
      "Resource": "arn:aws:s3:::your-bucket/*",
      "Condition": {
        "StringEquals": { "aws:SourceAccount": "your-account-id" }
      }
    }
  ]
}
```

**Cost.** The [Cost FAQ](../../../README.md#cost-faq) has the sizes and how to
keep the bill down. A bucket in us-east-1 avoids transfer charges between
regions.

## File layout

```text
csds/
  2026/10/07/            the UTC day the match was processed
    <id>/                one folder per match, named by its public id
      csds               the index object: gzipped JSON
      bomb_action        one Parquet file per channel
      bomb_defuse
      …                  42 channels in all
```

- **Keys** are `csds/YYYY/MM/DD/<id>/<channel>`, with no file extensions.
  Keep the whole key when you download: the libraries find a match's files
  by it.
- **Channel files** are [Apache Parquet], compressed with ZSTD since
  2026-07-08 (GZIP before). Any Parquet reader opens them, for example
  `pandas.read_parquet(path)`.
- **The index object** is JSON compressed with gzip:
  `json.loads(gzip.decompress(open(path, "rb").read()))`.
- **Object counts.** A match is 43 objects since 2026-08-04 and 31 before;
  the 2026-08-03 revision holds both. Read the index rather than assuming a
  channel list.

### The index object

| Field                                                         | What it holds                                                                                      |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `id`                                                          | The match's public id, also its folder name.                                                       |
| `key`                                                         | The index object's own key.                                                                        |
| `createdAt`                                                   | When the match was processed (UTC); its date is the one in the key.                                |
| `matchDate`                                                   | When the match was played, cut to the minute. For a match uploaded by hand, when it was processed. |
| `platform`                                                    | `steam`, `faceit` or `unknown`. Matches uploaded by hand are `unknown`.                            |
| `matchType`                                                   | The match's type, such as `competitive`.                                                           |
| `game`                                                        | `csgo`, for every match, CS2 included.                                                             |
| `channels`                                                    | One entry per channel, below.                                                                      |
| `sharecode`, `demoId`                                         | `redacted`; see [PII Removal](./pii-removal.md).                                                   |
| `metadata`, `context`, `timings`, `jobId`, `type`, `redacted` | Pipeline bookkeeping.                                                                              |

Each entry in `channels` has:

- `channel`, the channel's name, and `key`, its file's key;
- `category`: `header`, `single_event`, `multi_event`, `telemetry` or
  `player_info`, as in the [CSDS Spec](./spec.md);
- `events`, the game events that write rows into it;
- `columns`, one entry per column with `name`, `type`, `nullable`, `origin`,
  `dependents`, `mergeKeys` and `comment`, as the spec's
  [How to read this](./spec.md#how-to-read-this) describes. Skip a column
  whose `origin` ends in `-deleted`: the file no longer stores it.
- `available`, on six channels whose events a demo may not carry
  (`bot_takeover`, `bullet_damage`, `player_inputs`, `player_sound`,
  `rank_update` and `round_mvp`). `false` means the demo didn't carry the
  event, so the channel is empty for that reason; `true` means it did, though
  the channel can still be empty when nothing happened. In the revision of
  2026-10-07, `player_inputs` and `player_sound` were `false` in 88 of 89
  matches.

## Match identity and dates

- **A match's `id` is new each time a demo is processed.** A demo processed
  twice, for example one uploaded by two users, appears twice with different
  ids. Find duplicates by comparing `header` columns such as `map_name`,
  `server_name`, `build_num` and the final scores.
- **Which date to use.** `header.match_date` is when the match was played,
  except for matches uploaded by hand, where it is when they were processed.
  The date in the key is always when the match was processed.

[product page]: https://aws.amazon.com/marketplace/pp/prodview-v3o7zrt6okwmo
[license]: https://creativecommons.org/licenses/by-nc-sa/4.0/
[dsdk]: https://github.com/pureskillgg/dsdk
[boto3]: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html
[apache parquet]: https://parquet.apache.org/
