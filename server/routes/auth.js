// server/routes/auth.js
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; 

module.exports = (app, db) => {
    // POST /api/register
    app.post('/api/register', async (req, res) => {
        const { fullName, email, password, userRole } = req.body;

        // 1. Validate input data
        if (!email || !password || !fullName || !userRole) {
            return res.status(400).send('Missing required fields.');
        }

        try {
            // 2. Hash the password for security
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            
            // 3. Prepare the SQL query
            const sql = 'INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)';
            const values = [fullName, email, hashedPassword, userRole];

            // 4. Execute the query
            await db.query(sql, values);

            // 5. Send success response
            res.status(201).send({ message: 'User registered successfully!' });

        } catch (error) {
            // Handle duplicate email errors or general DB errors
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).send('Email already in use.');
            }
            console.error('Registration Error:', error);
            res.status(500).send('Server error during registration.');
        }
    });
};