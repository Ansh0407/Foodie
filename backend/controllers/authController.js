const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const [result] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);

        if (result.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        await pool.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);
        return res.status(201).json({ message: 'User registered' });
    } catch (error) {
        console.error('Error in register:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (result.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token);
        return res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error('Error in login:', error.toString());
        return res.status(500).json({ message: error.toString() });
    }
};

exports.isAuthenticated = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        return res.status(200).json({ message: 'Authenticated', user });
    });
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
};

exports.getUser = async (req, res) => {
    const token = req.cookies.token;
    console.log('Token:', token);

    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const [result] = await pool.query('SELECT id, email, name FROM users WHERE id = ?', [userId]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0];
        return res.status(200).json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
        console.error('Error in getUser:', error);
        return res.status(500).json({ message: error.message || 'Server error' });
    }
};

