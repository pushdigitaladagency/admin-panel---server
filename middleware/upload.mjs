import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Ensure the upload directory exists at startup.
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safe = path.basename(file.originalname, ext).replace(/[^a-z0-9]+/gi, '-').slice(0, 40);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}${ext}`);
    }
});

// Images / documents + video. Anchored to the full extension so short video
// extensions (mov, avi, mkv) can't substring-match an unintended filename.
const ALLOWED = /^\.(jpe?g|png|gif|webp|svg|pdf|docx?|xlsx?|mp4|webm|mov|avi|mkv|m4v|wmv)$/;
const fileFilter = (req, file, cb) => {
    const ext = ALLOWED.test(path.extname(file.originalname).toLowerCase());
    if (ext) return cb(null, true);
    cb(new Error('Unsupported file type'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 500 * 1024 * 1024 } // 500 MB (raised for video uploads)
});

export default upload;
