const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes'); 
dotenv.config();

const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'https://ansh-foodie-app.vercel.app',
    'https://ansh-foodie-backend.vercel.app/'
];

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000 || 10617;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
