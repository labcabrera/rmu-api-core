const mongoose = require('mongoose');

const raceStatBonus = new mongoose.Schema({
    ag: Number,
    co: Number,
    em: Number,
    in: Number,
    me: Number,
    pr: Number,
    qu: Number,
    re: Number,
    sd: Number,
    st: Number
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