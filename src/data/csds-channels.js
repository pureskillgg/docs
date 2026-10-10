// The objects published for one match, as listed in docs/datascience/adx/cs2/csds/spec.md.
// The homepage draws one tile per entry. Keep this list in step with the spec:
// when a channel is added, removed or renamed there, change it here too.

export const index = { name: 'csds', to: '/datascience/adx/cs2/csds/' }

const spec = '/datascience/adx/cs2/csds/spec'

// Each channel links to its section of the spec. Docusaurus builds the anchor
// from the heading "<name> - <type>", so "player_vector - telemetry" becomes
// "player_vector---telemetry".
const channel = (name, type, kind) => ({
  name,
  kind,
  to: `${spec}#${name}---${type}`
})

export const channels = [
  channel('player_vector', 'telemetry', 'telemetry'),
  channel('player_status', 'telemetry', 'telemetry'),
  channel('player_inputs', 'telemetry', 'telemetry'),
  channel('tick', 'telemetry', 'telemetry'),
  channel('grenade_vector', 'telemetry', 'telemetry'),
  channel('molotov_fire', 'telemetry', 'telemetry'),
  channel('world_item_vector', 'telemetry', 'telemetry'),
  channel('bomb_action', 'multi_event', 'event'),
  channel('bomb_defuse', 'multi_event', 'event'),
  channel('bomb_state', 'multi_event', 'event'),
  channel('bot_takeover', 'single_event', 'event'),
  channel('bullet_damage', 'single_event', 'event'),
  channel('grenade_bounce', 'single_event', 'event'),
  channel('grenade_state', 'multi_event', 'event'),
  channel('item_dropped', 'single_event', 'event'),
  channel('item_equip', 'single_event', 'event'),
  channel('item_pickup', 'single_event', 'event'),
  channel('item_refund', 'single_event', 'event'),
  channel('molotov_state', 'multi_event', 'event'),
  channel('other_death', 'single_event', 'event'),
  channel('player_blind', 'single_event', 'event'),
  channel('player_chat', 'single_event', 'event'),
  channel('player_connect', 'single_event', 'event'),
  channel('player_death', 'single_event', 'event'),
  channel('player_disconnect', 'single_event', 'event'),
  channel('player_footstep', 'single_event', 'event'),
  channel('player_hurt', 'single_event', 'event'),
  channel('player_name', 'single_event', 'event'),
  channel('player_sound', 'single_event', 'event'),
  channel('player_spawn', 'single_event', 'event'),
  channel('rank_update', 'single_event', 'event'),
  channel('round_end', 'single_event', 'event'),
  channel('round_mvp', 'single_event', 'event'),
  channel('round_start', 'single_event', 'event'),
  channel('round_state', 'multi_event', 'event'),
  channel('score_update', 'single_event', 'event'),
  channel('team_change', 'single_event', 'event'),
  channel('weapon_action', 'multi_event', 'event'),
  channel('weapon_fire', 'single_event', 'event'),
  channel('header', 'header', 'info'),
  channel('player_info', 'player_info', 'info'),
  channel('player_personal', 'player_info', 'info')
]
