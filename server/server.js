// server/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const authRoutes = require('./routes/auth');
const app = express();
const PORT = 3001; 

// Middleware
app.use(cors()); 
app.use(express.json()); 

// --- ROUTES ---

// Apply authentication routes (Pass app instance and DB connection)
authRoutes(app, db);

// Test Route: Check if the server is running
app.get('/', (req, res) => {
    res.send('Renovation Connect API Running!');
});

// Test DB Connection Route
app.get('/test-db', async (req, res) => {
    try {
        await db.query('SELECT 1 + 1 AS solution');
        res.status(200).send('Database connection successful!');
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).send('Database connection failed.');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});