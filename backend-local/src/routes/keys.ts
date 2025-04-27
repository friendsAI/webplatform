import { Router } from 'express';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';
import db from '../db.js';

const router = Router();

router.get('/list', (_req, res) => {
    //res.json([]); // 先返回空列表让前端不报错
    const rows = db.prepare(
      `SELECT
         k.id, k.enc_key, k.status, k.created_on,
         a.name AS asset_name
       FROM data_encrypt_key k
       LEFT JOIN data_assets a ON k.assets_id = a.id
       ORDER BY k.created_on DESC`
    ).all();
    res.json(rows);
  });

  router.post('/generate', async (_req, res) => {
    try {
      const id = randomUUID();
      const baseDir = '/home/projects/TEE_trustflow/test';
      const keyDir = path.join(baseDir, id);
      fs.mkdirSync(keyDir, { recursive: true });
  
      // 切换环境 & 生成密钥
      const command = `
        source ~/.bashrc && \
        conda activate capsule-manager-sdk && \
        cd ${keyDir} && \
        cms_util generate-data-key-b64
      `;
  
      const stdout = execSync(command, { shell: '/bin/bash', encoding: 'utf-8' });
      const key = stdout.trim(); // 直接拿到 base64 key
  
      db.prepare(
        `INSERT INTO data_encrypt_key (id, enc_key, status, created_on)
         VALUES (?, ?, 'valid', datetime('now', 'localtime'))`
      ).run(id, key);
  
      res.json({ ok: true, id });
    } catch (err: any) {
      console.error('密钥生成失败:', err);
      res.status(500).json({ ok: false, error: '密钥生成失败' });
    }
  });

  // 新增接口：根据资产 名称 获取文件列表
  router.get('/files/by-asset/:assetsId', (req, res) => {
    //const { assetsId } = req.params;
    try {
      const files = db.prepare(
        `SELECT id, filename, uploaded_at
         FROM uploaded_files
         ORDER BY uploaded_at DESC`
      ).all();
      res.json(files);
    } catch (err) {
      console.error('查询文件失败:', err);
      res.status(500).json({ error: '查询失败' });
    }
  });

export default router;

