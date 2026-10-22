import { randomUUID } from 'crypto';
import { CultureUpdatedEvent } from '../events/culture-updated.event.js';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';
import type { CreateCultureProps, CultureProps, UpdateCultureProps } from './culture-props.js';
import { CultureCreatedEvent } from '../events/culture-created.event.js';
import { CultureSkillRank } from '../value-objects/culture-skill-rank.js';
import { NotFoundError } from '../../../shared/domain/errors/errors.js';

export class Culture extends BaseAggregateRoot<CultureProps> {
  private constructor(props: CultureProps) {
    super(props);
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get imageUrl() {
    return this.props.imageUrl;
  }

  get owner() {
    return this.props.owner;
  }

  get accessType() {
    return this.props.accessType;
  }

  get skillRanks() {
    return this.props.skillRanks;
  }

  get languages() {
    return this.props.languages;
  }

  get suggestedCrafts() {
    return this.props.suggestedCrafts;
  }

  get suggestedVocations() {
    return this.props.suggestedVocations;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: CreateCultureProps): Culture {
    const aggregate = new Culture({
      ...props,
      id: randomUUID(),
      skillRanks: props.skillRanks ?? [],
      createdAt: new Date(),
      updatedAt: null,
    });
    aggregate.apply(new CultureCreatedEvent(aggregate.getProps()));
    return aggregate;
  }

  static fromProps(props: CultureProps) {
    return new Culture({ ...props, skillRanks: props.skillRanks ?? [] });
  }

  update(props: UpdateCultureProps) {
    if (props.name) this.props.name = props.name;
    if (props.description !== undefined) this.props.description = props.description;
    if (props.imageUrl !== undefined) this.props.imageUrl = props.imageUrl;
    if (props.accessType !== undefined) this.props.accessType = props.accessType;
    if (props.skillRanks !== undefined) this.props.skillRanks = props.skillRanks;
    if (props.languages !== undefined) this.props.languages = props.languages;
    if (props.suggestedCrafts !== undefined) this.props.suggestedCrafts = props.suggestedCrafts;
    if (props.suggestedVocations !== undefined) this.props.suggestedVocations = props.suggestedVocations;
    this.props.updatedAt = new Date();
    this.apply(new CultureUpdatedEvent(this.getProps()));
  }

  /** Appends an entry at the end of `skillRanks`. */
  addSkillRank(skillRank: CultureSkillRank) {
    this.props.skillRanks = [...this.props.skillRanks, skillRank];
    this.props.updatedAt = new Date();
    this.apply(new CultureUpdatedEvent(this.getProps()));
  }

  /** Removes the entry at `index` (0-based position in `skillRanks`). */
  deleteSkillRank(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= this.props.skillRanks.length) {
      throw new NotFoundError('Culture skill rank', index);
    }
    this.props.skillRanks = this.props.skillRanks.filter((_, i) => i !== index);
    this.props.updatedAt = new Date();
    this.apply(new CultureUpdatedEvent(this.getProps()));
  }
}
