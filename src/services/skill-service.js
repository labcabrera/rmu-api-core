const skills = require('../constants/skills');

const findById = (id) => {
    const item = skills.find(item => item.id === id);
    if (!item) {
        throw { status: 404, message: 'Skill not found' }
    }
    return item;
}

const findAll = (page, size) => {
    const content = skills.slice(page * size, (page + 1) * size);
    return { content: content, pagination: { page: page, size: size, totalElements: skills.length } };
};

module.exports = {
    findById,
    findAll,
};