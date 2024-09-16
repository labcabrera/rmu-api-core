const express = require('express');
const router = express.Router();
const realmService = require("../services/realm-service");

router.get('/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const size = req.query.size ? parseInt(req.query.size) : 10;
        const response = await realmService.findAll(page, size);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const realm = await realmService.findById(id);
        res.json(realm);
    } catch (error) {
        res.status(error.status ? error.status : 500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        console.log("Realm creation << " + req.body.name);
        //TODO JWT
        const user = "lab.cabrera@gmail.com";
        const newRealm = await realmService.save(user, req.body);
        res.status(201).json(newRealm);
    } catch (error) {
        res.status(error.status ? error.status : 500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        console.log("Race delete << " + req.params.id);
        const id = req.params.id;
        const deleted = await realmService.deleteById(id);
        res.status(204).send();
    } catch (error) {
        res.status(error.status ? error.status : 500).json({ message: error.message });
    }
});

module.exports = router;