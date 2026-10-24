import { RaceTrait } from '../value-objects/race-trait.vo.js';
import { RaceCreatedEvent } from '../events/race-created.event.js';
import { randomUUID } from 'crypto';
import { RaceUpdatedEvent } from '../events/race-updated.event.js';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';
import type { RaceProps } from './race-props.js';
import { RaceSkillBonus } from '../value-objects/race-skill-bonus.vo.js';
import { NotFoundError } from '../../../shared/domain/errors/errors.js';

export class Race extends BaseAggregateRoot<RaceProps> {
  private constructor(props: RaceProps) {
    super(props);
  }

  get name() {
    return this.props.name;
  }

  get archetype() {
    return this.props.archetype;
  }

  get realmId() {
    return this.props.realmId;
  }

  get sizeId() {
    return this.props.sizeId;
  }

  get stats() {
    return this.props.stats;
  }

  get resistances() {
    return this.props.resistances;
  }

  get averageHeight() {
    return this.props.averageHeight;
  }

  get averageWeight() {
    return this.props.averageWeight;
  }

  get strideBonus() {
    return this.props.strideBonus;
  }

  get enduranceBonus() {
    return this.props.enduranceBonus;
  }

  get recoveryMultiplier() {
    return this.props.recoveryMultiplier;
  }

  get baseHits() {
    return this.props.baseHits;
  }

  get baseDevPoints() {
    return this.props.baseDevPoints;
  }

  get baseAt() {
    return this.props.baseAt;
  }

  get talents() {
    return this.props.talents;
  }

  get traits() {
    return this.props.traits;
  }

  get skillBonuses() {
    return this.props.skillBonuses;
  }

  get defaultLanguage() {
    return this.props.defaultLanguage;
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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Omit<RaceProps, 'id' | 'createdAt' | 'updatedAt'>) {
    const race = new Race({ ...props, id: randomUUID(), createdAt: new Date(), updatedAt: null });
    race.apply(new RaceCreatedEvent(race.getProps()));
    return race;
  }

  // Sub-entity changes replace the arrays instead of mutating them, so earlier event snapshots keep their state.
  addTrait(
    traitId: string,
    specialization: string | undefined,
    isTalent: boolean,
    tier: number | undefined,
    description: string | undefined,
  ) {
    this.changed({ traits: [...this.props.traits, new RaceTrait(randomUUID(), traitId, specialization, isTalent, tier, description)] });
  }

  removeTrait(traitId: string) {
    if (!this.props.traits.some(trait => trait.id === traitId)) throw new NotFoundError('Race trait', traitId);
    this.changed({ traits: this.props.traits.filter(trait => trait.id !== traitId) });
  }

  /** Sets the bonus of a skill and specialization, adding the entry when the race does not have it. */
  addSkillBonus(skillId: string, specialization: string | null, bonus: number) {
    const others = this.props.skillBonuses.filter(sb => !(sb.skillId === skillId && sb.specialization === specialization));
    const index = this.props.skillBonuses.findIndex(sb => sb.skillId === skillId && sb.specialization === specialization);
    const entry = new RaceSkillBonus(skillId, specialization, bonus);
    const skillBonuses = index === -1 ? [...others, entry] : [...others.slice(0, index), entry, ...others.slice(index)];
    this.changed({ skillBonuses });
  }

  removeSkillBonus(skillId: string, specialization: string | null) {
    const matches = (sb: RaceSkillBonus) =>
      sb.skillId === skillId && (sb.specialization === specialization || (!sb.specialization && !specialization));
    if (!this.props.skillBonuses.some(matches)) throw new NotFoundError('Race skill bonus', skillId);
    this.changed({ skillBonuses: this.props.skillBonuses.filter(sb => !matches(sb)) });
  }

  private changed(changes: Partial<RaceProps>) {
    this.props = { ...this.props, ...changes, updatedAt: new Date() };
    this.apply(new RaceUpdatedEvent(this.getProps()));
  }

  static fromProps(props: RaceProps) {
    return new Race({ ...props });
  }

  update(props: Partial<Omit<RaceProps, 'id' | 'createdAt' | 'updatedAt' | 'owner'>>) {
    if (props.name) this.props.name = props.name;
    if (props.archetype) this.props.archetype = props.archetype;
    if (props.sizeId) this.props.sizeId = props.sizeId;
    if (props.stats) this.props.stats = props.stats;
    if (props.resistances) this.props.resistances = props.resistances;
    if (props.averageHeight) this.props.averageHeight = props.averageHeight;
    if (props.averageWeight) this.props.averageWeight = props.averageWeight;
    if (props.strideBonus !== undefined) this.props.strideBonus = props.strideBonus;
    if (props.enduranceBonus !== undefined) this.props.enduranceBonus = props.enduranceBonus;
    if (props.recoveryMultiplier !== undefined) this.props.recoveryMultiplier = props.recoveryMultiplier;
    if (props.baseHits !== undefined) this.props.baseHits = props.baseHits;
    if (props.baseDevPoints !== undefined) this.props.baseDevPoints = props.baseDevPoints;
    if (props.baseAt !== undefined) this.props.baseAt = props.baseAt;
    if (props.defaultLanguage !== undefined) this.props.defaultLanguage = props.defaultLanguage;
    if (props.talents) this.props.talents = props.talents;
    if (props.traits) this.props.traits = props.traits;
    if (props.description !== undefined) this.props.description = props.description;
    if (props.imageUrl !== undefined) this.props.imageUrl = props.imageUrl;
    // A change without effect keeps the stored updatedAt: the handler neither writes nor publishes it.
    if (this.hasChanges()) this.props.updatedAt = new Date();
    this.apply(new RaceUpdatedEvent(this.getProps()));
  }
}
