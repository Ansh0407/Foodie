const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/authMiddleware');
const orderRoutes = require('./routes/orderRoutes'); 

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Use order routes under /api
app.use('/api', orderRoutes);

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// User registration route
app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }

        if (result.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error saving user', error: err });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error hashing password', error });
        }
    });
});

// User login route
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });

        db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id], (err) => {
            if (err) {
                console.error('Error saving token:', err);
            }
        });

        res.status(200).json({ message: 'Login successful', token });
    });
});

// Protected route example
app.get('/protected', verifyJWT.protect, (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.user.id });
});

// Get authenticated user information
app.get('/auth/user', verifyJWT.protect, (req, res) => {
    db.query('SELECT name FROM users WHERE id = ?', [req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result[0]);
    });
});

// User logout route
app.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

// Start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
