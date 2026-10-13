# Shared machine resources

Edited only by `scripts/agent-resource.ps1`, only in the primary checkout, never committed (AGENTS.md: claim shared machine resources).
A claim is free once its check-out time has passed.

| resource | what it covers | held by | checked in | check out | for |
| --- | --- | --- | --- | --- | --- |
| cs2 | CS2, for clip rendering (tools/clip-pilot) |  |  |  |  |
| d-drive | Large scans of the D: archive and tomes |  |  |  |  |
| regression | The canonical regression data root: corpus refreshes, and runs from worktrees older than the slots |  |  |  |  |
| regression-1 | Regression slot 1 (regression_slots\1): one harness run | docs | 2026-10-12 7:43 PM | 2026-10-12 11:44 PM | rushb-smoke-volume: rushb gate, corpus parse diff, ppp + coach harness |
| regression-2 | Regression slot 2 (regression_slots\2): one harness run |  |  |  |  |
| regression-3 | Regression slot 3 (regression_slots\3): one harness run |  |  |  |  |
| docker | Docker Desktop: starting, using or quitting it |  |  |  |  |
| benchmark | Timing benchmarks, which need a quiet machine |  |  |  |  |
