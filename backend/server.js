const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const { authenticateJWT } = require('./middleware/auth');

// Import routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const bidsRouter = require('./routes/bids');
const messagesRouter = require('./routes/messages');
const statsRouter = require('./routes/stats');
const notificationsRouter = require('./routes/notifications');
const userRouter = require('./routes/users');
const paymentsRouter = require('./routes/payments');
const reviewsRouter = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(authenticateJWT); // Parses Bearer JWT if present in Authorization header

// Test Routes
app.get('/', (req, res) => {
  res.send('Renovation Connect API Running!');
});

app.get('/test-db', async (req, res) => {
  try {
    await db.query('SELECT 1 + 1 AS solution');
    res.status(200).send('Database connection successful!');
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).send('Database connection failed.');
  }
});

// Test DB Messages Route
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

// Mount Routers
app.use('/api', authRouter);
app.use('/api', jobsRouter);
app.use('/api', bidsRouter);
app.use('/api', messagesRouter);
app.use('/api', statsRouter);
app.use('/api', notificationsRouter);
app.use('/api', userRouter);
app.use('/api', paymentsRouter);
app.use('/api', reviewsRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});