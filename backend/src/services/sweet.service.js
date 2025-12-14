const SweetRepository = require('../models/sweet.model');

const SweetService = {
    create: async (sweet) => {
        return await SweetRepository.create(sweet);
    },

    findAll: async () => {
        return await SweetRepository.findAll();
    },

    purchase: async (id, quantity) => {
        const sweet = await SweetRepository.findById(id);
        if (!sweet) {
            throw new Error('Sweet not found');
        }
        if (sweet.quantity < quantity) {
            throw new Error('Insufficient stock');
        }
        const updatedSweet = { ...sweet, quantity: sweet.quantity - quantity };
        return await SweetRepository.update(id, updatedSweet);
    },

    restock: async (id, quantity) => {
        const sweet = await SweetRepository.findById(id);
        if (!sweet) {
            throw new Error('Sweet not found');
        }
        const updatedSweet = { ...sweet, quantity: sweet.quantity + quantity };
        return await SweetRepository.update(id, updatedSweet);
    },
};

module.exports = SweetService;
