# Video Game Data Science (VGDS): A Standardized way to Save Video Game Gameplay Datasets

## Abstract

Analyzing how people compete has been a hot topic for many years with the most publicized example being Moneyball in baseball.

Since video games are digital, extracting player telemetry data is 

Here, we introduce a standardized way to save 

## Introduction

### Why Video Games?
Ever since the data was available, analyists have been analyzing how people compete.
### Video Game Replay Files
Many modern, competitive video games have a server-recorded replay where a entire match can be 
### Extracting Data From Replay Files
Games that have a replay file available, generally save that file in a specific format. This format is usually specific to the engine used to run the game such as Source for games made by Valve and Unreal for games made by Epic. These replay files are not video recordings of the match, but rather data that the game engine can use to render an accurate replay of what happened during a match.

Game developers can choose to support or not support a replay system. We are at their mercy in this regard. But for game developers who do support a replay system, they enable a way to extract player actions from the game in a way that formats like screen recording can't come close to. Rather than inferring properties of the game through video, a true replay allows for an exact data extraction of what happened during the match. 

### Standardizing the extraction


## VGDS Format

### Definition

### VGDS for Counter-Strike:Global Offensive - CSDS

### VGDS for Rocket League - RLDS


## The CSDS Dataset from PureSkill.gg


## Appendix

### Links



### Game Replay Filetype and Game Engines

| Game      | Replay Filetype | Game Engine |
| ----------- | ----------- | ---- |
| Counter-Strike:Global Offensive      | .dem       | Source 1 |
| DOTA 2   | .dem        | Source 2 |
| League of Legends   | .ROFL | Propriteary |
| Fortnite   | .?? | Unreal 4 |
| Rocket League   | .replay | Unreal 4 |
| Apex Legends | TBD | Source 1 |
| Starcraft II |  |  |