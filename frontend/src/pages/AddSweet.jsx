import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddSweet = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', category: '', price: '', quantity: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/sweets', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add sweet');
        }
    };

    return (
        <div className="add-sweet-container">
            <h2>Add New Sweet</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Category</label>
                    <input name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price</label>
                    <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>Quantity</label>
                    <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
                </div>
                <button type="submit">Add Sweet</button>
            </form>
        </div>
    );
};

export default AddSweet;
