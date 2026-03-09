export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface EstimateStepInput {
  stepNumber: number;
  name: string;
  estimateMinutes: number;
  note: string;
}

export interface EstimateResult {
  totalMinutes: number;
  isLarge: boolean;
  confidenceNote: string;
  steps: EstimateStepInput[];
}
