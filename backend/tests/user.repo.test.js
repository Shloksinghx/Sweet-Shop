const UserRepository = require('../src/models/user.model');
const db = require('../src/config/db');

// Mock the db module
jest.mock('../src/config/db');

describe('UserRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should insert a new user and return it', async () => {
            const mockUser = { username: 'testuser', password: 'hashedpassword', role: 'USER' };
            const expectedResult = { id: 1, ...mockUser };

            db.query.mockResolvedValue({ rows: [expectedResult] });

            const result = await UserRepository.create(mockUser);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                [mockUser.username, mockUser.password, mockUser.role]
            );
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByUsername', () => {
        it('should return a user if found', async () => {
            const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword', role: 'USER' };
            db.query.mockResolvedValue({ rows: [mockUser] });

            const result = await UserRepository.findByUsername('testuser');

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM users WHERE username'),
                ['testuser']
            );
            expect(result).toEqual(mockUser);
        });

        it('should return null if not found', async () => {
            db.query.mockResolvedValue({ rows: [] });

            const result = await UserRepository.findByUsername('nonexistent');

            expect(result).toBeNull();
        });
    });
});
