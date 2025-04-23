import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

import db from '../db.js';

/**
 * Router for /api/assets
 */
const router = Router();

/* ---------------------------------------------------------------------------
 * GET /api/assets/list
 * -------------------------------------------------------------------------*/
router.get('/list', (_req, res) => {
  const rows = db
    .prepare(
      `SELECT a.id,
              a.name,
              a.source,
              a.gen_key,
	      a.encrypt_file,
              a.submit_enc_file,
              a.created_at,
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
 * DELETE /api/assets/:id
 * -------------------------------------------------------------------------*/
router.delete('/:id', (req, res) => {
  const assetId = Number(req.params.id);
  if (!assetId) return res.status(400).json({ error: 'invalid id' });

  const trx = db.transaction((id: number) => {
    const file = db
      .prepare(
        `SELECT f.id   AS file_id,
                f.path AS path
           FROM data_assets a
           JOIN uploaded_files f ON a.file_id = f.id
          WHERE a.id = ?`
      )
      .get(id) as { file_id?: number; path?: string } | undefined;

    if (!file) throw new Error('asset not found');

    db.prepare('DELETE FROM data_assets WHERE id = ?').run(id);
    db.prepare('DELETE FROM uploaded_files WHERE id = ?').run(file.file_id);

    return file.path;
  });

  let filePath: string | undefined;
  try {
    filePath = trx(assetId);
  } catch (e: any) {
    return res.status(404).json({ error: e.message });
  }

  if (filePath) fs.unlink(filePath).catch(() => {});

  res.json({ ok: true });
});

/* ---------------------------------------------------------------------------
 * POST /api/assets
  * -------------------------------------------------------------------------*/
router.post('/', (req, res) => {
  const {
    name,
    source       = 'upload',
    file_id,
    gen_key      = 0,
    encrypt_file = 0,
    submit_enc_file = 0,
  } = req.body ?? {};

  if (!name || !file_id)
    return res.status(400).json({ error: 'invalid payload' });

  const stmt = db.prepare(`
    INSERT INTO data_assets
      (name, source, file_id, gen_key, encrypt_file, submit_enc_file)
    VALUES
      (@name, @source, @file_id, @gen_key, @encrypt_file, @submit_enc_file)
  `);

  const info = stmt.run({
    name,
    source,
    file_id,
    gen_key,
    encrypt_file,
    submit_enc_file,
  });

  res.json({ id: info.lastInsertRowid });
});


/* ---------------------------------------------------------------------------
 * PUT /api/assets/:id
 * -------------------------------------------------------------------------*/
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, source,gen_key, encrypt_file, submit_enc_file } = req.body ?? {};
  if (!id || !name) return res.status(400).json({ error: 'invalid payload' });

  db.prepare(
    `UPDATE data_assets
        SET name        = @name,
            source      = COALESCE(@source, source),
            gen_key         = COALESCE(@gen_key, gen_key),
            encrypt_file    = COALESCE(@encrypt_file,encrypt_file),
            submit_enc_file = COALESCE(@submit_enc_file, submit_enc_file)
      WHERE id = @id`
  ).run({ id, name, source  });

  res.json({ ok: true });
});

/* ---------------------------------------------------------------------------
 * GET /api/assets/:id/schema
 * -------------------------------------------------------------------------*/
router.get('/:id/schema', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid id' });

  const row = db
    .prepare(
      `SELECT f.path
         FROM data_assets a
         JOIN uploaded_files f ON a.file_id = f.id
        WHERE a.id = ?`
    )
    .get(id) as { path?: string } | undefined;

  if (!row?.path) return res.status(404).json({ error: 'file not found' });

  try {
    const content = await fs.readFile(row.path, 'utf8');
    const firstLine = content.split(/\r?\n/, 1)[0];
    const columns = firstLine.split(',').map((c) => c.trim());
    res.json({ columns });
  } catch {
    res.status(500).json({ error: 'failed to read csv' });
  }
});

export default router;

