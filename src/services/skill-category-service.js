const skillCategories = require('../constants/skill-categories');

const findById = (id) => {
    const item = skillCategories.find(item => item.id === id);
    if (!item) {
        throw { status: 404, message: 'Skill category not found' }
    }
    return item;
}

const findAll = (page, size) => {
    const content = skillCategories.slice(page * size, (page + 1) * size);
    return { content: content, pagination: { page: page, size: size, totalElements: skillCategories.length } };
};

module.exports = {
    findById,
    findAll,
};