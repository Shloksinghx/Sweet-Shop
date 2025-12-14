const db = require('../config/db');

const UserRepository = {
    create: async (user) => {
        const { username, password, role } = user;
        const result = await db.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
            [username, password, role]
        );
        return result.rows[0];
    },

    findByUsername: async (username) => {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0] || null;
    },
};

module.exports = UserRepository;
