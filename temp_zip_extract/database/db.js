// database/db.js
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

// Resolve .env path dynamically
const rootEnv = path.resolve(__dirname, '../.env');
const backendEnv = path.resolve(__dirname, '../backend/.env');

if (fs.existsSync(rootEnv)) {
  require('dotenv').config({ path: rootEnv });
} else if (fs.existsSync(backendEnv)) {
  require('dotenv').config({ path: backendEnv });
} else {
  require('dotenv').config();
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'renovation_connect',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
