const Race = require('../models/race-model');
const raceConverter = require('../converters/race-converter');

const findById = async (id) => {
    const readedGame = await Race.findById(id);
    if (!readedGame) {
        throw { status: 404, message: 'Race not found' };
    }
    return raceConverter.toJSON(readedGame);
}

const findAll = async (page, size) => {
    const skip = page * size;
    const list = await Race.find().skip(skip).limit(size).sort({ name: 1 });
    const count = await Race.countDocuments();
    const content = list.map(raceConverter.toJSON);
    return { content: content, pagination: { page: page, size: size, totalElements: count } };
};

const save = async (user, data) => {
    const newRace = new Race({
        _id: data.id,
        name: data.name,
        realm: data.realm,
        size: data.size,
        defaultStatBonus: data.defaultStatBonus,
        resistances: data.resistances,
        averageHeight: data.averageHeight,
        averageWeight: data.averageWeight,
        strideBonus: data.strideBonus,
        endurance: data.endurance,
        recoveryMultiplier: data.recoveryMultiplier,
        baseHits: data.baseHits,
        bonusDevPoints: data.bonusDevPoints,
        descriptiohn: data.description
    });
    const savedRace = await newRace.save();
    return raceConverter.toJSON(savedRace);
};

const update = async (gameId, data) => {
    const { name, description } = data;
    const updatedGame = await Race.findByIdAndUpdate(gameId, { name, description }, { new: true });
    if (!updatedGame) {
        throw { status: 404, message: 'Race not found' };
    };
    return raceConverter.toJSON(updatedGame);
};

const deleteById = async (gameId) => {
    const deletedGame = await Race.findByIdAndDelete(gameId);
    if (!deletedGame) {
        throw { status: 404, message: 'Race not found' };
    }
}

module.exports = {
    findById,
    findAll,
    save,
    update,
    deleteById
};