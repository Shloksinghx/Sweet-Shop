const SweetRepository = require('../src/models/sweet.model');
const db = require('../src/config/db');

jest.mock('../src/config/db');

describe('SweetRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a sweet', async () => {
            const sweetData = { name: 'Chocolate Bar', category: 'Chocolate', price: 2.5, quantity: 100 };
            db.query.mockResolvedValue({ rows: [{ id: 1, ...sweetData }] });

            const result = await SweetRepository.create(sweetData);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO sweets'),
                [sweetData.name, sweetData.category, sweetData.price, sweetData.quantity]
            );
            expect(result).toHaveProperty('id');
        });
    });

    describe('findAll', () => {
        it('should return all sweets', async () => {
            db.query.mockResolvedValue({ rows: [] });
            await SweetRepository.findAll();
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM sweets'));
        });
    });
});
