import express from 'express';
import db from '../db.ts';

const router = express.Router();

// 新增数据资产
router.post('/', (req, res) => {
  const {
    name,
    source,
    file_id,
    gen_key = false,
    encrypt_file = false,
    submit_enc_file = false,
    created_by = 'anonymous',
  } = req.body;

  try {
    const stmt = db.prepare(
      `INSERT INTO data_assets (name, source, file_id, gen_key, encrypt_file, submit_enc_file, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const info = stmt.run(
      name,
      source,
      file_id,
      gen_key ? 1 : 0,
      encrypt_file ? 1 : 0,
      submit_enc_file ? 1 : 0,
      created_by
    );

    res.json({ asset_id: info.lastInsertRowid });
  } catch (err) {
    console.error('Insert asset error:', err);
    res.status(500).json({ error: '数据库插入失败' });
  }
});

// 查询资产列表
router.get('/list', (_req, res) => {
  const rows = db.prepare(`
    SELECT a.*, f.filename, f.filesize, f.status AS file_status
    FROM data_assets a
    LEFT JOIN uploaded_files f ON a.file_id = f.id
    ORDER BY a.created_at DESC
  `).all();
  res.json(rows);
});

export default router;
