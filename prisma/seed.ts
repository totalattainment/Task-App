import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.estimateStep.deleteMany();
  await prisma.estimate.deleteMany();
  await prisma.task.deleteMany();
  await prisma.appState.upsert({
    where: { id: 1 },
    update: { activeTaskId: null },
    create: { id: 1, activeTaskId: null }
  });

  const tasks = await prisma.task.createMany({
    data: [
      {
        title: 'Reply to landlord about maintenance access',
        notes: 'Keep it short and propose two time windows.',
        status: TaskStatus.NOT_STARTED,
        priority: TaskPriority.MEDIUM,
        sortOrder: 1
      },
      {
        title: 'Plan and rewrite onboarding checklist for new hires',
        notes: 'Focus on first-week clarity and remove outdated tools.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        sortOrder: 2
      },
      {
        title: 'Archive old utility bills',
        notes: 'Done last night.',
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
        sortOrder: 3
      },
      {
        title: 'Submit reimbursement form',
        notes: 'Waiting on missing receipt.',
        status: TaskStatus.BLOCKED,
        priority: TaskPriority.MEDIUM,
        sortOrder: 4
      }
    ]
  });

  const inProgress = await prisma.task.findFirst({ where: { status: TaskStatus.IN_PROGRESS } });
  if (inProgress) {
    await prisma.appState.update({
      where: { id: 1 },
      data: { activeTaskId: inProgress.id }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
