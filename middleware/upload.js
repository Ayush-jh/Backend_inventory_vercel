import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`)
});

const fileFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|webp/.test(file.mimetype);
  cb(ok ? null : new Error('Only images allowed'), ok);
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });