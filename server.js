import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';

import questionRoutes from './routes/questionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL.split(',');

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
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

// ✅ API Routes
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Health Check Route (for UptimeRobot or basic GET test)
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// ✅ MongoDB Connection & Server Start
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
        console.log('✅ MongoDB connected successfully!');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });
