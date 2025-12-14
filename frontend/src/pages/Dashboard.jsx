import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [sweets, setSweets] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSweets = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/sweets', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSweets(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load sweets');
            }
        };
        fetchSweets();
    }, [token]);

    const handlePurchase = async (id) => {
        try {
            await axios.post(`http://localhost:3000/api/sweets/${id}/purchase`, { quantity: 1 }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local state
            setSweets(sweets.map(s => s.id === id ? { ...s, quantity: s.quantity - 1 } : s));
        } catch (err) {
            console.error(err);
            setError('Purchase failed');
        }
    };

    return (
        <div className="dashboard-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                <h1>Sweet Shop Dashboard</h1>
                <div>
                    <span>Welcome, {user?.username} ({user?.role}) </span>
                    {user?.role === 'ADMIN' && <button onClick={() => navigate('/add-sweet')}>Add Sweet</button>}
                    {/* Logout button could be here */}
                </div>
            </header>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="sweets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', padding: '1rem' }}>
                {sweets.map(sweet => (
                    <div key={sweet.id} className="sweet-card" style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                        <h3>{sweet.name}</h3>
                        <p>Category: {sweet.category}</p>
                        <p>Price: ${sweet.price}</p>
                        <p>Stock: {sweet.quantity}</p>
                        <button onClick={() => handlePurchase(sweet.id)} disabled={sweet.quantity <= 0}>
                            {sweet.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
