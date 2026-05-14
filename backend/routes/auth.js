// server/routes/auth.js
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; 

module.exports = (app, db) => {
    
    // ==========================================
    // 1. REGISTRATION ROUTE
    // ==========================================
    app.post('/api/register', async (req, res) => {
        const { fullName, email, password, userRole } = req.body;

        // Validate input data
        if (!email || !password || !fullName || !userRole) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        try {
            // Hash the password for security
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            
            // Prepare the SQL query
            const sql = 'INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)';
            const values = [fullName, email, hashedPassword, userRole];

            // Execute the query
            await db.query(sql, values);

            // Send success response
            res.status(201).send({ message: 'User registered successfully!' });

        } catch (error) {
            // Handle duplicate email errors or general DB errors
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Email already in use.' });
            }
            console.error('Registration Error:', error);
            res.status(500).json({ error: 'Server error during registration.' });
        }
    });

    // ==========================================
    // 2. LOGIN ROUTE
    // ==========================================
    app.post('/api/login', async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        try {
            // Look for the user in the database
            const sql = 'SELECT * FROM Users WHERE Email = ?';
            const [rows] = await db.query(sql, [email]); 
            // Note: If your db wrapper returns rows directly instead of [rows, fields], 
            // we handle it safely below.
            const users = Array.isArray(rows) ? rows : [rows]; 

            // Check if the email exists
            if (!users || users.length === 0 || !users[0]) {
                return res.status(401).json({ error: 'User not found. Please check your email.' });
            }

            const user = users[0];

            // Compare the typed password with the securely hashed password
            const isMatch = await bcrypt.compare(password, user.PasswordHash);

            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect password.' });
            }

            // Success! Send back the user data
            res.status(200).json({ 
                message: 'Login successful!', 
                user: { 
                    id: user.UserID, 
                    name: user.FullName, 
                    role: user.Role 
                } 
            });

        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ error: 'An error occurred during login.' });
        }
    });
};