const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'renovation_connect_secret_prod_key';

class AuthService {
  async registerUser(fullName, email, password, role) {
    if (!email || !password || !fullName || !role) {
      const err = new Error('Missing required fields.');
      err.status = 400;
      throw err;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const sql = 'INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)';
      const values = [fullName, email, hashedPassword, role];
      
      const [result] = await db.query(sql, values);
      return { message: 'User registered successfully!', userId: result.insertId };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const err = new Error('Email already in use.');
        err.status = 409;
        throw err;
      }
      throw error;
    }
  }

  async loginUser(email, password) {
    if (!email || !password) {
      const err = new Error('Email and password are required.');
      err.status = 400;
      throw err;
    }

    const sql = 'SELECT * FROM Users WHERE Email = ?';
    const [rows] = await db.query(sql, [email]);
    const users = Array.isArray(rows) ? rows : [rows];

    if (!users || users.length === 0 || !users[0]) {
      const err = new Error('User not found. Please check your email.');
      err.status = 401;
      throw err;
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      const err = new Error('Incorrect password.');
      err.status = 401;
      throw err;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.UserID, role: user.Role, name: user.FullName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      message: 'Login successful!',
      user: {
        id: user.UserID,
        name: user.FullName,
        role: user.Role,
        token: token
      }
    };
  }
}

module.exports = new AuthService();
