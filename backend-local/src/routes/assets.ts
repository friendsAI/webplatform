import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import db from '../db.js';

/**
 * /api/assets router (fix missing f.path 2025‑04‑24)
 */
const router = Router();

// 上传目录（与上传接口保持一致）
const UPLOAD_DIR = path.resolve('upload');

/* ---------------------------------------------------------------------------
 * helpers
 * -------------------------------------------------------------------------*/
const toBitOrNull = (v: any): number | null =>
  v === undefined || v === null ? null : v ? 1 : 0;

/* ---------------------------------------------------------------------------
 * GET /api/assets/list
 * -------------------------------------------------------------------------*/
router.get('/list', (_req, res) => {
  const rows = db
    .prepare(
      `SELECT a.id,
              a.name,
              a.source,
              a.created_at,
              a.gen_key,
              a.encrypt_file,
              a.submit_enc_file,
              f.filename,
              f.filesize,
              f.uploaded_at
       FROM data_assets a
       LEFT JOIN uploaded_files f ON a.file_id = f.id
       ORDER BY a.created_at DESC`
    )
    .all();

  res.json(rows);
});

/* ---------------------------------------------------------------------------
 * POST /api/assets —— 新增
 * -------------------------------------------------------------------------*/
router.post('/', (req, res) => {
  const { name, source = 'upload', file_id, gen_key, encrypt_file, submit_enc_file } = req.body ?? {};
  if (!name || !file_id) return res.status(400).json({ error: 'invalid payload' });

  const stmt = db.prepare(
    `INSERT INTO data_assets
        (name, source, file_id, gen_key, encrypt_file, submit_enc_file)
     VALUES
        (@name, @source, @file_id, @gen_key, @encrypt_file, @submit_enc_file)`
  );

  const info = stmt.run({
    name,
    source,
    file_id,
    gen_key: toBitOrNull(gen_key) ?? 0,
    encrypt_file: toBitOrNull(encrypt_file) ?? 0,
    submit_enc_file: toBitOrNull(submit_enc_file) ?? 0,
  });

  res.json({ id: info.lastInsertRowid });
});

/* ---------------------------------------------------------------------------
 * PUT /api/assets/:id —— 编辑
 * -------------------------------------------------------------------------*/
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid id' });

  const { name, source, gen_key, encrypt_file, submit_enc_file } = req.body ?? {};
  if (!name) return res.status(400).json({ error: 'name required' });

  const g  = toBitOrNull(gen_key);
  const ef = toBitOrNull(encrypt_file);
  const sf = toBitOrNull(submit_enc_file);

  db.prepare(
    `UPDATE data_assets SET
        name            = @name,
        source          = COALESCE(@source,          source),
        gen_key         = COALESCE(@g,               gen_key),
        encrypt_file    = COALESCE(@ef,              encrypt_file),
        submit_enc_file = COALESCE(@sf,              submit_enc_file)
     WHERE id = @id`
  ).run({ id, name, source, g, ef, sf });

  res.json({ ok: true });
});

/* ---------------------------------------------------------------------------
 * DELETE /api/assets/:id
 * -------------------------------------------------------------------------*/
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid id' });

  const trx = db.transaction((assetId: number) => {
    const file = db
      .prepare(
        `SELECT f.id  AS file_id,
                f.filename AS filename
         FROM data_assets a
         JOIN uploaded_files f ON a.file_id = f.id
         WHERE a.id = ?`
      )
      .get(assetId) as { file_id?: number; filename?: string } | undefined;

    if (!file) throw new Error('asset not found');

    db.prepare('DELETE FROM data_assets WHERE id = ?').run(assetId);
    db.prepare('DELETE FROM uploaded_files WHERE id = ?').run(file.file_id);

    return path.join(UPLOAD_DIR, file.filename as string);
  });

  let filePath: string | undefined;
  try {
    filePath = trx(id);
  } catch (e: any) {
    return res.status(404).json({ error: e.message });
  }

  if (filePath) fs.unlink(filePath).catch(() => {});
  res.json({ ok: true });
});

/* ---------------------------------------------------------------------------
 * GET /api/assets/:id/schema —— CSV header preview
 * -------------------------------------------------------------------------*/
router.get('/:id/schema', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid id' });

  const row = db
    .prepare(
      `SELECT f.filename
       FROM data_assets a
       JOIN uploaded_files f ON a.file_id = f.id
       WHERE a.id = ?`
    )
    .get(id) as { filename?: string } | undefined;

  if (!row?.filename) return res.status(404).json({ error: 'file not found' });

  const fullPath = path.join(UPLOAD_DIR, row.filename);

  try {
    const content = await fs.readFile(fullPath, 'utf8');
    const columns = content.split(/\r?\n/, 1)[0].split(',').map((c) => c.trim());
    res.json({ columns });
  } catch {
    res.status(500).json({ error: 'failed to read csv' });
  }
});

export default router;
