import { Task, TaskPriority, TaskStatus } from '@prisma/client';
import { activateTask, deleteTask, reorderTask, setTaskStatus } from '@/app/actions';

const statusLabel: Record<TaskStatus, string> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
  BLOCKED: 'Blocked'
};

const priorityTone: Record<TaskPriority, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-amber-100 text-amber-700'
};

export function TaskRow({ task, isActive }: { task: Task; isActive: boolean }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-slate-900">{task.title}</h3>
          <p className="mt-1 text-xs text-slate-500">{statusLabel[task.status]}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs ${priorityTone[task.priority]}`}>{task.priority.toLowerCase()}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <form action={activateTask}>
          <input type="hidden" name="id" value={task.id} />
          <button className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-50">{isActive ? 'Re-open estimate' : 'Work on this now'}</button>
        </form>
        <form action={setTaskStatus}>
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="status" value="DONE" />
          <button className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-50">Mark done</button>
        </form>
        <form action={reorderTask}>
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="direction" value="up" />
          <button className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-50">↑</button>
        </form>
        <form action={reorderTask}>
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="direction" value="down" />
          <button className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-50">↓</button>
        </form>
        <form action={deleteTask}>
          <input type="hidden" name="id" value={task.id} />
          <button className="rounded-md border border-rose-200 px-2 py-1 text-rose-700 hover:bg-rose-50">Delete</button>
        </form>
      </div>
    </article>
  );
}
