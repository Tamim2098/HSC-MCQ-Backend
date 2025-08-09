import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';

import questionRoutes from './routes/questionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// .env থেকে multiple URLs নিয়ে অ্যারে বানানো
const allowedOrigins = process.env.FRONTEND_URL.split(',');

const corsOptions = {
    origin: function(origin, callback) {
        // Postman or same origin requests এর জন্য origin না থাকলেও allow করবেন
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        console.log('MongoDB connected successfully!');
    })
    .catch(err => console.error('MongoDB connection error:', err));
