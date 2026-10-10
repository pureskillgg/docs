---
sidebar_label: How It Fits Together
sidebar_position: 0.8
description: Channels, ticks, rounds, players, sides, and how to join events to positions.
---

# How the Data Fits Together

How a match's channels relate: what a row is, how time and rounds are counted,
how to follow a player, and how to join an event to where the players were.
The numbers on this page were measured on the 89 matches published on
2026-10-07. [Enums](./enums.md) says what the codes mean, and the
[CSDS Spec](./spec.md) lists every column.

## What a row is

Each channel has a category, shown in its heading in the spec:

| Category       | One row is                                                        | Channels                                                                                                                                                                      |
| -------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `header`       | The match.                                                        | `header`                                                                                                                                                                      |
| `player_info`  | One player in one round, taken when the round's freeze time ends. | `player_info`, `player_personal`                                                                                                                                              |
| `telemetry`    | Something on one tick.                                            | `player_vector` and `player_status` (one living player), `tick` (the tick), `grenade_vector` and `world_item_vector` (one object that moved), `molotov_fire`, `player_inputs` |
| `single_event` | One game event.                                                   | `player_death`, `player_hurt`, `weapon_fire`, `round_end` and the rest                                                                                                        |
| `multi_event`  | One of several related events, named in `event_type`.             | `bomb_action`, `bomb_state`, `grenade_state`, `molotov_state`, `round_state` and the rest                                                                                     |

Every row except the header's carries `round`, and every event and telemetry
row carries `tick`.

## Time

- **`tick`** counts the game's ticks: 64 a second (`header.tick_rate`).
- **`second`** is `tick / 64`.
- **The `tick` channel** has one row for every tick, with no gaps.

## Rounds

- **Rounds count from 1.** Warmup, knife rounds and drawn rounds are removed
  before publication, so round 1 is the first live round and the numbers run
  on without gaps.
- **`round_end`** has one row per round: who won in `winner_team_code` (2
  Terrorists, 3 Counter-Terrorists) and why in `win_reason_code`.
- **`header.max_rounds`** is the regulation length: 24, or 16 in Wingman.
  Rounds above it are overtime.
- **`round_state`** marks the moments within each round, such as
  `round_freeze_end`, `buytime_ended`, `bomb_planted` and `round_end`, in
  `event_type`.

## Players

- **Follow a player with `player_id_fixed`.** It numbers the players of a
  match from 1 and stays the same for each player all match. Bots get their own
  number, and `player_personal.is_bot` says which they are.
- **`player_personal.steam_id`** is a letter per player (`A`, `B`, `C` …) that
  also stays the same all match. Neither it nor `player_id_fixed` means
  anything in another match; see [Known Flaws](./known-flaws.md) on linking
  players across matches.
- **`player_id`** is the game's own id. Joins between channels use it with
  `tick`, as below.

## Sides

- **`player_info.team_code`** gives each player's side in each round: 2
  Terrorists, 3 Counter-Terrorists.
- **Teams switch sides at the half,** after round `max_rounds / 2`: every
  player in every regulation match we checked was on the other side in the
  next round.
- **The `header` columns starting `t_starters_` and `ct_starters_`** describe
  the team that started as Terrorists and the team that started as
  Counter-Terrorists, through the side swaps.

## Where the state lives

**`player_vector`** and **`player_status`** hold one row per living player
per tick, keyed on `(tick, player_id)`, and the two share those keys exactly.
A dead player has no rows for the rest of the round.

| Channel         | Holds                                                                                                                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player_vector` | Position (`x_pos`, `y_pos`, `z_pos`), view angles (`theta_ang`, `phi_ang`), the weapon in hand (`weapon_code`), ammo, recoil and crouching. Velocity and movement angle are computed on load, as the [Quickstart](./quickstart.md) shows. |
| `player_status` | Health, armor, money, the inventory (`inv_*`), equipment values, the callout the player is in (`place_name`), and flags such as `is_scoped` and `has_defuser`.                                                                            |

[Positions and View Angles](./coordinates.md) explains the coordinates.
`player_status` can be empty in a match; one of the 89 matches of 2026-10-07
had no rows in it.

## Joining events to positions

Most event channels already carry where their players were. A channel with a
`player_id` usually has `player_x_pos`, `player_theta_ang`,
`player_weapon_code`, `player_team_code` and the like, copied from
`player_vector`; an `attacker_id` or `assister_id` brings the same columns for
that player. `grenade_bounce`, `player_connect`, `player_disconnect`,
`player_footstep` and `round_mvp` carry none, so check a channel's columns in
the [CSDS Spec](./spec.md).

- **Most channels** copy from the row on the event's own tick.
- **`player_death`, `player_hurt`, `bullet_damage`, `bomb_action`,
  `item_dropped`, `player_chat` and `rank_update`** copy from the latest row
  up to 3 ticks before the event, because the player may already be dead on
  the event's tick.
- **Where no row is close enough, the columns are null.** On 2026-10-07 that
  was 0.2% of victims and 0.3% of attackers in `player_death`, 0.3% of
  `weapon_fire` rows, and 63% of assisters, who are often dead by the time of
  the kill.

To bring in a column the event doesn't carry, join the same way. This adds
each killer's money at the moment of the kill:

```python
import pandas as pd

deaths = loader.get_channel({"channel": "player_death"})
status = loader.get_channel(
    {"channel": "player_status", "columns": ["tick", "player_id", "money"]}
)

kills = deaths.dropna(subset=["attacker_id"]).astype({"attacker_id": "int64"})
money = status.rename(columns={"player_id": "attacker_id", "money": "attacker_money"})
money = money.astype({"attacker_id": "int64", "tick": "int64"})

kills = pd.merge_asof(
    kills.sort_values("tick"),
    money.sort_values("tick"),
    on="tick",
    by="attacker_id",
    direction="backward",
    tolerance=3,
)
print(kills[["round", "tick", "weapon_name", "attacker_money"]].head())
```

`loader` is a match loaded as in the [Quickstart](./quickstart.md).
