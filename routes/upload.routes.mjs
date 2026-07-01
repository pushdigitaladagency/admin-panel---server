import express from 'express';
import fs from 'fs';
import path from 'path';
import authMiddleware from '../middleware/auth.mjs';
import upload, { UPLOAD_DIR } from '../middleware/upload.mjs';

const router = express.Router();

const toFile = (f) => ({ filename: f.filename, path: `/uploads/${f.filename}`, size: f.size, mimetype: f.mimetype });

// GET /api/media-files[?type=pdf]  -> list every physical file in the uploads folder.
// Lets the media picker show existing files (e.g. PDFs for investor documents), not
// just gallery images. Optional ?type filters by extension (e.g. pdf, png).
router.get('/media-files', authMiddleware, (req, res) => {
    try {
        const typeFilter = String(req.query.type || '').toLowerCase();
        const entries = fs.readdirSync(UPLOAD_DIR, { withFileTypes: true });
        const files = entries
            .filter((d) => d.isFile())
            .map((d) => {
                const full = path.join(UPLOAD_DIR, d.name);
                const stat = fs.statSync(full);
                const ext = path.extname(d.name).replace('.', '').toUpperCase();
                return { filename: d.name, path: `/uploads/${d.name}`, type: ext || 'FILE', size: stat.size, modified: stat.mtimeMs };
            })
            .filter((f) => !typeFilter || f.type.toLowerCase() === typeFilter)
            .sort((a, b) => b.modified - a.modified);
        res.json({ success: true, data: files });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to list uploaded files' });
    }
});

// POST /api/upload  (field: "file") -> single file
router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    res.status(201).json({ success: true, data: toFile(req.file) });
});

// POST /api/upload/multiple  (field: "files") -> up to 20 files
router.post('/upload/multiple', authMiddleware, upload.array('files', 20), (req, res) => {
    if (!req.files?.length) return res.status(400).json({ success: false, error: 'No files uploaded' });
    res.status(201).json({ success: true, data: req.files.map(toFile) });
});

// Multer-specific error handling (size limit / unsupported type).
router.use((err, req, res, next) => {
    if (err) return res.status(400).json({ success: false, error: err.message });
    next();
});

export default router;
