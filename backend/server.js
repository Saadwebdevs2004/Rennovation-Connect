const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const bidsRoutes = require('./routes/bids');
const messagesRoutes = require('./routes/messages');
const statsRoutes = require('./routes/stats');
const notificationsRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');
const paymentsRoutes = require('./routes/payments');
const reviewsRoutes = require('./routes/reviews');

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
paymentsRoutes(app, db);
reviewsRoutes(app, db);

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
        const sql = `
            SELECT j.*, 
                   (SELECT COUNT(*) FROM bids b WHERE b.job_id = j.id) as bidsCount,
                   EXISTS(SELECT 1 FROM payments p WHERE p.job_id = j.id AND (p.status = 'completed' OR p.status = 'pending_approval')) as isPaid,
                   EXISTS(SELECT 1 FROM reviews r WHERE r.job_id = j.id AND r.reviewer_id = j.homeownerId) as hasReviewed
            FROM jobs j 
            WHERE j.homeownerId = ? 
            ORDER BY j.created_at DESC
        `;

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
        const { workerId } = req.query;
        // Only return open jobs to the public job board
        const sql = "SELECT * FROM jobs WHERE status = 'open' ORDER BY created_at DESC";
        let [results] = await db.query(sql);

        if (workerId) {
            // Fetch bids for this worker to know which jobs they've already bidded on
            const [bids] = await db.query("SELECT job_id FROM bids WHERE worker_id = ?", [workerId]);
            const biddedJobIds = new Set(bids.map(b => b.job_id));

            // Add a flag to each job
            results = results.map(job => ({
                ...job,
                hasBidded: biddedJobIds.has(job.id)
            }));
        }

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
        // Join with bids to find the workerId for accepted jobs
        const sql = `
            SELECT j.*, b.worker_id as workerId,
                   EXISTS(SELECT 1 FROM payments p WHERE p.job_id = j.id AND (p.status = 'completed' OR p.status = 'pending_approval')) as isPaid,
                   EXISTS(SELECT 1 FROM reviews r WHERE r.job_id = j.id AND r.reviewer_id = j.homeownerId) as hasReviewed
            FROM jobs j 
            LEFT JOIN bids b ON j.id = b.job_id AND b.status = 'accepted'
            WHERE j.id = ?
        `;
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

// --- UPDATE JOB DETAILS ---
app.put('/api/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description, location, budgetMin, budgetMax } = req.body;

        const sql = "UPDATE jobs SET title = ?, category = ?, description = ?, location = ?, budgetMin = ?, budgetMax = ? WHERE id = ?";
        const values = [title, category, description, location, budgetMin, budgetMax, id];

        await db.query(sql, values);
        res.status(200).json({ message: "Job updated successfully!" });
    } catch (error) {
        console.error("Error updating job details:", error);
        res.status(500).json({ error: "Failed to update job" });
    }
});

// --- UPDATE JOB STATUS ---
app.put('/api/jobs/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query("UPDATE jobs SET status = ? WHERE id = ?", [status, id]);

        // Let's notify the homeowner if marked as completed
        if (status === 'completed') {
            const [job] = await db.query("SELECT title, homeownerId FROM jobs WHERE id = ?", [id]);
            if (job.length > 0) {
                await db.query(
                    "INSERT INTO notifications (user_id, type, title, description) VALUES (?, ?, ?, ?)",
                    [job[0].homeownerId, 'job', 'Project Completed', `Your project "${job[0].title}" has been marked as complete!`]
                );
            }
        }

        res.status(200).json({ message: "Job status updated successfully!" });
    } catch (error) {
        console.error("Error updating job status:", error);
        res.status(500).json({ error: "Failed to update job status" });
    }
});

// --- UPDATE JOB PROGRESS ---
app.put('/api/jobs/:id/progress', async (req, res) => {
    try {
        const { id } = req.params;
        const { progress_status, completion_image_url } = req.body;
        if (completion_image_url) {
            await db.query("UPDATE jobs SET progress_status = ?, completion_image_url = ? WHERE id = ?", [progress_status, completion_image_url, id]);
        } else {
            await db.query("UPDATE jobs SET progress_status = ? WHERE id = ?", [progress_status, id]);
        }
        res.status(200).json({ message: "Job progress updated successfully!" });
    } catch (error) {
        console.error("Error updating job progress:", error);
        res.status(500).json({ error: "Failed to update job progress" });
    }
});

// --- TEST DB MESSAGES ---
app.get('/api/test-db-messages', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM messages');
        const [users] = await db.query('SELECT UserID, fullName FROM users');
        res.status(200).json({
            messageCount: rows[0].count,
            users: users,
            database: process.env.DB_NAME || 'renovation_connect'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});