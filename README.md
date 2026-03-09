# Calm Task Manager (MVP)

A focused task management app built with Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite.

## Setup
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client and migrate:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```
4. Seed demo data:
   ```bash
   npm run prisma:seed
   ```
5. Start dev server:
   ```bash
   npm run dev
   ```

## Architecture summary
- `src/app/page.tsx`: dashboard composition and filter-driven list view
- `src/app/actions.ts`: server actions for CRUD, status updates, activation, and reordering
- `src/lib/estimator.ts`: deterministic estimate engine (modular for future AI replacement)
- `prisma/schema.prisma`: task, active state, estimate, and estimate step persistence

## Estimator behavior
- Heuristic-based from task wording + notes.
- Small tasks receive a single conservative total estimate.
- Large tasks (multi-part or likely >45 min) auto-generate structured steps.
- Estimates are shown only in active task panel.

## Seeded demo tasks
- One simple task
- One large in-progress task
- One done task
- One blocked task

## Future AI upgrade path
1. Replace `estimateTask` implementation with provider-backed service behind same return type.
2. Add calibration layer comparing predicted vs actual time.
3. Introduce optional user-adjusted estimate memory/profile.
