const express = require('express');
const router = express.Router();

const characterSizeService = require("../services/character-size-service");
const errorService = require('../services/error-service');

router.get('/', (req, res) => {
    try {
        const result = characterSizeService.findAll();
        res.json(result);
    }
    catch (error) {
        errorService.sendErrorResponse(res, error);
    }
});

router.get('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const result = characterSizeService.findById(id);
        res.json(result);
    } catch (error) {
        errorService.sendErrorResponse(res, error);
    }
});

router.get('/attack-effects/:attackSizeId/:defenderSizeId', (req, res) => {
    try {
        const attackerSizeId = req.params.attackSizeId;
        const defenderSizeId = req.params.defenderSizeId;
        const result = characterSizeService.findAttackEffects(attackerSizeId, defenderSizeId);
        res.json(result);
    } catch (error) {
        errorService.sendErrorResponse(res, error);
    }
});

module.exports = router;