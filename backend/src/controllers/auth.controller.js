const AuthService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Basic validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const user = await AuthService.register(username, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await AuthService.login(username, password);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
};
