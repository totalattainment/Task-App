import { Estimate, EstimateStep, Task } from '@prisma/client';
import { clearActiveTask, setTaskStatus } from '@/app/actions';

export function ActiveTaskPanel({
  task,
  estimate,
  steps
}: {
  task: Task | null;
  estimate: Estimate | null;
  steps: EstimateStep[];
}) {
  if (!task) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-700">No active task</h2>
        <p className="mt-2 text-sm text-slate-500">Select any task with “Work on this now” to reveal a private estimate and structured next steps.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-xs uppercase tracking-wide text-accent">Active task</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-900">{task.title}</h2>
      {estimate && (
        <>
          <p className="mt-3 text-sm text-slate-700">
            Estimated total: <span className="font-semibold">{estimate.totalMinutes} minutes</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">{estimate.confidenceNote}</p>
        </>
      )}
      {steps.length > 0 && (
        <ol className="mt-4 space-y-2">
          {steps.map((step) => (
            <li key={step.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-800">
                {step.stepNumber}. {step.name} <span className="font-normal text-slate-500">({step.estimateMinutes} min)</span>
              </p>
              <p className="text-xs text-slate-500">{step.note}</p>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-5 flex gap-2 text-xs">
        <form action={setTaskStatus}>
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="status" value="DONE" />
          <button className="rounded-md bg-slate-900 px-3 py-1.5 text-white">Mark done</button>
        </form>
        <form action={setTaskStatus}>
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="status" value="BLOCKED" />
          <button className="rounded-md border border-slate-300 px-3 py-1.5">Blocked</button>
        </form>
        <form action={clearActiveTask}>
          <button className="rounded-md border border-slate-300 px-3 py-1.5">Pause / unselect</button>
        </form>
      </div>
      {task.notes && <p className="mt-4 text-sm text-slate-600">{task.notes}</p>}
    </section>
  );
}
