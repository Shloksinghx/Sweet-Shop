import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // Optional: validate token or set axios header
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', { username, password });
            setToken(res.data.token);
            setUser(res.data.user);
            return true;
        } catch (err) {
            console.error("Login failed", err);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
