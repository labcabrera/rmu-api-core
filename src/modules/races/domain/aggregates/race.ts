import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { RaceResistances } from '../value-objects/race-resistances.vo';
import { RaceStats } from '../value-objects/race-stats.vo';
import { SexBasedAttribute } from '../value-objects/sex-based-attribute.vo';
import { AggregateRoot } from '@nestjs/cqrs';
import { RaceCreatedEvent } from '../events/race-created.event';
import { randomUUID } from 'crypto';

export class Race extends AggregateRoot<DomainEvent<Race>> {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly realmId: string,
    public realmName: string,
    public size: string,
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
    public description: string | undefined,
    public owner: string,
    public readonly createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super();
  }

  static create(
    name: string,
    realmId: string,
    realmName: string,
    size: string,
    stats: RaceStats,
    resistances: RaceResistances,
    averageHeight: SexBasedAttribute,
    averageWeight: SexBasedAttribute,
    strideBonus: number,
    enduranceBonus: number,
    recoveryMultiplier: number,
    baseHits: number,
    baseDevPoints: number,
    baseAt: number,
    defaultLanguage: string | undefined,
    talents: string[],
    description: string | undefined,
    owner: string,
  ) {
    const race = new Race(
      randomUUID(),
      name,
      realmId,
      realmName,
      size,
      stats,
      resistances,
      averageHeight,
      averageWeight,
      strideBonus,
      enduranceBonus,
      recoveryMultiplier,
      baseHits,
      baseDevPoints,
      baseAt,
      defaultLanguage,
      talents,
      description,
      owner,
      new Date(),
      undefined,
    );
    race.apply(new RaceCreatedEvent(race));
    return race;
  }
  update(
    name: string | undefined,
    size: string | undefined,
    stats: RaceStats | undefined,
    resistances: RaceResistances | undefined,
    averageHeight: SexBasedAttribute | undefined,
    averageWeight: SexBasedAttribute | undefined,
    strideBonus: number | undefined,
    enduranceBonus: number | undefined,
    recoveryMultiplier: number | undefined,
    baseHits: number | undefined,
    baseDevPoints: number | undefined,
    baseAt: number | undefined,
    defaultLanguage: string | undefined,
    talents: string[] | undefined,
    description: string | undefined,
  ) {
    if (name) this.name = name;
    if (size) this.size = size;
    if (stats) this.stats = stats;
    if (resistances) this.resistances = resistances;
    if (averageHeight) this.averageHeight = averageHeight;
    if (averageWeight) this.averageWeight = averageWeight;
    if (strideBonus !== undefined) this.strideBonus = strideBonus;
    if (enduranceBonus !== undefined) this.enduranceBonus = enduranceBonus;
    if (recoveryMultiplier !== undefined) this.recoveryMultiplier = recoveryMultiplier;
    if (baseHits !== undefined) this.baseHits = baseHits;
    if (baseDevPoints !== undefined) this.baseDevPoints = baseDevPoints;
    if (baseAt !== undefined) this.baseAt = baseAt;
    if (defaultLanguage !== undefined) this.defaultLanguage = defaultLanguage;
    if (talents) this.talents = talents;
    if (description !== undefined) this.description = description;
    this.updatedAt = new Date();
    this.apply(new RaceCreatedEvent(this));
  }
}
