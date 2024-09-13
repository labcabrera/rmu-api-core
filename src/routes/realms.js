const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const Realm = require("../models/realm")

router.get('/', async (req, res) => {
    try {
        const items = await Realm.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Realm.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;