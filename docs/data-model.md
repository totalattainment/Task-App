# Data Model

## Schema overview
- `Task`
  - `id`
  - `title`
  - `status` (`NOT_STARTED | IN_PROGRESS | DONE | BLOCKED`)
  - `priority` (`LOW | MEDIUM | HIGH`)
  - `notes`
  - `createdAt`
  - `updatedAt`
  - `sortOrder`
- `AppState`
  - singleton row with `activeTaskId`
- `Estimate`
  - optional 1:1 record per task
  - `totalMinutes`
  - `isLarge`
  - `confidenceNote`
- `EstimateStep`
  - optional 1:N breakdown linked to task
  - `stepNumber`
  - `name`
  - `estimateMinutes`
  - `note`

## State rules
- Only one active task can exist (`AppState.activeTaskId`).
- Setting a task to done removes active assignment when relevant.
- Activating another task overwrites previous active id.

## Estimate visibility rules
- Estimates are computed and stored per task but rendered only inside active task panel.
- Main task rows intentionally exclude estimate fields.
- Re-opening estimate on a specific task is an explicit activation action.
