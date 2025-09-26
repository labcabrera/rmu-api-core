export type CriticalSeverity = 'A' | 'B' | 'C' | 'D' | 'E';

export interface PercentManeuverResult {
  percent: number;
  critical: CriticalSeverity | undefined;
  message: string;
}
