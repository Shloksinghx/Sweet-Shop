const UserRepository = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthService = {
    register: async (username, password) => {
        const existingUser = await UserRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.create({
            username,
            password: hashedPassword,
            role: 'USER', // Default role
        });

        return newUser;
    },

    login: async (username, password) => {
        const user = await UserRepository.findByUsername(username);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        return { token, user: { id: user.id, username: user.username, role: user.role } };
    },
};

module.exports = AuthService;
