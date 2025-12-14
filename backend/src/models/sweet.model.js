const db = require('../config/db');

const SweetRepository = {
    create: async (sweet) => {
        const { name, category, price, quantity } = sweet;
        const result = await db.query(
            'INSERT INTO sweets (name, category, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, category, price, quantity]
        );
        return result.rows[0];
    },

    findAll: async () => {
        const result = await db.query('SELECT * FROM sweets');
        return result.rows;
    },

    findById: async (id) => {
        const result = await db.query('SELECT * FROM sweets WHERE id = $1', [id]);
        return result.rows[0];
    },

    update: async (id, sweet) => {
        const { name, category, price, quantity } = sweet;
        const result = await db.query(
            'UPDATE sweets SET name = $1, category = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
            [name, category, price, quantity, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await db.query('DELETE FROM sweets WHERE id = $1', [id]);
    },
};

module.exports = SweetRepository;
