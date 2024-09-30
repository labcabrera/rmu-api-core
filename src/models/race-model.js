const mongoose = require('mongoose');

const raceStatBonus = new mongoose.Schema({
    agility: Number,
    constitution: Number,
    empathy: Number,
    intuition: Number,
    memory: Number,
    presence: Number,
    quickness: Number,
    reasoning: Number,
    selfDiscipline: Number,
    strength: Number
}, { _id: false });

const raceResistences = new mongoose.Schema({
    channeling: Number,
    mentalism: Number,
    essence: Number,
    physical: Number
}, { _id: false });

const sexBasedAttribute = new mongoose.Schema({
    male: Number,
    female: Number,
}, { _id: false });

const raceSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    realm: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: false
    },
    defaultStatBonus: raceStatBonus,
    resistances: raceResistences,
    averageHeight: sexBasedAttribute,
    averageWeight: sexBasedAttribute,
    strideBonus: Number,
    enduranceBonus: Number,
    recoveryMultiplier: Number,
    baseHits: Number,
    bonusDevPoints: Number
}, {
    timestamps: true,
    collection: "races"
});

const Race = mongoose.model('Race', raceSchema);

module.exports = Race;