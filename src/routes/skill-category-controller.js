const express = require('express');
const router = express.Router();
const skillCategoryService = require("../services/skill-category-service");

const categories = [
    { 'id': "animal", bonus: ["ag", "em"] },
    { 'id': "awareness", bonus: ["in", "re"] },
    { 'id': "battle-expertise", bonus: [] },
    { 'id': "body-discipline", bonus: ["co", "sd"] },
    { 'id': "brawn", bonus: ["co", "sd"] },
    { 'id': "combat-expertise", bonus: [] },
    { 'id': "combat-training", bonus: ["ag", "st"] },
    { 'id': "composition" },
    { 'id': "crafting" },
    { 'id': "delving" },
    { 'id': "environmental" },
    { 'id': "gymnastic" },
    { 'id': "lore" },
    { 'id': "magical-expertise" },
    { 'id': "medical" },
    { 'id': "mental-discipline" },
    { 'id': "movement" },
    { 'id': "performance-art" },
    { 'id': "power-manipulation" },
    { 'id': "science" },
    { 'id': "social" },
    { 'id': "spellcasting" },
    { 'id': "subterfuge" },
    { 'id': "techical" },
    { 'id': "vocation" }
];

router.get('/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const size = req.query.size ? parseInt(req.query.size) : 10;
        const categories = skillCategoryService.findAll(page, size);
        res.json(categories);
    } catch (error) {
        res.status(error.status ? error.status : 500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const skill = skillCategoryService.findById(id);
        res.json(skill);
    } catch (error) {
        res.status(error.status ? error.status : 500).json({ message: error.message });
    }
});

module.exports = router;