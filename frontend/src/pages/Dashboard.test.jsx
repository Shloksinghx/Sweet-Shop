import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import { AuthContext } from '../context/AuthContext';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');

import { BrowserRouter } from 'react-router-dom';

describe('Dashboard', () => {
    it('fetches and displays sweets', async () => {
        const sweets = [
            { id: 1, name: 'Cake', price: 10, quantity: 5 },
            { id: 2, name: 'Candy', price: 1, quantity: 100 }
        ];
        axios.get.mockResolvedValue({ data: sweets });

        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ token: 'mock_token', user: { role: 'USER' } }}>
                    <Dashboard />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Cake')).toBeInTheDocument();
            expect(screen.getByText('Candy')).toBeInTheDocument();
        });
    });
});
