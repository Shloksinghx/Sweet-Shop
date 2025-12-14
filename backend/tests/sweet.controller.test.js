const request = require('supertest');
const app = require('../src/app');
const SweetService = require('../src/services/sweet.service');

jest.mock('../src/services/sweet.service');
// We need to valid token/auth middleware. 
// For simplicity in this test, we can assume the route uses verifyToken. 
// If we want to test that it protects the route, we should NOT mock the middleware fully, 
// OR we mock it to call next() or send 403 based on our inputs.

// Let's rely on mocking the middleware in the route file? No, it's imported there.
// We can mock the middleware module.

jest.mock('../src/middleware/auth.middleware', () => ({
    verifyToken: (req, res, next) => {
        req.user = { role: req.headers['x-role'] || 'USER' }; // Mock behavior: role determined by header
        next();
    },
    isAdmin: (req, res, next) => {
        if (req.user.role === 'ADMIN') next();
        else res.status(403).json({ error: 'Require Admin Role' });
    }
}));

describe('Sweet Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/sweets', () => {
        it('should create sweet if admin', async () => {
            SweetService.create.mockResolvedValue({ id: 1, name: 'Cake' });

            const res = await request(app)
                .post('/api/sweets')
                .set('x-role', 'ADMIN') // Mock header acts as token role
                .send({ name: 'Cake', price: 10 });

            expect(res.statusCode).toEqual(201);
            expect(SweetService.create).toHaveBeenCalled();
        });

        it('should return 403 if not admin', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('x-role', 'USER')
                .send({ name: 'Cake' });

            expect(res.statusCode).toEqual(403);
            expect(SweetService.create).not.toHaveBeenCalled();
        });
    });

    describe('POST /api/sweets/:id/purchase', () => {
        it('should purchase sweet', async () => {
            SweetService.purchase.mockResolvedValue({ id: 1, quantity: 4 });

            const res = await request(app)
                .post('/api/sweets/1/purchase')
                .send({ quantity: 1 });

            expect(res.statusCode).toEqual(200);
            expect(SweetService.purchase).toHaveBeenCalledWith('1', 1);
        });

        it('should return 400 if insufficient stock', async () => {
            SweetService.purchase.mockRejectedValue(new Error('Insufficient stock'));

            const res = await request(app)
                .post('/api/sweets/1/purchase')
                .send({ quantity: 10 });

            expect(res.statusCode).toEqual(400);
        });
    });
});
