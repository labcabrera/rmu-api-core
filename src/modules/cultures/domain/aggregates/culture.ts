import { randomUUID } from 'crypto';
import { CultureUpdatedEvent } from '../events/culture-updated.event';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate';
import { CreateCultureProps, CultureProps, UpdateCultureProps } from './culture-props';
import { AccessType } from '../../../shared/domain/entities/access-type';
import { CultureCreatedEvent } from '../events/culture-created.event';
import { CultureSkillRank } from '../value-objects/culture-skill-rank';
import { NotFoundError } from '../../../shared/domain/errors/errors';

export class Culture extends BaseAggregateRoot<CultureProps> {
  private constructor(
    id: string,
    public name: string,
    public description: string | null,
    public imageUrl: string | null,
    public owner: string,
    public accessType: AccessType,
    public skillRanks: CultureSkillRank[],
    public languages: string[] | undefined,
    public suggestedCrafts: string | undefined,
    public suggestedVocations: string | undefined,
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
      props.skillRanks ?? [],
      props.languages,
      props.suggestedCrafts,
      props.suggestedVocations,
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
      props.skillRanks ?? [],
      props.languages,
      props.suggestedCrafts,
      props.suggestedVocations,
      props.createdAt,
      props.updatedAt,
    );
  }

  update(props: UpdateCultureProps) {
    if (props.name) this.name = props.name;
    if (props.description !== undefined) this.description = props.description;
    if (props.imageUrl !== undefined) this.imageUrl = props.imageUrl;
    if (props.skillRanks !== undefined) this.skillRanks = props.skillRanks;
    if (props.languages !== undefined) this.languages = props.languages;
    if (props.suggestedCrafts !== undefined) this.suggestedCrafts = props.suggestedCrafts;
    if (props.suggestedVocations !== undefined) this.suggestedVocations = props.suggestedVocations;
    this.updatedAt = new Date();
    this.apply(new CultureUpdatedEvent(this.getProps()));
  }

  /** Appends an entry at the end of `skillRanks`. */
  addSkillRank(skillRank: CultureSkillRank) {
    this.skillRanks = [...this.skillRanks, skillRank];
    this.updatedAt = new Date();
    this.apply(new CultureUpdatedEvent(this.getProps()));
  }

  /** Removes the entry at `index` (0-based position in `skillRanks`). */
  deleteSkillRank(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= this.skillRanks.length) {
      throw new NotFoundError('Culture skill rank', index);
    }
    this.skillRanks = this.skillRanks.filter((_, i) => i !== index);
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
      skillRanks: this.skillRanks,
      languages: this.languages,
      suggestedCrafts: this.suggestedCrafts,
      suggestedVocations: this.suggestedVocations,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
