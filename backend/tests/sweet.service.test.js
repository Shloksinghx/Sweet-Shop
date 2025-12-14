const SweetService = require('../src/services/sweet.service');
const SweetRepository = require('../src/models/sweet.model');

jest.mock('../src/models/sweet.model');

describe('SweetService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('purchase', () => {
        it('should reduce stock if sufficient quantity', async () => {
            const sweet = { id: 1, name: 'Candy', price: 1, quantity: 10 };
            SweetRepository.findById.mockResolvedValue(sweet);
            SweetRepository.update.mockResolvedValue({ ...sweet, quantity: 9 });

            const result = await SweetService.purchase(1, 1);

            expect(SweetRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ quantity: 9 }));
            expect(result).toHaveProperty('quantity', 9);
        });

        it('should throw error if insufficient stock', async () => {
            const sweet = { id: 1, name: 'Candy', price: 1, quantity: 0 };
            SweetRepository.findById.mockResolvedValue(sweet);

            await expect(SweetService.purchase(1, 1)).rejects.toThrow('Insufficient stock');
        });

        it('should throw error if sweet not found', async () => {
            SweetRepository.findById.mockResolvedValue(null);
            await expect(SweetService.purchase(99, 1)).rejects.toThrow('Sweet not found');
        });
    });

    describe('restock', () => {
        it('should increase stock', async () => {
            const sweet = { id: 1, name: 'Candy', price: 1, quantity: 10 };
            SweetRepository.findById.mockResolvedValue(sweet);
            SweetRepository.update.mockResolvedValue({ ...sweet, quantity: 20 });

            const result = await SweetService.restock(1, 10);

            expect(SweetRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ quantity: 20 }));
            expect(result).toHaveProperty('quantity', 20);
        });
    });
});
