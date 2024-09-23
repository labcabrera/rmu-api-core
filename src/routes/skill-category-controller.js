const express = require('express');
const router = express.Router();

const categories = [
    { 'id': "animal" },
    { 'id': "awareness" },
    { 'id': "battle-expertise" },
    { 'id': "body-discipline" },
    { 'id': "brawn" },
    { 'id': "combat-expertise" },
    { 'id': "combat-training" },
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
    res.json(categories);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const item = categories.find(item => item.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Skill category not found' });
    }
});

module.exports = router;