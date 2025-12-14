const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth.routes');
const sweetRoutes = require('./routes/sweet.routes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});


module.exports = app;
