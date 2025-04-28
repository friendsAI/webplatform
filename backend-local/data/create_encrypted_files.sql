CREATE TABLE IF NOT EXISTS encrypt_results (
  id TEXT PRIMARY KEY,          -- 唯一ID，通常用UUID
  file_id TEXT NOT NULL,         -- 外键，关联 uploaded_files.id
  key_id TEXT NOT NULL,          -- 外键，关联 data_encrypt_key.id
  encrypted_file_path TEXT,      -- 加密后文件路径
  status TEXT DEFAULT 'pending', -- 加密状态 (pending, success, failed)
  created_by TEXT,               -- 发起加密的用户ID或用户名
  created_on TEXT DEFAULT (datetime('now', 'localtime')) -- 创建时间
);
