const express = require('express');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'UP', 
        message: 'POC6 App is running!',
        timestamp: new Date().toISOString()
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;