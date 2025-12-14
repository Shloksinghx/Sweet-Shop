const SweetService = require('../services/sweet.service');

const create = async (req, res) => {
    try {
        const sweet = await SweetService.create(req.body);
        res.status(201).json(sweet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const findAll = async (req, res) => {
    try {
        const sweets = await SweetService.findAll();
        res.json(sweets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const purchase = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const result = await SweetService.purchase(id, quantity);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    create,
    findAll,
    purchase,
};
