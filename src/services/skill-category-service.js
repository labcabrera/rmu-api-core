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

const findById = (id) => {
    const item = categories.find(item => item.id === id);
    if (!item) {
        throw { status: 404, message: 'Skill category not found' }
    }
    return item;
}

const findAll = (page, size) => {
    const content = categories.slice(page * size, (page + 1) * size);
    return { content: content, pagination: { page: page, size: size, totalElements: categories.length } };
};

module.exports = {
    findById,
    findAll,
};