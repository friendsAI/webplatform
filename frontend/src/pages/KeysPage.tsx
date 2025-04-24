import React, { useEffect, useState } from 'react';
import { Typography,Input,Button,Table,Space,Tag,message, } from 'antd';

const { Title } = Typography;
const apiBase = `http://${window.location.hostname}:8888/api`;

interface KeyRow {
  key: string;
  id?: number;
  enc_key: string;
  status: 'valid' | 'invalid';
  asset_name: string;
  created_on: string;
}

const KeysPage: React.FC = () => {
  const [rows, setRows] = useState<KeyRow[]>([]);
  const [search, setSearch] = useState('');  
  /* ---------- 获取列表 ---------- */
  const fetchKeys = async () => {
    try {
      const res = await fetch(`${apiBase}/keys/list`);
      const list = await res.json();
      setRows(
        list.map((i: any) => ({
          key: String(i.id),
          id: i.id,
          enc_key: i.enc_key,
          status: i.status,
          asset_name: i.asset_name,
          created_on: i.created_on,
        }))
      );
    } catch (e) {
      console.error(e);
      message.error('加载密钥列表失败');
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  /* ---------- 产生密钥 ---------- */
  const handleGenerate = () => {
    message.info('TODO: 调用后端产生密钥接口');
  };

  /* ---------- 加密操作 ---------- */
  const handleEncrypt = (rec: KeyRow) => {
    message.info(`TODO: 对资产“${rec.asset_name}”执行加密 (key #${rec.id})`);
  };

  /* ---------- 列定义 ---------- */
  const columns = [
    {
      title: '密钥名称',
      dataIndex: 'enc_key',
      key: 'enc_key',
      render: (k: string) => k.slice(0, 8) + '…',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'valid' ? 'green' : 'red'}>
          {s === 'valid' ? '未使用/有效' : '已使用/失效'}
        </Tag>
      ),
    },
    { title: '资产名称', dataIndex: 'asset_name', key: 'asset_name' },
    { title: '产生时间', dataIndex: 'created_on', key: 'created_on' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, rec: KeyRow) => (
        <Space>
          <a onClick={() => handleEncrypt(rec)}>加密</a>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <Title level={2}>密钥管理</Title>
      <div>密钥管理页面内容</div>
    </div>
  );
};

export default KeysPage; 