const express = require('express');
const db = require('../config/db');
const verifyJWT = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/orders', verifyJWT.protect, (req, res) => {
    const userId = req.user.id; 
    const { items, deliveryInfo } = req.body;

    const orderQuery = 'INSERT INTO orders (user_id, items, delivery_data) VALUES (?, ?, ?)';
    db.query(orderQuery, [userId, JSON.stringify(items), JSON.stringify(deliveryInfo)], (err) => {
        if (err) {
            console.error('Error placing order:', err);
            return res.status(500).json({ message: 'Error placing order', error: err });
        }
        res.status(201).json({ message: 'Order placed successfully' });
    });
});

router.get('/orders', verifyJWT.protect, (req, res) => {
    const userId = req.user.id;
    console.log(userId)

    db.query('SELECT * FROM orders WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ message: 'Error fetching orders', error: err });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
