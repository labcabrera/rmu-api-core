const mongoose = require('mongoose');

const realmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Realm = mongoose.model('Realm', realmSchema);

module.exports = Realm;