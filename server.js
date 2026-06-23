import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthCheckRoute from './app.mjs';
import { sequelize } from './model/index.mjs';
import router from './routes/index.js';
import { UPLOAD_DIR } from './middleware/upload.mjs';

dotenv.config();

const app = express();

// Middleware (must be registered before routes)
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(UPLOAD_DIR));

// Routes
app.use(healthCheckRoute);
app.use(router);

// 404 + error fallbacks
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => res.status(500).json({ success: false, error: err.message || 'Server error' }));

// PORT
const PORT = process.env.PORT || 8000;

// Test DB connection and start server
sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1);
    });
