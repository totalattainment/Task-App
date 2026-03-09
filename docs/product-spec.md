# Product Spec: Calm Task Manager MVP

## App concept
Calm Task Manager is a lightweight single-user task system built around one active task at a time. It supports fast capture, clean prioritization, and contextual effort planning that appears only when needed.

## Target user
An individual contributor who juggles practical work and wants structured focus without noisy productivity features.

## Problem solved
Most task tools expose effort estimates globally, making every list visually heavy. This MVP keeps estimates private to active work so the list stays clean.

## Core rules
1. Exactly one active task at any time.
2. Estimates never appear across the full task list.
3. Estimates appear only when the user activates a task or explicitly opens estimate/work actions.
4. Large tasks (>45 minutes or multi-part) are broken into steps.
5. Completing a task clears active state.
6. Activating a new task replaces the previous active task.

## MVP scope
- Add, edit, rename, delete tasks
- Status + priority management
- Notes per task
- Reorder list manually
- Filter by status or priority
- Local persistence with Prisma + SQLite
- Deterministic estimator for active task only
- Automatic breakdown for large tasks

## Future enhancements
- Keyboard command bar
- Import/export JSON
- LLM-backed estimator service with confidence calibration
- Weekly review and archive flow
