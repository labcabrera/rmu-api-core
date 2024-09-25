const Race = require("../models/race-model");

const findById = async (id) => {
    const readedGame = await Race.findById(id);
    if (!readedGame) {
        throw { status: 404, message: "Race not found" };
    }
    return toJSON(readedGame);
}

const findAll = async (page, size) => {
    const skip = page * size;
    const list = await Race.find().skip(skip).limit(size).sort({ name: 1 });
    const count = await Race.countDocuments();
    const content = list.map(toJSON);
    return { content: content, pagination: { page: page, size: size, totalElements: count } };
};

const save = async (user, data) => {
    const newRace = new Race({
        _id: data.id,
        name: data.name,
        realm: data.realm,
        descriptiohn: data.description
    });
    const savedRace = await newRace.save();
    return toJSON(savedRace);
};

const update = async (gameId, data) => {
    const { name, description } = data;
    const updatedGame = await Race.findByIdAndUpdate(gameId, { name, description }, { new: true });
    if (!updatedGame) {
        throw { status: 404, message: "Race not found" };
    };
    return toJSON(updatedGame);
};

const deleteById = async (gameId) => {
    const deletedGame = await Race.findByIdAndDelete(gameId);
    if (!deletedGame) {
        throw { status: 404, message: "Race not found" };
    }
}


const toJSON = (race) => {
    return {
        id: race._id,
        name: race.name,
        realm: race.realm,
        createdAt: race.createdAt,
        updatedAt: race.updatedAt
    };
}

module.exports = {
    findById,
    findAll,
    save,
    update,
    deleteById
};