const express = require('express');
const router = express.Router();

const characterSizes = [
    { 'id': 1, 'name': 'Minuscule', 'hitMultiplier': 0.25 },
    { 'id': 2, 'name': 'Diminutive', 'hitMultiplier': 0.50 },
    { 'id': 3, 'name': 'Tiny', 'hitMultiplier': 0.67 },
    { 'id': 4, 'name': 'Small', 'hitMultiplier': 0.75 },
    { 'id': 5, 'name': 'Medium', 'hitMultiplier': 1.00 },
    { 'id': 6, 'name': 'Big', 'hitMultiplier': 1.50 },
    { 'id': 7, 'name': 'Large', 'hitMultiplier': 2.00 },
    { 'id': 8, 'name': 'Huge', 'hitMultiplier': 3.00 },
    { 'id': 9, 'name': 'Gigantic', 'hitMultiplier': 4.00 },
    { 'id': 10, 'name': 'Enormous', 'hitMultiplier': 5.00 },
];

router.get('/', async (req, res) => {
    res.json(characterSizes);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const item = characterSizes.find(item => item.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Character size not found' });
    }
});

module.exports = router;