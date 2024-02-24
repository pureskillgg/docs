# CSDS Spec

Documentation for CSDS channels built by FPS Critic, Inc.

## bomb_action - multi_event

Events that trigger this channel: bomb_abort_plant, bomb_begin_plant, bomb_dropped, bomb_pickup, player_given_c4

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|event_type|replay|||
|player_id|replay|||
|player_id_pawn|replay|||
|site_code|replay|||
|entity_id|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|

## bomb_defuse - multi_event

Events that trigger this channel: bomb_abort_defuse, bomb_begin_defuse

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|event_type|replay|||
|player_id|replay|||
|has_kit|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|

## bomb_state - multi_event

Events that trigger this channel: bomb_defused, bomb_exploded, bomb_planted

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|event_type|replay|||
|player_id|replay|||
|site_code|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|

## bot_takeover - single_event
Event that triggers this channel: bot_takeover

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|bot_id|replay|||
|player_index|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|

## grenade_state - multi_event

Events that trigger this channel: decoy_detonate, decoy_firing, decoy_started, flashbang_detonate, hegrenade_detonate, smokegrenade_detonate, smokegrenade_expired

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|event_type|replay|||
|entity_id|replay|||
|player_id|replay|||
|x_pos|replay|||
|y_pos|replay|||
|z_pos|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|entity_id_fixed|calculated|round, entity_id, event_type, tick||
|tick_throw|calculated|round, player_id, weapon_name, tick||
|player_x_pos|merged||tick_throw, player_id|
|player_y_pos|merged||tick_throw, player_id|
|player_z_pos|merged||tick_throw, player_id|
|player_x_vel|merged||tick_throw, player_id|
|player_y_vel|merged||tick_throw, player_id|
|player_z_vel|merged||tick_throw, player_id|
|player_phi_ang|merged||tick_throw, player_id|
|player_theta_ang|merged||tick_throw, player_id|
|player_weapon_code|merged||tick_throw, player_id|
|player_team_code|merged||tick_throw, player_id|

## header - header

Event that triggers this channel: none

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|magic|replay|||
|network_protocol|replay|||
|server_name|replay|||
|client_name|replay|||
|map_name|replay|||
|game_directory|replay|||
|fullpackets_version|replay|||
|allow_clientside_entities|replay|||
|allow_clientside_particles|replay|||
|addons|replay|||
|demo_version_name|replay|||
|demo_version_guid|replay|||
|build_num|replay|||
|game|replay|||
|magic|replay|||
|protocol|replay|||
|network_protocol|replay|||
|server_name|replay|||
|client_name|replay|||
|map_name|replay|||
|game_directory|replay|||
|playback_time|replay|||
|playback_ticks|replay|||
|playback_frames|replay|||
|signon_length|replay|||
|tick_rate|calculated|playback_ticks, playback_time||
|tick_save_rate|calculated|playback_frames, playback_time||
|rushb_version|calculated|meta:metadata.rushbVersion||
|ppp_version|calculated|meta:context.version||
|match_date|calculated|meta:matchDate||
|demo_id|calculated-redacted|meta:demoId||
|sharecode|calculated-redacted|meta:sharecode||
|platform|calculated|meta:platform||
|match_type|calculated|meta:matchType||
|game|calculated|meta:game||
|second|calculated|tick, tick_rate||
|t_starters_avg_rank|calculated|is_bot, round, rank, steam_id, team_code||
|t_starters_avg_wins|calculated|is_bot, round, wins, steam_id, team_code||
|ct_starters_avg_rank|calculated|is_bot, round, rank, steam_id, team_code||
|ct_starters_avg_wins|calculated|is_bot, round, wins, steam_id, team_code||
|ct_starters_score_final|calculated|round_state:ct_score||
|t_starters_score_final|calculated|round_state:t_score||
|providence|calculated|metademo:providence||
|number_of_points|calculated|shape of all data frames||

## item_equip - single_event

Event that triggers this channel: item_equip

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|item|replay|||
|def_index|replay|||
|can_zoom|replay|||
|has_silencer|replay|||
|is_silenced|replay|||
|has_tracers|replay|||
|weapon_type_code|replay|||
|is_painted|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|

## item_pickup - single_event

Event that triggers this channel: item_pickup

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|item|replay|||
|def_index|replay|||
|is_silent|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|

## item_remove - single_event

Event that triggers this channel: item_pickup

Note: This event no longer seems to trigger in CS2. Check inventory data in player_status channel to infer when something is removed.

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|item|replay|||
|def_index|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|

## molotov_state - multi_event

Events that trigger this channel: inferno_detonate, inferno_expire, inferno_extinguish, inferno_startburn

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|event_type|replay|||
|entity_id|replay|||
|x_pos|replay|||
|y_pos|replay|||
|z_pos|replay|||
|second|calculated|tick, tick_rate||
|entity_id_fixed|calculated|round, entity_id, event_type, tick||
|burn_duration|calculated|second, entity_id_fixed, event_type||
|was_extinguished_by_smoke|calculated|second, entity_id_fixed, event_type, burn_duration||
|extinguisher_id|calculated|second, entity_id_fixed, event_type, x_pos, y_pos, z_pos, player_id||
|extinguisher_id_fixed|calculated|second, entity_id, entity_id_fixed, event_type, x_pos, y_pos, z_pos, player_id_fixed||
|smoke_entity_id|calculated|second, entity_id, entity_id_fixed, event_type, x_pos, y_pos, z_pos||
|was_extinguished_by_thrown_smoke|calculated|second, entity_id, entity_id_fixed, event_type, x_pos, y_pos, z_pos||
|player_id|calculated|event_type, second, round||
|player_id_fixed|calculated|event_type, second, round||
|tick_throw|calculated|event_type, second, round||
|player_x_pos|merged||tick_throw, player_id|
|player_y_pos|merged||tick_throw, player_id|
|player_z_pos|merged||tick_throw, player_id|
|player_x_vel|merged||tick_throw, player_id|
|player_y_vel|merged||tick_throw, player_id|
|player_z_vel|merged||tick_throw, player_id|
|player_phi_ang|merged||tick_throw, player_id|
|player_theta_ang|merged||tick_throw, player_id|
|player_weapon_code|merged||tick_throw, player_id|
|player_team_code|merged||tick_throw, player_id|

## other_death - single_event

Events that trigger this channel: other_death

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|other_type|replay|||
|attacker_id|replay|||
|weapon_name|replay|||
|is_headshot|replay|||
|penetration_amount|replay|||
|is_through_smoke|replay|||
|is_attacker_blind|replay|||
|is_noscope|replay|||
|second|calculated|tick, tick_rate||
|attacker_id_fixed|merged||attacker_id, round, steam_id|
|attacker_x_pos|merged||attacker_id, tick|
|attacker_y_pos|merged||attacker_id, tick|
|attacker_z_pos|merged||attacker_id, tick|
|attacker_x_vel|merged||attacker_id, tick|
|attacker_y_vel|merged||attacker_id, tick|
|attacker_z_vel|merged||attacker_id, tick|
|attacker_phi_ang|merged||attacker_id, tick|
|attacker_theta_ang|merged||attacker_id, tick|
|attacker_weapon_code|merged||attacker_id, tick|
|attacker_team_code|merged||attacker_id, tick|
|attacker_tick|merged||attacker_id, tick|
|attacker_player_id|merged||attacker_id, tick|

## player_action - multi_event

Events that trigger this channel: inspect_weapon, player_decal, player_jump, silencer_detach

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|event_type|replay|||
|player_id|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|

## player_blind - single_event

Event that triggers this channel: player_blind

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|entity_id|replay|||
|attacker_id|replay|||
|blind_duration|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|attacker_id_fixed|merged||attacker_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|
|attacker_x_pos|merged||attacker_id, tick|
|attacker_y_pos|merged||attacker_id, tick|
|attacker_z_pos|merged||attacker_id, tick|
|attacker_x_vel|merged||attacker_id, tick|
|attacker_y_vel|merged||attacker_id, tick|
|attacker_z_vel|merged||attacker_id, tick|
|attacker_phi_ang|merged||attacker_id, tick|
|attacker_theta_ang|merged||attacker_id, tick|
|attacker_weapon_code|merged||attacker_id, tick|
|attacker_team_code|merged||attacker_id, tick|
|attacker_tick|merged||attacker_id, tick|
|attacker_player_id|merged||attacker_id, tick|

## player_death - single_event

Event that triggers this channel: player_death

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|attacker_id|replay|||
|assister_id|replay|||
|weapon_name|replay|||
|is_headshot|replay|||
|penetration_amount|replay|||
|has_replay|replay|||
|is_flash_assist|replay|||
|is_through_smoke|replay|||
|is_attacker_blind|replay|||
|is_noscope|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|attacker_id_fixed|merged||attacker_id, round, steam_id|
|assister_id_fixed|merged||assister_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|
|attacker_x_pos|merged||attacker_id, tick|
|attacker_y_pos|merged||attacker_id, tick|
|attacker_z_pos|merged||attacker_id, tick|
|attacker_x_vel|merged||attacker_id, tick|
|attacker_y_vel|merged||attacker_id, tick|
|attacker_z_vel|merged||attacker_id, tick|
|attacker_phi_ang|merged||attacker_id, tick|
|attacker_theta_ang|merged||attacker_id, tick|
|attacker_weapon_code|merged||attacker_id, tick|
|attacker_team_code|merged||attacker_id, tick|
|attacker_tick|merged||attacker_id, tick|
|attacker_player_id|merged||attacker_id, tick|
|assister_x_pos|merged||assister_id, tick|
|assister_y_pos|merged||assister_id, tick|
|assister_z_pos|merged||assister_id, tick|
|assister_x_vel|merged||assister_id, tick|
|assister_y_vel|merged||assister_id, tick|
|assister_z_vel|merged||assister_id, tick|
|assister_phi_ang|merged||assister_id, tick|
|assister_theta_ang|merged||assister_id, tick|
|assister_weapon_code|merged||assister_id, tick|
|assister_team_code|merged||assister_id, tick|
|assister_tick|merged||assister_id, tick|
|assister_player_id|merged||assister_id, tick|

## player_disconnect - single_event

Event that triggers this channel: player_disconnect

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|disconnect_reason|replay|||
|is_bot|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|

## player_footstep - single_event

Event that triggers this channel: player_footstep

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|

## player_hurt - single_event

Event that triggers this channel: player_hurt

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|attacker_id|replay|||
|health|replay|||
|armor|replay|||
|weapon_name|replay|||
|health_removed|replay|||
|armor_removed|replay|||
|hit_box_code|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|attacker_id_fixed|merged||attacker_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|
|attacker_x_pos|merged||attacker_id, tick|
|attacker_y_pos|merged||attacker_id, tick|
|attacker_z_pos|merged||attacker_id, tick|
|attacker_x_vel|merged||attacker_id, tick|
|attacker_y_vel|merged||attacker_id, tick|
|attacker_z_vel|merged||attacker_id, tick|
|attacker_phi_ang|merged||attacker_id, tick|
|attacker_theta_ang|merged||attacker_id, tick|
|attacker_weapon_code|merged||attacker_id, tick|
|attacker_team_code|merged||attacker_id, tick|
|attacker_tick|merged||attacker_id, tick|
|attacker_player_id|merged||attacker_id, tick|
|effective_health_removed|calculated|player_id, round, health||

## player_info - player_info

Event that triggers this channel: round_freeze_end

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay-deleted|||
|player_id|replay|||
|team_code|replay|||
|wins|replay-capped|||
|rank|replay|||
|radar_color_code|replay|||
|second|calculated-deleted|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|rank_raw|calculated|player_info:rank||
|rank_platform|calculated|player_personal:rank||

## player_name - single_event

Event that triggers this channel: player_name

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|name_new|replay-redacted|||
|name_old|replay-redacted|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|

## player_personal - player_info

Event that triggers this channel: round_freeze_end

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay-deleted|||
|player_id|replay|||
|player_controller_id|replay|||
|player_id_pawn|replay|||
|name|replay-redacted|||
|clan_tag|replay-redacted|||
|steam_id|replay-redacted|||
|second|calculated-deleted|tick, tick_rate||
|is_bot|calculated|steam_id||
|player_id_fixed|calculated|steam_id, is_bot||

## player_spawn - single_event

Event that triggers this channel: player_spawn

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|

## player_status - telemetry

Event that triggers this channel: tick_end

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|tick|replay|||
|round|replay|||
|player_id|replay|||
|player_controller_id|replay|||
|armor|replay|||
|health|replay|||
|place_name|replay|||
|inv_primary|replay|||
|inv_secondary|replay|||
|inv_flashbang|replay|||
|inv_taser|replay|||
|inv_hegrenade|replay|||
|inv_smokegrenade|replay|||
|inv_molotov|replay|||
|inv_decoy|replay|||
|inv_incgrenade|replay|||
|inv_c4|replay|||
|current_equipment_cost|replay|||
|freezetime_end_equipment_cost|replay|||
|money|replay|||
|ping|replay-redacted|||
|round_start_equipment_cost|replay|||
|zoom_level|replay|||
|iron_sight_mode|replay|||
|burst_mode|replay|||
|is_silenced|replay|||
|reload_visually_complete|replay|||
|weapon_mode|replay|||
|flash_duration|replay|||
|flash_max_alpha|replay|||
|has_c4|replay|||
|has_defuser|replay|||
|has_helmet|replay|||
|is_defusing|replay|||
|is_fake_player|replay|||
|is_in_bomb_zone|replay|||
|is_in_buy_zone|replay|||
|is_scoped|replay|||
|is_spotted|replay|||
|is_walking|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|equipment_value_calc|calculated|inv_flashbang, inv_taser, inv_hegrenade, inv_smokegrenade, inv_molotov, inv_decoy, inv_incgrenade, inv_c4, armor, has_defuser, has_helmet, inv_primary, inv_secondary||

## player_vector - telemetry

Event that triggers this channel: tick_end

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|tick|replay|||
|round|replay|||
|player_id|replay|||
|x_pos|replay|||
|y_pos|replay|||
|z_pos|replay|||
|x_aimpunch|replay|||
|y_aimpunch|replay|||
|current_ammo|replay|||
|weapon_code|replay|||
|inaccuracy|replay|||
|last_shot_time|replay|||
|recoil_index|replay|||
|phi_ang|replay|||
|theta_ang|replay|||
|is_ducked|replay|||
|is_ducking|replay|||
|duck_amount|replay|||
|duck_speed|replay|||
|fall_velocity|replay|||
|view_punch_angle_tick|replay|||
|aim_punch_angle_vel_x|replay|||
|aim_punch_angle_vel_y|replay|||
|aim_punch_angle_vel_z|replay|||
|is_rescuing|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|team_code|merged||round, player_id|
|theta_vel|calculated|second, player_id, theta||
|phi_vel|calculated|second, player_id, phi||
|ang_vel|calculated|phi_vel, theta_vel||
|x_vel|calculated|second, x_pos||
|y_vel|calculated|second, y_pos||
|z_vel|calculated|second, z_pos||
|x_vel|calculated|second, x_pos||
|y_vel|calculated|second, y_pos||
|z_vel|calculated|second, z_pos||
|x_vel|calculated|second, x_pos||
|y_vel|calculated|second, y_pos||
|z_vel|calculated|second, z_pos||
|x_vel|calculated|second, x_pos||
|y_vel|calculated|second, y_pos||
|z_vel|calculated|second, z_pos||
|x_vel|calculated|second, x_pos||
|y_vel|calculated|second, y_pos||
|z_vel|calculated|second, z_pos||
|x_vel|calculated|second, x_pos||
|y_vel|calculated|second, y_pos||
|z_vel|calculated|second, z_pos||
|x_vel|calculated|second, x_pos||
|y_vel|calculated|second, y_pos||
|z_vel|calculated|second, z_pos||
|x_vel|calculated|second, x_pos||
|y_vel|calculated|second, y_pos||
|z_vel|calculated|second, z_pos||
|x_vel|calculated|second, x_pos||
|y_vel|calculated|second, y_pos||
|z_vel|calculated|second, z_pos||
|x_vel|calculated|second, x_pos||
|y_vel|calculated|second, y_pos||
|z_vel|calculated|second, z_pos||
|speed_2d|calculated|x_vel, y_vel||
|movement_angle|calculated|second, x_vel, y_vel||
|movement_angle_diff|calculated|second, speed_2d, theta_ang, movement_angle||

## round_end - single_event

Event that triggers this channel: round_end

Note: this event is no longer in the .dem files. This channel is inferred from other round events.

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|winner_team_code|replay|||
|win_reason_code|replay|||
|win_reason_message|replay|||
|legacy_code|replay|||
|player_count|replay|||
|second|calculated|tick, tick_rate||

## round_mvp - single_event

Event that triggers this channel: round_mvp

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|mvp_reason_code|replay|||
|music_kit_mvps|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|

## round_start -single_event

Event that triggers this channel: round_start

Note: this event is no longer in the .dem files. This channel is inferred from other round events.

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|time_limit|replay|||
|frag_limit|replay|||
|objective|replay|||
|second|calculated|tick, tick_rate||

## round_state - multi_event

Events that trigger this channel: cs_round_start_beep, cs_round_final_beep, cs_win_panel_round, cs_pre_restart, round_prestart, round_poststart, round_announce_last_round_half, announce_phase_end, round_announce_final, round_announce_match_point, cs_win_panel_match, begin_new_match, buytime_ended, round_announce_match_start, round_announce_warmup, round_freeze_end, start_halftime, round_officially_ended, round_end

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|event_type|replay|||
|t_score|replay_fixed|||
|ct_score|replay_fixed|||
|t_score_raw|replay|||
|ct_score_raw|replay|||
|phase|replay|||
|is_warmup|replay|||
|second|calculated|tick, tick_rate||

## tick - single_event

Event that triggers this channel: tick_end

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|second|calculated|tick, tick_rate||
|previous_phase|calculated|event_type, second||
|second_since_previous_phase|calculated|second||

## weapon_action - multi_event

Events that trigger this channel: fire_on_empty, reload, zoom, zoom_rifle

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|event_type|replay|||
|player_id|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|

## weapon_fire - single_event

Event that triggers this channel: weapon_fire

| Col Name           | Origin     | Dependents      | Merge Keys                 |
| ------------------ | ---------- | --------------- | -------------------------- |
|round|replay|||
|tick|replay|||
|player_id|replay|||
|player_id_pawn|replay|||
|weapon_name|replay|||
|is_silenced|replay|||
|second|calculated|tick, tick_rate||
|player_id_fixed|merged||player_id, round, steam_id|
|player_x_pos|merged||player_id, tick|
|player_y_pos|merged||player_id, tick|
|player_z_pos|merged||player_id, tick|
|player_x_vel|merged||player_id, tick|
|player_y_vel|merged||player_id, tick|
|player_z_vel|merged||player_id, tick|
|player_phi_ang|merged||player_id, tick|
|player_theta_ang|merged||player_id, tick|
|player_weapon_code|merged||player_id, tick|
|player_team_code|merged||player_id, tick|
|player_tick|merged||player_id, tick|
|player_player_id|merged||player_id, tick|
|missed_molotov|calculated|event_type-molotov_state, second-molotov_state||
