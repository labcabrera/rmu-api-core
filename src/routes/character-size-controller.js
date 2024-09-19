const express = require('express');
const router = express.Router();

const characterSizes = [
    { 'id': 'minuscule', 'index': 1, 'name': 'Minuscule', 'hitMultiplier': 0.25 },
    { 'id': 'diminutive', 'index': 2, 'name': 'Diminutive', 'hitMultiplier': 0.50 },
    { 'id': 'tiny', 'index': 3, 'name': 'Tiny', 'hitMultiplier': 0.67 },
    { 'id': 'small', 'index': 4, 'name': 'Small', 'hitMultiplier': 0.75 },
    { 'id': 'medium', 'index': 5, 'name': 'Medium', 'hitMultiplier': 1.00 },
    { 'id': 'big', 'index': 6, 'name': 'Big', 'hitMultiplier': 1.50 },
    { 'id': 'large', 'index': 7, 'name': 'Large', 'hitMultiplier': 2.00 },
    { 'id': 'huge', 'index': 8, 'name': 'Huge', 'hitMultiplier': 3.00 },
    { 'id': 'gigantic', 'index': 9, 'name': 'Gigantic', 'hitMultiplier': 4.00 },
    { 'id': 'enormous', 'index': 10, 'name': 'Enormous', 'hitMultiplier': 5.00 },
];

router.get('/', async (req, res) => {
    res.json(characterSizes);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const item = characterSizes.find(item => item.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Character size not found' });
    }
});

module.exports = router;