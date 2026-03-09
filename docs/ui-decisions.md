# UI Decisions

## Layout decisions
- Two-column dashboard on desktop: list left, active context right.
- Single column stack on smaller screens for readability.
- Soft borders, neutral background, minimal accent to reduce cognitive load.

## Component hierarchy
- `Dashboard`
  - `AddTaskInput`
  - `FilterChips`
  - `TaskList`
    - `TaskRow`
    - `EditTaskForm`
  - `ActiveTaskPanel`

## Why hide estimates except active tasks
- Keeps backlog scanning fast and uncluttered.
- Prevents estimates from becoming noisy pseudo-deadlines.
- Encourages clear execution focus: choose one task, then inspect estimate details.
- Supports privacy/context: estimate appears only when user is intentionally engaging a task.
