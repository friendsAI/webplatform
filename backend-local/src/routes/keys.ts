import { Router } from 'express';
import { execSync,exec } from 'child_process';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';
import db from '../db.js';
import { uploadDir, encryptedDir, envDir } from '../config/paths.js';

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
    //const baseDir = '/home/projects/TEE_trustflow/test';
    const keyDir = path.join(envDir, id);
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

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'invalid id' });
  try {
    const trx = db.transaction((keyId: string) => {
      const existing = db.prepare('SELECT id FROM data_encrypt_key WHERE id = ?').get(keyId);
      if (!existing) throw new Error('指定的密钥不存在');
      db.prepare('DELETE FROM data_encrypt_key WHERE id = ?').run(keyId);
    });

    trx(id);  
    res.json({ ok: true });  // 成功返回
  } catch (error: any) {
    console.error('删除密钥失败:', error);
    res.status(500).json({ error: error.message || '删除失败' });
  }
  });


// 加密接口
router.post('/encrypt', async (req, res) => {
  const { fileId, keyId } = req.body;
  if (isNaN(Number(fileId)) || !keyId.trim()) {
    return res.status(400).json({ error: 'fileId或keyId格式不正确' });
  }

  try {
    // 获取加密密钥
    const keyRow = db.prepare('SELECT enc_key FROM data_encrypt_key WHERE id = ?').get(keyId) as { enc_key: string };
    if (!keyRow) return res.status(404).json({ error: '未找到密钥' });

    // 获取源文件信息
    const fileRow = db.prepare('SELECT filename,filepath FROM uploaded_files WHERE id = ?').get(Number(fileId)) as { filename: string; filepath: string };
    if (!fileRow) return res.status(404).json({ error: '未找到源文件' });

    const sourceFilePath = `${fileRow.filepath}`;
    const destFilePath = path.join(envDir, keyId, fileRow.filename+'.enc');

    // 生成加密命令
    const encryptCmd = `bash -c "source ~/.bashrc && conda activate capsule-manager-sdk && cms_util encrypt-file --source-file ${sourceFilePath} --dest-file ${destFilePath} --data-key-b64 ${keyRow.enc_key}"`;
    console.log('sourceFilePath:',sourceFilePath);
    console.log('destFilePath:',destFilePath);

    // 执行加密命令
    exec(encryptCmd, (err, stdout, stderr) => {
      if (err) {
        console.error('加密失败:', stderr);
        return res.status(500).json({ error: '加密命令执行失败' });
      }

      console.log('加密成功!', stdout);

      // 插入到 encrypted_files 表
      const encryptedId = randomUUID();
      const insertEncrypted = db.prepare(
        `INSERT INTO encrypted_files (id, file_id, key_id, encrypted_file_path, status, created_on)
         VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))`
      );

      const updateKeyStatus = db.prepare(
        `UPDATE data_encrypt_key SET status = 'invalid' WHERE id = ?`
      );
      
      const stmt = db.prepare(`
        UPDATE data_encrypt_key
        SET assets_id = (SELECT id FROM data_assets WHERE file_id = @fileId)
        WHERE id = @keyId
      `);
      
      const transaction = db.transaction(() => {
        insertEncrypted.run(encryptedId, fileId, keyId, destFilePath, 'success');
        updateKeyStatus.run(keyId);
        stmt.run({ fileId, keyId });
      });

      transaction();

      res.json({ ok: true, id: encryptedId });
    });
  } catch (err) {
    console.error('加密接口异常:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;

