const request = require('supertest');
const app = require('../src/app');
const AuthService = require('../src/services/auth.service');

jest.mock('../src/services/auth.service');

describe('Auth Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a user and return 201', async () => {
            AuthService.register.mockResolvedValue({ id: 1, username: 'testuser', role: 'USER' });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser', password: 'password' });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({ id: 1, username: 'testuser', role: 'USER' });
            expect(AuthService.register).toHaveBeenCalledWith('testuser', 'password');
        });

        it('should return 400 if service throws error', async () => {
            AuthService.register.mockRejectedValue(new Error('User already exists'));

            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'existing', password: 'password' });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login and return token', async () => {
            AuthService.login.mockResolvedValue({ token: 'token', user: { id: 1 } });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'testuser', password: 'password' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ token: 'token', user: { id: 1 } });
        });

        it('should return 400 (or 401) on failure', async () => {
            AuthService.login.mockRejectedValue(new Error('Invalid credentials'));

            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'testuser', password: 'wrong' });

            expect(res.statusCode).toEqual(400);
        });
    });
});
