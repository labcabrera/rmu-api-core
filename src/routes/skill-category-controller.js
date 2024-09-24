const express = require('express');
const router = express.Router();
const skillCategoryService = require("../services/skill-category-service");

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