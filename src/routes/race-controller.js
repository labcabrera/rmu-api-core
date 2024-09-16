const express = require('express');
const router = express.Router();
const raceService = require("../services/race-service");

router.get('/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const size = req.query.size ? parseInt(req.query.size) : 10;
        const response = await raceService.findAll(page, size);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const race = await raceService.findById(id);
        res.json(race);
    } catch (error) {
        res.status(error.status ? error.status : 500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        console.log("Race creation << " + req.body.name);
        //TODO JWT
        const user = "lab.cabrera@gmail.com";
        const newRace = await raceService.save(user, req.body);
        res.status(201).json(newRace);
    } catch (error) {
        res.status(error.status ? error.status : 500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        console.log("Race delete << " + req.params.id);
        const id = req.params.id;
        const deleted = await raceService.deleteById(id);
        res.status(204).send();
    } catch (error) {
        res.status(error.status ? error.status : 500).json({ message: error.message });
    }
});

module.exports = router;