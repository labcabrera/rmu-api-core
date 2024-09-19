const express = require('express');
const router = express.Router();

const armorTypes = [
    { "id": 1, "name": "None" },
    { "id": 2, "name": "Heavy Cloth" },
    { "id": 3, "name": "Soft Leather" },
    { "id": 4, "name": "Hide Scale" },
    { "id": 5, "name": "Laminar" },
    { "id": 6, "name": "Rigid Leather" },
    { "id": 7, "name": "Metal Scale" },
    { "id": 8, "name": "Mail" },
    { "id": 9, "name": "Brigandine" },
    { "id": 10, "name": "Plate" }
];

router.get('/', async (req, res) => {
    res.json(armorTypes);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const item = armorTypes.find(item => item.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: "Armor type not found" });
    }
});

module.exports = router;