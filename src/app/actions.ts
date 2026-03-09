'use server';

import { revalidatePath } from 'next/cache';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { estimateTask } from '@/lib/estimator';

function refresh() {
  revalidatePath('/');
}

export async function addTask(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  if (!title) return;

  const maxOrder = await prisma.task.aggregate({ _max: { sortOrder: true } });
  await prisma.task.create({
    data: {
      title,
      status: TaskStatus.NOT_STARTED,
      priority: TaskPriority.MEDIUM,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1
    }
  });
  refresh();
}

export async function updateTask(formData: FormData) {
  const id = String(formData.get('id'));
  const title = String(formData.get('title')).trim();
  const notes = String(formData.get('notes') ?? '').trim();
  const status = String(formData.get('status')) as TaskStatus;
  const priority = String(formData.get('priority')) as TaskPriority;

  await prisma.task.update({
    where: { id },
    data: { title, notes: notes || null, status, priority }
  });

  if (status === TaskStatus.DONE) {
    await prisma.appState.upsert({ where: { id: 1 }, update: { activeTaskId: null }, create: { id: 1, activeTaskId: null } });
  }

  refresh();
}

export async function deleteTask(formData: FormData) {
  const id = String(formData.get('id'));
  await prisma.task.delete({ where: { id } });
  const state = await prisma.appState.findUnique({ where: { id: 1 } });
  if (state?.activeTaskId === id) {
    await prisma.appState.update({ where: { id: 1 }, data: { activeTaskId: null } });
  }
  refresh();
}

export async function activateTask(formData: FormData) {
  const id = String(formData.get('id'));
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return;

  const estimate = estimateTask(task.title, task.notes);

  await prisma.$transaction([
    prisma.task.update({ where: { id }, data: { status: task.status === TaskStatus.DONE ? TaskStatus.NOT_STARTED : TaskStatus.IN_PROGRESS } }),
    prisma.appState.upsert({ where: { id: 1 }, update: { activeTaskId: id }, create: { id: 1, activeTaskId: id } }),
    prisma.estimate.upsert({
      where: { taskId: id },
      update: {
        totalMinutes: estimate.totalMinutes,
        isLarge: estimate.isLarge,
        confidenceNote: estimate.confidenceNote
      },
      create: {
        taskId: id,
        totalMinutes: estimate.totalMinutes,
        isLarge: estimate.isLarge,
        confidenceNote: estimate.confidenceNote
      }
    }),
    prisma.estimateStep.deleteMany({ where: { taskId: id } }),
    ...(estimate.steps.length
      ? [
          prisma.estimateStep.createMany({
            data: estimate.steps.map((step) => ({
              taskId: id,
              stepNumber: step.stepNumber,
              name: step.name,
              estimateMinutes: step.estimateMinutes,
              note: step.note
            }))
          })
        ]
      : [])
  ]);

  refresh();
}

export async function clearActiveTask() {
  await prisma.appState.upsert({ where: { id: 1 }, update: { activeTaskId: null }, create: { id: 1, activeTaskId: null } });
  refresh();
}

export async function setTaskStatus(formData: FormData) {
  const id = String(formData.get('id'));
  const status = String(formData.get('status')) as TaskStatus;

  await prisma.task.update({ where: { id }, data: { status } });
  if (status === TaskStatus.DONE) {
    const state = await prisma.appState.findUnique({ where: { id: 1 } });
    if (state?.activeTaskId === id) {
      await prisma.appState.update({ where: { id: 1 }, data: { activeTaskId: null } });
    }
  }
  refresh();
}

export async function reorderTask(formData: FormData) {
  const id = String(formData.get('id'));
  const direction = String(formData.get('direction'));
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return;

  const swap = await prisma.task.findFirst({
    where: direction === 'up' ? { sortOrder: { lt: task.sortOrder } } : { sortOrder: { gt: task.sortOrder } },
    orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' }
  });

  if (!swap) return;

  await prisma.$transaction([
    prisma.task.update({ where: { id: task.id }, data: { sortOrder: swap.sortOrder } }),
    prisma.task.update({ where: { id: swap.id }, data: { sortOrder: task.sortOrder } })
  ]);

  refresh();
}
