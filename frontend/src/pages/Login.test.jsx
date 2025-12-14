import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

const mockLogin = vi.fn();

describe('Login Page', () => {
    it('renders login form', () => {
        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ login: mockLogin }}>
                    <Login />
                </AuthContext.Provider>
            </BrowserRouter>
        );
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('calls login function on submit', async () => {
        mockLogin.mockResolvedValue(true);
        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ login: mockLogin }}>
                    <Login />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('testuser', 'password');
        });
    });
});
