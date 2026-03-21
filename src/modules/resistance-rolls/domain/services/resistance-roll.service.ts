import { KeyValue } from 'src/modules/shared/domain/entities/key-value';
import { ResistanceRollQuery } from '../../application/cqrs/queries/resistance-roll.query';
import { ResistanceRollResult, ResistanceRollResultCode } from '../value-objects/resistance-roll-result';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResistanceRollService {
  execute(query: ResistanceRollQuery): ResistanceRollResult {
    const modifiers = [] as KeyValue[];
    if (query.modifiers) {
      query.modifiers.forEach((mod) => modifiers.push({ key: mod.key, value: mod.value }));
    }
    modifiers.push({ key: 'attack-level', value: -query.attackLevel * 2 });
    modifiers.push({ key: 'target-level', value: query.targetLevel * 2 });
    modifiers.push({ key: 'roll', value: query.roll });
    const totalResult = modifiers.reduce((sum, mod) => sum + mod.value, 0);
    const failure = Math.max(0, 50 - totalResult);
    let result: ResistanceRollResultCode = 'success';
    if (failure > 100) {
      result = 'extreme-failure';
    } else if (failure > 50) {
      result = 'severe-failure';
    } else if (failure > 25) {
      result = 'moderate-failure';
    } else if (failure > 0) {
      result = 'mild-failure';
    }
    return new ResistanceRollResult(result, modifiers, totalResult, failure);
  }
}
