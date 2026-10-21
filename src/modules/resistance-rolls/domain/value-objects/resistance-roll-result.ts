import { KeyValue } from '../../../shared/domain/entities/key-value';

export type ResistanceRollResultCode = 'success' | 'mild-failure' | 'moderate-failure' | 'severe-failure' | 'extreme-failure';

export class ResistanceRollResult {
  constructor(
    public readonly result: ResistanceRollResultCode,
    public readonly modifiers: KeyValue[],
    public readonly totalResult: number,
    public readonly failure: number,
  ) {}
}
