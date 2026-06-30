import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthCheckRoute from './app.mjs';
import { sequelize } from './model/index.mjs';
import router from './routes/index.js';
import path from 'path';
import { UPLOAD_DIR } from './middleware/upload.mjs';

dotenv.config();

const app = express();

// Middleware (must be registered before routes)
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true, exposedHeaders: ['Content-Length'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (resumes, cover letters, certificates, logos, investor PDFs, etc.).
// Resumes/cover letters come in many formats, so set an explicit Content-Type per
// extension and render INLINE by default (so the in-app viewer can display PDFs/images
// in an iframe). `?download=1` forces a save dialog instead (reliable cross-origin).
const INLINE_TYPES = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.txt': 'text/plain; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime'
};

app.use('/uploads', express.static(UPLOAD_DIR, {
    index: false,
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        if (INLINE_TYPES[ext]) res.setHeader('Content-Type', INLINE_TYPES[ext]);
        // Only set Content-Disposition for an explicit download (?download=1). For
        // normal viewing we omit it entirely: renderable types (PDF, text, images)
        // then display inline in the iframe. Sending `inline; filename=...` makes
        // Chrome treat a framed load as a download and render nothing (blank/white).
        if (res.req?.query?.download === '1') {
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(path.basename(filePath))}"`);
        }
        // Allow the file to be embedded in the admin panel's iframe viewer.
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

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
