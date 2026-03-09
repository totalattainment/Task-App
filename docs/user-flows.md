# User Flows

## 1) Add task
1. User types title in quick input.
2. Task is inserted at the bottom with default status `not started` and priority `medium`.
3. No estimate shown in list.

## 2) Activate task
1. User clicks **Work on this now**.
2. Task status becomes `in progress` (unless already done).
3. Active task id updates globally.
4. Estimate panel opens for this task.

## 3) Estimate active task
1. App runs deterministic estimator on title + notes.
2. If small, show conservative total minutes.
3. If large, generate 3–7 steps with estimate and note.
4. Only active panel reveals this output.

## 4) Complete task
1. User clicks **Mark done** from row or active panel.
2. Status updates to `done`.
3. If task was active, active state clears.
4. Estimate disappears from dashboard context.

## 5) Switch active task
1. User activates a different task.
2. App replaces active task id.
3. Prior task estimate is no longer visible.
4. New active panel shows newly generated estimate.

## 6) Filter and reorder tasks
1. User selects filter chips by status or priority.
2. List updates instantly through URL query state.
3. Up/down actions swap sort order between adjacent tasks.
