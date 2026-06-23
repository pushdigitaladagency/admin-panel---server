import express from 'express';
import authMiddleware from '../middleware/auth.mjs';
import upload from '../middleware/upload.mjs';

const router = express.Router();

const toFile = (f) => ({ filename: f.filename, path: `/uploads/${f.filename}`, size: f.size, mimetype: f.mimetype });

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
