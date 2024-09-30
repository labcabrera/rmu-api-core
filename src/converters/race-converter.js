const toJSON = (race) => {
    return {
        id: race._id,
        name: race.name,
        realm: race.realm,
        size: race.size,
        defaultStatBonus: race.defaultStatBonus,
        resistances: race.resistances,
        averageHeight: race.averageHeight,
        averageWeight: race.averageWeight,
        strideBonus: race.strideBonus,
        enduranceBonus: race.enduranceBonus,
        recoveryMultiplier: race.recoveryMultiplier,
        baseHits: race.baseHits,
        bonusDevPoints: race.bonusDevPoints,
        createdAt: race.createdAt,
        updatedAt: race.updatedAt
    };
};

module.exports = {
    toJSON
};