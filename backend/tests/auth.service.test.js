const AuthService = require('../src/services/auth.service');
const UserRepository = require('../src/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            UserRepository.findByUsername.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedpassword');
            UserRepository.create.mockResolvedValue({ id: 1, username: 'newuser', role: 'USER' });

            const result = await AuthService.register('newuser', 'password');

            expect(UserRepository.findByUsername).toHaveBeenCalledWith('newuser');
            expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
            expect(UserRepository.create).toHaveBeenCalledWith({
                username: 'newuser',
                password: 'hashedpassword',
                role: 'USER',
            });
            expect(result).toEqual({ id: 1, username: 'newuser', role: 'USER' });
        });

        it('should throw error if user already exists', async () => {
            UserRepository.findByUsername.mockResolvedValue({ id: 1 });

            await expect(AuthService.register('existing', 'password')).rejects.toThrow('User already exists');
        });
    });

    describe('login', () => {
        it('should return a token for valid credentials', async () => {
            const user = { id: 1, username: 'testuser', password: 'hashedpassword', role: 'USER' };
            UserRepository.findByUsername.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('valid_token');

            const result = await AuthService.login('testuser', 'password');

            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user.id, role: user.role },
                expect.any(String),
                { expiresIn: '1h' }
            );
            expect(result).toEqual({ token: 'valid_token', user: { id: 1, username: 'testuser', role: 'USER' } });
        });

        it('should throw error for invalid credentials', async () => {
            UserRepository.findByUsername.mockResolvedValue(null);

            await expect(AuthService.login('wrong', 'password')).rejects.toThrow('Invalid credentials');
        });
    });
});
