import { randomUUID } from 'crypto';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';
import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import { ValidationError } from '../../../shared/domain/errors/errors.js';
import {
  MANEUVER_MODIFIER_TYPES,
  type ManeuverModifierOption,
  type ManeuverModifierScope,
  type ManeuverModifierType,
} from '../value-objects/maneuver-modifier-type.vo.js';
import type { ManeuverModifierDefinition, ManeuverModifierProps } from './maneuver-modifier-props.js';

export type ManeuverModifierUpdate = Partial<ManeuverModifierDefinition> & { accessType?: AccessType };

/** Skill specific maneuver modifier of the catalog. */
export class ManeuverModifier extends BaseAggregateRoot<ManeuverModifierProps> {
  private constructor(
    id: string,
    public key: string,
    public scope: ManeuverModifierScope,
    public type: ManeuverModifierType,
    public value: number | undefined,
    public options: ManeuverModifierOption[] | undefined,
    public perUnit: number | undefined,
    public min: number | undefined,
    public max: number | undefined,
    public description: string | undefined,
    public owner: string,
    public accessType: AccessType,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {
    super(id);
  }

  static create(props: ManeuverModifierDefinition & { owner: string; accessType: AccessType }): ManeuverModifier {
    const definition = ManeuverModifier.normalize(props);
    ManeuverModifier.validate(definition);
    return ManeuverModifier.build({
      ...definition,
      id: randomUUID(),
      owner: props.owner,
      accessType: props.accessType,
      createdAt: new Date(),
      updatedAt: undefined,
    });
  }

  static fromProps(props: ManeuverModifierProps): ManeuverModifier {
    return ManeuverModifier.build(props);
  }

  private static build(props: ManeuverModifierProps): ManeuverModifier {
    return new ManeuverModifier(
      props.id,
      props.key,
      props.scope,
      props.type,
      props.value,
      props.options,
      props.perUnit,
      props.min,
      props.max,
      props.description,
      props.owner,
      props.accessType,
      props.createdAt,
      props.updatedAt,
    );
  }

  update(changes: ManeuverModifierUpdate): void {
    const current = this.getDefinition();
    const merged: ManeuverModifierDefinition = { ...current };
    (Object.keys(changes) as (keyof ManeuverModifierUpdate)[]).forEach(field => {
      if (field === 'accessType' || changes[field] === undefined) return;
      (merged as unknown as Record<string, unknown>)[field] = changes[field];
    });
    const definition = ManeuverModifier.normalize(merged);
    ManeuverModifier.validate(definition);
    this.key = definition.key;
    this.scope = definition.scope;
    this.type = definition.type;
    this.value = definition.value;
    this.options = definition.options;
    this.perUnit = definition.perUnit;
    this.min = definition.min;
    this.max = definition.max;
    this.description = definition.description;
    if (changes.accessType) this.accessType = changes.accessType;
    this.updatedAt = new Date();
  }

  /** True when the modifier applies to the skill or to its category. */
  appliesTo(skillId?: string, categoryId?: string): boolean {
    return (
      (!!skillId && (this.scope.skillIds ?? []).includes(skillId)) || (!!categoryId && (this.scope.categoryIds ?? []).includes(categoryId))
    );
  }

  getDefinition(): ManeuverModifierDefinition {
    return {
      key: this.key,
      scope: this.scope,
      type: this.type,
      value: this.value,
      options: this.options,
      perUnit: this.perUnit,
      min: this.min,
      max: this.max,
      description: this.description,
    };
  }

  getProps(): ManeuverModifierProps {
    return {
      id: this.id,
      ...this.getDefinition(),
      owner: this.owner,
      accessType: this.accessType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /** Keeps only the fields that apply to the modifier type. */
  static normalize(definition: ManeuverModifierDefinition): ManeuverModifierDefinition {
    const scope: ManeuverModifierScope = {};
    const skillIds = [...new Set(definition.scope?.skillIds ?? [])];
    const categoryIds = [...new Set(definition.scope?.categoryIds ?? [])];
    if (skillIds.length > 0) scope.skillIds = skillIds;
    if (categoryIds.length > 0) scope.categoryIds = categoryIds;
    const normalized: ManeuverModifierDefinition = { key: definition.key?.trim(), scope, type: definition.type };
    if (definition.description) normalized.description = definition.description;
    switch (definition.type) {
      case 'flag':
        normalized.value = definition.value;
        break;
      case 'choice':
        normalized.options = (definition.options ?? []).map(option => ({ key: option.key, value: option.value }));
        break;
      case 'number':
        normalized.perUnit = definition.perUnit;
        if (definition.min != null) normalized.min = definition.min;
        if (definition.max != null) normalized.max = definition.max;
        break;
    }
    return normalized;
  }

  static validate(definition: ManeuverModifierDefinition): void {
    if (!definition.key) throw new ValidationError('Maneuver modifier key is required');
    if (!definition.scope.skillIds?.length && !definition.scope.categoryIds?.length) {
      throw new ValidationError(`Maneuver modifier ${definition.key} needs at least one skillId or categoryId in its scope`);
    }
    if (!MANEUVER_MODIFIER_TYPES.includes(definition.type)) {
      throw new ValidationError(`Invalid maneuver modifier type ${String(definition.type)}`);
    }
    const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
    switch (definition.type) {
      case 'flag':
        if (!isNumber(definition.value)) throw new ValidationError(`Flag maneuver modifier ${definition.key} needs a value`);
        break;
      case 'choice': {
        const options = definition.options ?? [];
        if (options.length === 0) throw new ValidationError(`Choice maneuver modifier ${definition.key} needs at least one option`);
        if (options.some(option => !option.key || !isNumber(option.value))) {
          throw new ValidationError(`Choice maneuver modifier ${definition.key} options need a key and a value`);
        }
        if (new Set(options.map(option => option.key)).size !== options.length) {
          throw new ValidationError(`Choice maneuver modifier ${definition.key} has duplicated option keys`);
        }
        break;
      }
      case 'number':
        if (!isNumber(definition.perUnit)) throw new ValidationError(`Number maneuver modifier ${definition.key} needs perUnit`);
        if (definition.min != null && !isNumber(definition.min)) throw new ValidationError(`Invalid min in ${definition.key}`);
        if (definition.max != null && !isNumber(definition.max)) throw new ValidationError(`Invalid max in ${definition.key}`);
        if (definition.min != null && definition.max != null && definition.min > definition.max) {
          throw new ValidationError(`Number maneuver modifier ${definition.key} has min greater than max`);
        }
        break;
    }
  }
}
