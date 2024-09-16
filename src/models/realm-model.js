const mongoose = require('mongoose');

const realmSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Realm = mongoose.model('Realm', realmSchema);

module.exports = Realm;