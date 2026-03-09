import { Task } from '@prisma/client';
import { updateTask } from '@/app/actions';

export function EditTaskForm({ task }: { task: Task }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer text-sm font-medium text-slate-700">Edit task</summary>
      <form action={updateTask} className="mt-3 space-y-2">
        <input type="hidden" name="id" value={task.id} />
        <input name="title" defaultValue={task.title} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
        <textarea name="notes" defaultValue={task.notes ?? ''} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={3} />
        <div className="grid grid-cols-2 gap-2">
          <select name="status" defaultValue={task.status} className="rounded-md border border-slate-300 px-2 py-2 text-sm">
            <option value="NOT_STARTED">Not started</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
            <option value="BLOCKED">Blocked</option>
          </select>
          <select name="priority" defaultValue={task.priority} className="rounded-md border border-slate-300 px-2 py-2 text-sm">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <button className="rounded-md bg-slate-900 px-3 py-2 text-xs text-white">Save changes</button>
      </form>
    </details>
  );
}
