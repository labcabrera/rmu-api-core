import { randomUUID } from 'crypto';
import { CultureUpdatedEvent } from '../events/culture-updated.event';
import { BaseAggregateRoot } from 'src/modules/shared/domain/aggregates/base-aggregate';
import { CreateCultureProps, CultureProps } from './culture-props';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { CultureCreatedEvent } from '../events/culture-created.event';
import { CultureSkillRank } from '../value-objects/culture-skill-rank';

export class Culture extends BaseAggregateRoot<CultureProps> {
  private constructor(
    id: string,
    public name: string,
    public description: string | null,
    public imageUrl: string | null,
    public owner: string,
    public accessType: AccessType,
    public fixedSkillRanks: CultureSkillRank[],
    public readonly createdAt: Date,
    public updatedAt: Date | null,
  ) {
    super(id);
  }

  static create(props: CreateCultureProps): Culture {
    const aggregate = new Culture(
      randomUUID(),
      props.name,
      props.description,
      props.imageUrl,
      props.owner,
      props.accessType,
      props.fixedSkillRanks ?? [],
      new Date(),
      null,
    );
    aggregate.apply(new CultureCreatedEvent(aggregate.getProps()));
    return aggregate;
  }

  static fromProps(props: CultureProps) {
    return new Culture(
      props.id,
      props.name,
      props.description,
      props.imageUrl,
      props.owner,
      props.accessType,
      props.fixedSkillRanks ?? [],
      props.createdAt,
      props.updatedAt,
    );
  }

  update(props: Partial<Omit<CultureProps, 'id' | 'createdAt' | 'updatedAt' | 'realm' | 'owner'>>) {
    if (props.name) this.name = props.name;
    if (props.description !== undefined) this.description = props.description;
    if (props.imageUrl !== undefined) this.imageUrl = props.imageUrl;
    if (props.fixedSkillRanks !== undefined) this.fixedSkillRanks = props.fixedSkillRanks;
    this.updatedAt = new Date();
    this.apply(new CultureUpdatedEvent(this.getProps()));
  }

  getProps(): CultureProps {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      owner: this.owner,
      accessType: this.accessType,
      fixedSkillRanks: this.fixedSkillRanks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as CultureProps;
  }
}
