const Realm = require("../models/realm-model");

const findById = async (id) => {
    const readed = await Realm.findById(id);
    if (!readed) {
        throw { status: 404, message: "Realm not found" };
    }
    return toJSON(readed);
}

const findAll = async (page, size) => {
    const skip = page * size;
    const readedGames = await Realm.find().skip(skip).limit(size).sort({ name: 1 });
    const count = await Realm.countDocuments();
    const content = readedGames.map(toJSON);
    return { content: content, pagination: { page: page, size: size, totalElements: count } };
};

const save = async (user, data) => {
    const newRace = new Realm({
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
    const updatedGame = await Realm.findByIdAndUpdate(gameId, { name, description }, { new: true });
    if (!updatedGame) {
        throw { status: 404, message: "Realm not found" };
    };
    return toJSON(updatedGame);
};

const deleteById = async (gameId) => {
    const deletedGame = await Realm.findByIdAndDelete(gameId);
    if (!deletedGame) {
        throw { status: 404, message: "Realm not found" };
    }
}


const toJSON = (realm) => {
    return {
        id: realm._id,
        name: realm.name,
        createdAt: realm.createdAt,
        updatedAt: realm.updatedAt
    };
}

module.exports = {
    findById,
    findAll,
    save,
    update,
    deleteById
};