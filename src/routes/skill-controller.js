const express = require('express');
const router = express.Router();

const skills = [
    { 'id': "animal-handling", categoryId: "animal", bonus: ["pr"], specializations: ["animal-type"] },
    { 'id': "riding", categoryId: "animal", bonus: ["pr"], specializations: ["animal-type"] },

    { 'id': "perception", categoryId: "awarenes", bonus: ["sd"], specializations: null },
    { 'id': "tracking", categoryId: "awarenes", bonus: ["sd"], specializations: null },

    { 'id': "armor-maneuver", categoryId: "battle-expertise", bonus: [], specializations: null },
    { 'id': "mounted-combat", categoryId: "battle-expertise", bonus: [], specializations: null },
    { 'id': "protect", categoryId: "battle-expertise", bonus: [], specializations: null },
    { 'id': "restricted-quarters", categoryId: "battle-expertise", bonus: [], specializations: null },
    { 'id': "subduing", categoryId: "battle-expertise", bonus: [], specializations: null },

    { 'id': "adrenal-maneuvers", categoryId: "body-discipline", bonus: [], specializations: null },
    { 'id': "adrenal-defense", categoryId: "body-discipline", bonus: ["ag"], specializations: null },
    { 'id': "adrenal-focus", categoryId: "body-discipline", bonus: ["sd"], specializations: null },
    { 'id': "adrenal-speed", categoryId: "body-discipline", bonus: ["qu"], specializations: null },
    { 'id': "adrenal-strength", categoryId: "body-discipline", bonus: ["st"], specializations: null },

    { 'id': "body-development", categoryId: "brawn", bonus: ["co"], specializations: null },
    { 'id': "fortitude", categoryId: "brawn", bonus: ["sd"], specializations: null },
    { 'id': "weight-training", categoryId: "brawn", bonus: ["st"], specializations: null },

    { 'id': "blind-figthing", categoryId: "combat-expertise", bonus: [], specializations: null },
    { 'id': "disarm", categoryId: "combat-expertise", bonus: [], specializations: null },
    { 'id': "footwork", categoryId: "combat-expertise", bonus: [], specializations: null },
    { 'id': "multiple-attacks", categoryId: "combat-expertise", bonus: [], specializations: null },
    { 'id': "reverse-strike", categoryId: "combat-expertise", bonus: [], specializations: null },
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