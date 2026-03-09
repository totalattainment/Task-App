import { EstimateResult, EstimateStepInput } from '@/types/task';

const LARGE_KEYWORDS = ['plan', 'audit', 'rewrite', 'build', 'prepare', 'research', 'organise', 'organize', 'launch'];
const COMPOUND_HINTS = [' and ', ',', ':'];

function hasLargeSignals(text: string): boolean {
  return LARGE_KEYWORDS.some((keyword) => text.includes(keyword)) || COMPOUND_HINTS.some((hint) => text.includes(hint));
}

function stepTemplate(title: string): EstimateStepInput[] {
  const cleaned = title.toLowerCase();

  if (cleaned.includes('rewrite') || cleaned.includes('plan')) {
    return [
      { stepNumber: 1, name: 'Clarify outcome and constraints', estimateMinutes: 20, note: 'Confirm target audience and practical goal.' },
      { stepNumber: 2, name: 'Audit current material', estimateMinutes: 25, note: 'Mark what to remove, keep, or merge.' },
      { stepNumber: 3, name: 'Draft improved structure', estimateMinutes: 35, note: 'Write a concise first version with clear ordering.' },
      { stepNumber: 4, name: 'Polish and final checks', estimateMinutes: 20, note: 'Tighten language and verify completeness.' }
    ];
  }

  return [
    { stepNumber: 1, name: 'Prep and context review', estimateMinutes: 15, note: 'Gather required files and decisions.' },
    { stepNumber: 2, name: 'Execute core work', estimateMinutes: 30, note: 'Focus on the main deliverable without multitasking.' },
    { stepNumber: 3, name: 'Review and adjustments', estimateMinutes: 20, note: 'Fix issues and confirm quality.' }
  ];
}

export function estimateTask(title: string, notes?: string | null): EstimateResult {
  const source = `${title} ${notes ?? ''}`.toLowerCase();
  const wordCount = source.trim().split(/\s+/).filter(Boolean).length;
  const base = 15 + Math.min(wordCount * 2, 30);

  const large = base > 45 || hasLargeSignals(source);
  if (!large) {
    const totalMinutes = Math.ceil((base + 5) / 5) * 5;
    return {
      totalMinutes,
      isLarge: false,
      confidenceNote: 'Small focused task with a conservative buffer.',
      steps: []
    };
  }

  const steps = stepTemplate(title);
  const stepTotal = steps.reduce((sum, step) => sum + step.estimateMinutes, 0);
  const buffer = Math.max(10, Math.round(stepTotal * 0.15));

  return {
    totalMinutes: stepTotal + buffer,
    isLarge: true,
    confidenceNote: 'Large or multi-part task. Includes review and contingency buffer.',
    steps
  };
}
