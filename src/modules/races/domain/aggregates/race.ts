import { RaceResistances } from '../value-objects/race-resistances.vo';
import { RaceStats } from '../value-objects/race-stats.vo';
import { SexBasedAttribute } from '../value-objects/sex-based-attribute.vo';
import { RaceTrait } from '../value-objects/race-trait.vo';
import { AggregateRoot } from '@nestjs/cqrs';
import { RaceCreatedEvent } from '../events/race-created.event';
import { randomUUID } from 'crypto';
import { RaceUpdatedEvent } from '../events/race-updated.event';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';

export interface RaceProps {
  id: string;
  archetype: string;
  name: string;
  realmId: string;
  realmName: string;
  sizeId: string;
  stats: RaceStats;
  resistances: RaceResistances;
  averageHeight: SexBasedAttribute;
  averageWeight: SexBasedAttribute;
  strideBonus: number;
  enduranceBonus: number;
  recoveryMultiplier: number;
  baseHits: number;
  baseDevPoints: number;
  baseAt: number;
  defaultLanguage?: string;
  talents: string[];
  raceTraits: RaceTrait[];
  description?: string;
  imageUrl?: string;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Race extends AggregateRoot<DomainEvent<RaceProps>> {
  private constructor(
    public readonly id: string,
    public name: string,
    public archetype: string,
    public readonly realmId: string,
    public realmName: string,
    public sizeId: string,
    public stats: RaceStats,
    public resistances: RaceResistances,
    public averageHeight: SexBasedAttribute,
    public averageWeight: SexBasedAttribute,
    public strideBonus: number,
    public enduranceBonus: number,
    public recoveryMultiplier: number,
    public baseHits: number,
    public baseDevPoints: number,
    public baseAt: number,
    public defaultLanguage: string | undefined,
    public talents: string[],
    public raceTraits: RaceTrait[],
    public description: string | undefined,
    public imageUrl: string | undefined,
    public owner: string,
    public readonly createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super();
  }

  static create(props: Omit<RaceProps, 'id' | 'createdAt' | 'updatedAt'>) {
    const race = new Race(
      randomUUID(),
      props.name,
      props.archetype,
      props.realmId,
      props.realmName,
      props.sizeId,
      props.stats,
      props.resistances,
      props.averageHeight,
      props.averageWeight,
      props.strideBonus,
      props.enduranceBonus,
      props.recoveryMultiplier,
      props.baseHits,
      props.baseDevPoints,
      props.baseAt,
      props.defaultLanguage,
      props.talents,
      props.raceTraits,
      props.description,
      props.imageUrl,
      props.owner,
      new Date(),
      undefined,
    );
    race.apply(new RaceCreatedEvent(race.toProps()));
    return race;
  }

  static fromProps(props: RaceProps) {
    return new Race(
      props.id,
      props.name,
      props.archetype,
      props.realmId,
      props.realmName,
      props.sizeId,
      props.stats,
      props.resistances,
      props.averageHeight,
      props.averageWeight,
      props.strideBonus,
      props.enduranceBonus,
      props.recoveryMultiplier,
      props.baseHits,
      props.baseDevPoints,
      props.baseAt,
      props.defaultLanguage,
      props.talents,
      props.raceTraits,
      props.description,
      props.imageUrl,
      props.owner,
      props.createdAt,
      props.updatedAt,
    );
  }

  update(props: Partial<Omit<RaceProps, 'id' | 'createdAt' | 'updatedAt' | 'realmId' | 'realmName' | 'owner'>>) {
    if (props.name) this.name = props.name;
    if (props.archetype) this.archetype = props.archetype;
    if (props.sizeId) this.sizeId = props.sizeId;
    if (props.stats) this.stats = props.stats;
    if (props.resistances) this.resistances = props.resistances;
    if (props.averageHeight) this.averageHeight = props.averageHeight;
    if (props.averageWeight) this.averageWeight = props.averageWeight;
    if (props.strideBonus !== undefined) this.strideBonus = props.strideBonus;
    if (props.enduranceBonus !== undefined) this.enduranceBonus = props.enduranceBonus;
    if (props.recoveryMultiplier !== undefined) this.recoveryMultiplier = props.recoveryMultiplier;
    if (props.baseHits !== undefined) this.baseHits = props.baseHits;
    if (props.baseDevPoints !== undefined) this.baseDevPoints = props.baseDevPoints;
    if (props.baseAt !== undefined) this.baseAt = props.baseAt;
    if (props.defaultLanguage !== undefined) this.defaultLanguage = props.defaultLanguage;
    if (props.talents) this.talents = props.talents;
    if (props.raceTraits) this.raceTraits = props.raceTraits;
    if (props.description !== undefined) this.description = props.description;
    if (props.imageUrl !== undefined) this.imageUrl = props.imageUrl;
    this.updatedAt = new Date();
    this.apply(new RaceUpdatedEvent(this.toProps()));
  }

  toProps() {
    return {
      id: this.id,
      name: this.name,
      archetype: this.archetype,
      realmId: this.realmId,
      realmName: this.realmName,
      sizeId: this.sizeId,
      stats: this.stats,
      resistances: this.resistances,
      averageHeight: this.averageHeight,
      averageWeight: this.averageWeight,
      strideBonus: this.strideBonus,
      enduranceBonus: this.enduranceBonus,
      recoveryMultiplier: this.recoveryMultiplier,
      baseHits: this.baseHits,
      baseDevPoints: this.baseDevPoints,
      baseAt: this.baseAt,
      defaultLanguage: this.defaultLanguage,
      talents: this.talents,
      raceTraits: this.raceTraits,
      description: this.description,
      imageUrl: this.imageUrl,
      owner: this.owner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
