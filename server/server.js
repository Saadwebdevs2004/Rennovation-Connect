const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const bidsRoutes = require('./routes/bids');
const messagesRoutes = require('./routes/messages');
const statsRoutes = require('./routes/stats');
const notificationsRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Apply route modules (Pass app instance and DB connection)
authRoutes(app, db);
bidsRoutes(app, db);
messagesRoutes(app, db);
statsRoutes(app, db);
notificationsRoutes(app, db);
userRoutes(app, db);

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

// --- POST A NEW JOB ---
app.post('/api/jobs', async (req, res) => {
    try {
        const { homeownerId, title, category, description, location, budgetMin, budgetMax, urgency } = req.body;

        const sql = "INSERT INTO jobs (homeownerId, title, category, description, location, budgetMin, budgetMax, urgency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [homeownerId, title, category, description, location, budgetMin, budgetMax, urgency];

        const [result] = await db.query(sql, values);
        res.status(200).json({ message: "Job posted successfully!", jobId: result.insertId });
    } catch (error) {
        console.error("Database error while posting job:", error);
        res.status(500).json({ error: "Failed to save job to the database." });
    }
});

// --- GET JOBS FOR LOGGED IN HOMEOWNER ---
app.get('/api/jobs/homeowner/:id', async (req, res) => {
    try {
        const homeownerId = req.params.id;
        const sql = "SELECT * FROM jobs WHERE homeownerId = ? ORDER BY created_at DESC";

        const [results] = await db.query(sql, [homeownerId]);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// --- GET ALL JOBS (FOR WORKERS) ---
app.get('/api/jobs', async (req, res) => {
    try {
        const sql = "SELECT * FROM jobs ORDER BY created_at DESC";
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching all jobs:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// --- GET A SINGLE JOB BY ID ---
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM jobs WHERE id = ?";
        const [results] = await db.query(sql, [id]);

        if (results.length === 0) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error fetching job details:", error);
        res.status(500).json({ error: "Failed to fetch job" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});