const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('../src/middleware/auth.middleware');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('verifyToken', () => {
        it('should call next if token is valid', () => {
            req.headers['authorization'] = 'Bearer valid_token';
            jwt.verify.mockReturnValue({ id: 1, role: 'USER' });

            verifyToken(req, res, next);

            expect(jwt.verify).toHaveBeenCalled();
            expect(req.user).toEqual({ id: 1, role: 'USER' });
            expect(next).toHaveBeenCalled();
        });

        it('should return 401 if no token provided', () => {
            verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 400 if token is invalid', () => {
            req.headers['authorization'] = 'Bearer invalid_token';
            jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

            verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('isAdmin', () => {
        it('should call next if user is admin', () => {
            req.user = { role: 'ADMIN' };
            isAdmin(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if user is not admin', () => {
            req.user = { role: 'USER' };
            isAdmin(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Require Admin Role' });
        });
    });
});
