const express = require('express');
const router = express.Router();

const skills = [
    { 'id': "animal-handling", categoryId: "animal", baseBonus: ["ag", "em"], bonus: "em" },
    { 'id': "riding", categoryId: "animal", baseBonus: ["ag", "em"], bonus: "em" },
];

router.get('/', async (req, res) => {
    res.json(skills);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const item = skills.find(item => item.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Skill not found' });
    }
});

module.exports = router;