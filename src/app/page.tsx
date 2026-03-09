import { addTask } from './actions';
import { prisma } from '@/lib/prisma';
import { ActiveTaskPanel } from '@/components/active-task-panel';
import { EditTaskForm } from '@/components/edit-task-form';
import { TaskRow } from '@/components/task-row';

interface HomeProps {
  searchParams: {
    status?: string;
    priority?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const statusFilter = searchParams.status;
  const priorityFilter = searchParams.priority;

  const tasks = await prisma.task.findMany({
    where: {
      ...(statusFilter && statusFilter !== 'ALL' ? { status: statusFilter as never } : {}),
      ...(priorityFilter && priorityFilter !== 'ALL' ? { priority: priorityFilter as never } : {})
    },
    orderBy: { sortOrder: 'asc' }
  });

  const appState = await prisma.appState.findUnique({ where: { id: 1 } });
  const activeTask = appState?.activeTaskId
    ? await prisma.task.findUnique({ where: { id: appState.activeTaskId } })
    : null;
  const activeEstimate = activeTask
    ? await prisma.estimate.findUnique({ where: { taskId: activeTask.id } })
    : null;
  const activeSteps = activeTask
    ? await prisma.estimateStep.findMany({ where: { taskId: activeTask.id }, orderBy: { stepNumber: 'asc' } })
    : [];

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Calm Task Manager</h1>
        <p className="mt-1 text-sm text-slate-500">Focus on one active task at a time. Estimates are private to the current task context.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <section>
          <form action={addTask} className="mb-4 flex gap-2">
            <input name="title" placeholder="Add a task…" className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" required />
            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Add</button>
          </form>

          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            <a className="rounded-md border border-slate-300 bg-white px-2 py-1" href="/?status=ALL&priority=ALL">All</a>
            <a className="rounded-md border border-slate-300 bg-white px-2 py-1" href="/?status=NOT_STARTED&priority=ALL">Not started</a>
            <a className="rounded-md border border-slate-300 bg-white px-2 py-1" href="/?status=IN_PROGRESS&priority=ALL">In progress</a>
            <a className="rounded-md border border-slate-300 bg-white px-2 py-1" href="/?status=BLOCKED&priority=ALL">Blocked</a>
            <a className="rounded-md border border-slate-300 bg-white px-2 py-1" href="/?status=ALL&priority=HIGH">High priority</a>
          </div>

          <div className="space-y-3">
            {tasks.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                No tasks in this view. Add a task or change filters.
              </div>
            )}
            {tasks.map((task) => (
              <div key={task.id} className="space-y-2">
                <TaskRow task={task} isActive={task.id === activeTask?.id} />
                <EditTaskForm task={task} />
              </div>
            ))}
          </div>
        </section>

        <ActiveTaskPanel task={activeTask} estimate={activeEstimate} steps={activeSteps} />
      </div>
    </main>
  );
}
