-- data_encrypt_key：存放每条密钥记录
CREATE TABLE IF NOT EXISTS data_encrypt_key (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    -- 用 base64 字符串直接存储生成的密钥
    "key"       TEXT    NOT NULL,

    assets_id   INTEGER NOT NULL,   -- 引用 data_assets.id
    file_id     INTEGER,            -- 可为空；引用 uploaded_files.id

    status      TEXT DEFAULT 'pending',       -- pending | done | failed
    created_by  TEXT,                         -- 生成者（可填用户名 / 系统）
    created_on  DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- 外键约束
    FOREIGN KEY (assets_id) REFERENCES data_assets(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (file_id)   REFERENCES uploaded_files(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- 建议索引：按资产或文件快速查询
CREATE INDEX IF NOT EXISTS idx_encrypt_key_assets
          ON data_encrypt_key (assets_id);
CREATE INDEX IF NOT EXISTS idx_encrypt_key_file
          ON data_encrypt_key (file_id);
