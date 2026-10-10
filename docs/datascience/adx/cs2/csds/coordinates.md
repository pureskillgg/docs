---
sidebar_label: Positions and View Angles
sidebar_position: 1.5
description: What x, y, z, theta and phi mean, and how to compute the angle between a player's view and any point.
---

import Top from './assets/top.svg'
import Side from './assets/side.svg'
import Sphere from './assets/sphere.svg'
import Angle from './assets/angle.svg'

# Positions and View Angles

Every position in the data set is a point in the map's 3D coordinates, and every
view is a pair of angles, `theta_ang` and `phi_ang`. This page says how they fit
together and gives the formula for the angle between a player's view and any
point, such as another player.

It covers `player_vector.x_pos`, `y_pos`, `z_pos`, `theta_ang` and `phi_ang`,
and their merged copies on the event channels (`player_x_pos`,
`attacker_theta_ang`, `assister_phi_ang` and so on).

## The axes

- **x and y run along the ground, and z points up.** The axes are right-handed.
  Units are the game's world units, about an inch each.
- **A player's position is their feet**, the origin of the player model, not
  their eyes. The eyes are about 64 units higher standing and about 46 units
  higher crouched. `player_vector.duck_amount` goes from 0 standing to 1 fully
  crouched, so the eye height is about

$$
h \approx 64 - 18 \cdot \texttt{duck\_amount}
$$

The event channels don't carry `duck_amount`. Join `player_vector` on
`player_id` and `tick` to get it, or use 64.

## theta and phi

<Top style={{ maxWidth: '100%', height: 'auto' }} />

**`theta_ang` is the direction a player faces across the ground**, in degrees
from −180 to 180. 0 faces along +x and 90 along +y, so theta increases
counterclockwise seen from above. Wrap the difference between two thetas into
−180 to 180 before using it: 179 and −179 are 2° apart, not 358°.

<Side style={{ maxWidth: '100%', height: 'auto' }} />

**`phi_ang` is how far the view is tipped down from straight up**, in degrees:
0 straight up, 90 level and 180 straight down. The game stops the view just
short of vertical, so the data runs from 1 to 179.

In the game's own terms, theta is the view's yaw and phi is its pitch plus 90.
The game's pitch is positive looking down.

:::caution Mathematics convention, not physics

The names follow the mathematics convention for spherical coordinates: theta
goes around the vertical axis, and phi is measured down from it. Physics texts,
and ISO 80000-2, swap the two letters.

:::

## The view as a vector

<Sphere style={{ maxWidth: '100%', height: 'auto' }} />

The direction a player looks is the unit vector

$$
\hat{v} = (\sin\phi \cos\theta,\ \sin\phi \sin\theta,\ \cos\phi)
$$

and the angles come back from it as $\theta = \operatorname{atan2}(v_y, v_x)$ and
$\phi = \arccos v_z$.

## The angle from a view to a point

<Angle style={{ maxWidth: '100%', height: 'auto' }} />

Take the viewer's eye $E$ and any point $P$, such as another player's position.
The viewer's own position is their feet, so raise it by the eye height $h$:

$$
E = (x,\ y,\ z + h), \qquad \vec{d} = P - E
$$

The angle $\alpha$ between the view and the line from the eye to the point is

$$
\alpha = \operatorname{atan2}\!\big(\lVert \hat{v} \times \vec{d} \rVert,\ \hat{v} \cdot \vec{d}\big)
$$

This is the same angle as $\arccos\big(\hat{v} \cdot \vec{d} \,/\, \lVert \vec{d} \rVert\big)$,
but stays accurate when the angle is small, where arccos loses precision.

To see which way the view is off, split it into a part across the ground and a
part up and down. The direction from the eye to the point is

$$
\theta_P = \operatorname{atan2}(d_y,\ d_x), \qquad
\phi_P = \operatorname{atan2}\!\Big(\sqrt{d_x^2 + d_y^2},\ d_z\Big)
$$

and the view is off by

$$
\Delta\theta = \big((\theta - \theta_P + 180) \bmod 360\big) - 180, \qquad
\Delta\phi = \phi - \phi_P
$$

$\Delta\theta > 0$ means the view is to the left of the point, as the viewer
sees it, and $\Delta\phi > 0$ means it is below the point.

$\sqrt{\Delta\theta^2 + \Delta\phi^2}$ is close to $\alpha$ when the view is
near level, but overstates it when the view is steep: near straight up or down,
a large $\Delta\theta$ is a small turn. Use $\alpha$ when you need the angle
itself. The same holds for `ang_vel`, which combines `theta_vel` and `phi_vel`
this way.

### In Python

The angle from each killer's view to their victim, from `player_death`:

```python
import numpy as np


def view_vector(theta, phi):
    t, p = np.radians(theta), np.radians(phi)
    return np.stack(
        [np.sin(p) * np.cos(t), np.sin(p) * np.sin(t), np.cos(p)], axis=-1
    )


def angle_to_point(eye, theta, phi, point):
    """Degrees between the view and the line from eye to point."""
    d = point - eye
    v = view_vector(theta, phi)
    cross = np.linalg.norm(np.cross(v, d), axis=-1)
    return np.degrees(np.arctan2(cross, (v * d).sum(axis=-1)))


# deaths: the player_death channel, read into a pandas DataFrame
kills = deaths.dropna(subset=["attacker_x_pos", "attacker_theta_ang"]).copy()
eye = kills[["attacker_x_pos", "attacker_y_pos", "attacker_z_pos"]].to_numpy()
eye[:, 2] += 64
victim = kills[["player_x_pos", "player_y_pos", "player_z_pos"]].to_numpy()
victim[:, 2] += 64

kills["aim_angle"] = angle_to_point(
    eye, kills["attacker_theta_ang"], kills["attacker_phi_ang"], victim
)
```

This aims at the victim's eye height. Leave out `victim[:, 2] += 64` to aim at
their feet instead.

## Things to know

- **The angles are the player's aim before recoil.** While a weapon sprays,
  recoil sends shots above the aim, and players pull their aim down to make up
  for it. At kills, the killer's aim sits a median 1.7° below the victim's eye
  height.
- **The merged columns are as of the last tick at or before the event.** At a
  kill, the victim's position is from their last tick alive.
- **We checked these conventions on 5,932 gun kills in 50 matches.** At the
  kill, the killer's view is a median 2.2° from the victim, eye height to eye
  height, and 78% are within 5°. On the 626 kills with a height difference of
  10° or more, reading phi the other way up gives a median of 30°, and reading
  theta clockwise gives 78°.
