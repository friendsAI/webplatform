// backend-local/src/routes/upload.ts
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../db.ts';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { uploadDir } from '../config/paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

//const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req: Request & { file?: any }, res: Response) => {
  //console.log('📦 收到上传请求');
  //console.log('🧾 req.file:', req.file);

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { originalname, filename, size, path: filepath } = req.file;
  const stmt = db.prepare(
    `INSERT INTO uploaded_files (filename, filepath, filesize, status, uploaded_by) VALUES (?, ?, ?, ?, ?)`
  );
  const info = stmt.run(originalname, filepath, size, 'success', 'anonymous');

  res.json({ file_id: info.lastInsertRowid });
});

export default router;