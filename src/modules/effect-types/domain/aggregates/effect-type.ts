import { BaseAggregateRoot } from 'src/modules/shared/domain/aggregates/base-aggregate';
import { NotModifiedError } from 'src/modules/shared/domain/errors/errors';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { EntitySource } from 'src/modules/shared/domain/entities/entity-source';
import { EffectPropertyRequirement } from '../value-objects/effect-property-requirement.vo';
import { EffectTypeProps } from './effect-type-props';

export class EffectType extends BaseAggregateRoot<EffectTypeProps> {
  private constructor(
    id: string,
    public isPersistent: boolean,
    public value: EffectPropertyRequirement,
    public modifier: EffectPropertyRequirement,
    public rounds: EffectPropertyRequirement,
    public text: EffectPropertyRequirement,
    public location: EffectPropertyRequirement,
    public delay: EffectPropertyRequirement,
    public owner: string,
    public accessType: AccessType,
    public entitySource: EntitySource,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {
    super(id);
  }

  static create(props: Omit<EffectTypeProps, 'createdAt' | 'updatedAt'>) {
    return new EffectType(
      props.id,
      props.isPersistent,
      props.value,
      props.modifier,
      props.rounds,
      props.text,
      props.location,
      props.delay,
      props.owner,
      props.accessType,
      props.entitySource,
      new Date(),
      undefined,
    );
  }

  static fromProps(props: EffectTypeProps) {
    return new EffectType(
      props.id,
      props.isPersistent,
      props.value,
      props.modifier,
      props.rounds,
      props.text,
      props.location,
      props.delay,
      props.owner,
      props.accessType,
      props.entitySource,
      props.createdAt,
      props.updatedAt,
    );
  }

  update(props: Omit<Partial<EffectTypeProps>, 'id' | 'createdAt' | 'updatedAt' | 'owner' | 'entitySource'>) {
    let modified = false;

    if (props.isPersistent !== undefined) {
      modified = this.isPersistent !== props.isPersistent;
      this.isPersistent = props.isPersistent;
    }
    if (props.value !== undefined) {
      modified = modified || this.value !== props.value;
      this.value = props.value;
    }
    if (props.modifier !== undefined) {
      modified = modified || this.modifier !== props.modifier;
      this.modifier = props.modifier;
    }
    if (props.rounds !== undefined) {
      modified = modified || this.rounds !== props.rounds;
      this.rounds = props.rounds;
    }
    if (props.text !== undefined) {
      modified = modified || this.text !== props.text;
      this.text = props.text;
    }
    if (props.location !== undefined) {
      modified = modified || this.location !== props.location;
      this.location = props.location;
    }
    if (props.delay !== undefined) {
      modified = modified || this.delay !== props.delay;
      this.delay = props.delay;
    }
    if (props.accessType !== undefined) {
      modified = modified || this.accessType !== props.accessType;
      this.accessType = props.accessType;
    }

    if (!modified) throw new NotModifiedError('No changes detected');
    this.updatedAt = new Date();
  }

  public getProps(): EffectTypeProps {
    return {
      id: this.id,
      isPersistent: this.isPersistent,
      value: this.value,
      modifier: this.modifier,
      rounds: this.rounds,
      text: this.text,
      location: this.location,
      delay: this.delay,
      owner: this.owner,
      accessType: this.accessType,
      entitySource: this.entitySource,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
