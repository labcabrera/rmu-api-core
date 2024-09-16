const mongoose = require('mongoose');

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
    }
}, {
    timestamps: true,
    collection: "races"
});

const Race = mongoose.model('Race', raceSchema);

module.exports = Race;