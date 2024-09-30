const mysql = require('mysql2');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,          // Make sure the port is included in your .env file
    ssl: {
        ca: fs.readFileSync(process.env.DB_SSL_CERT_PATH)  // Path to the Aiven CA certificate
    },
    connectTimeout: 10000  // 10 seconds timeout (you can adjust this if needed)
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

module.exports = db;
