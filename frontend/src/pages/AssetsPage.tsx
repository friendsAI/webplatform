import React, { useState, useEffect } from 'react';
import { buildSafeAssetUpdate, updateAsset } from './assets_edit'
import {
  Typography,
  Input,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Radio,
  Upload,
  Checkbox,
  message,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Dragger } = Upload;

const apiBase = `http://${window.location.hostname}:8888/api`;

interface Asset {
  key: string;
  id?: number;
  name: string;
  source: string;
  filename?: string;
  uploaded_at?: string;
  gen_key?: boolean;
  encrypt_file?: boolean;
  submit_enc_file?: boolean;
}

const AssetsPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<Asset[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);   // null ⇒ 新增
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');

  /* ---------- 列表 ---------- */
  const fetchAssets = async () => {
    try {
      const res = await fetch(`${apiBase}/assets/list`);
      const list = await res.json();
      setDataSource(
        list.map((i: any) => ({
          key: String(i.id),
          id: i.id,
          name: i.name,
          source: i.source,
          filename: i.filename,
          uploaded_at: i.uploaded_at,
          gen_key: !!i.gen_key,
          encrypt_file: !!i.encrypt_file,
          submit_enc_file: !!i.submit_enc_file,
       })),
      );
    } catch (e) {
      console.error(e);
      message.error('加载资产列表失败');
    }
  };
  useEffect(() => {
    fetchAssets();
  }, []);

  /* ---------- 弹窗控制 ---------- */
  const openModal = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };
  const handleEdit = (rec: Asset) => {
    setEditing(rec);
    form.setFieldsValue({ name: rec.name, source: rec.source,gen_key:rec.gen_key,encrypt_file: rec.encrypt_file,submit_enc_file: rec.submit_enc_file, });
    setVisible(true);
  };
  const closeModal = () => {
    form.resetFields();
    setEditing(null);
    setVisible(false);
  };

  /* ---------- 表单提交 ---------- */
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { name, source, file, gen_key, encrypt_file, submit_enc_file } =
        values;

      /* 编辑 */
      if (editing) {
        const res = await fetch(`${apiBase}/assets/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, source, gen_key, encrypt_file, submit_enc_file }),
        });
        if (!res.ok) throw new Error('更新失败');
        message.success('更新成功');
        closeModal();
        fetchAssets();
        return;
      }

      /* 新增 */
      const fd = new FormData();
      fd.append('file', file[0].originFileObj);
      const upRes = await fetch(`${apiBase}/upload`, {
        method: 'POST',
        body: fd,
      });
      const { file_id } = await upRes.json();
      await fetch(`${apiBase}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          source,
          file_id,
          gen_key,
          encrypt_file,
          submit_enc_file,
        }),
      });
      message.success('新增成功');
      closeModal();
      fetchAssets();
    } catch (e: any) {
      message.error(e.message || '操作失败');
    }
  };

  /* ---------- 列定义 ---------- */
  const columns = [
    { title: '资产名称', dataIndex: 'name', key: 'name' },
    { title: '数据来源', dataIndex: 'source', key: 'source' },
    { title: '文件名', dataIndex: 'filename', key: 'filename' },
    { title: '上传时间', dataIndex: 'uploaded_at', key: 'uploaded_at' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Asset) => (
        <Space>
          <a>查看</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  /* ---------- 渲染 ---------- */
  const showUploader = !editing; // === 最小增量核心 ===

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>数据资产管理</Title>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Input
          placeholder="搜索数据资产"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
          新增数据
        </Button>
      </div>

      <Table
        dataSource={dataSource.filter(
          (d) =>
            d.name.includes(search) || d.source.includes(search),
        )}
        columns={columns}
        rowKey="key"
      />

      <Modal
        title={editing ? '编辑数据资产' : '新增数据资产'}
        open={visible}
        onOk={handleOk}
        onCancel={closeModal}
        okText="确定"
        cancelText="取消"
        maskClosable={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="数据集名称"
            rules={[{ required: true, message: '请输入数据集名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item name="source" label="数据集来源" initialValue="upload">
            <Radio.Group>
              <Radio value="upload">文件上传</Radio>
            </Radio.Group>
          </Form.Item>

          {/* ---------- 文件上传 / 已存在文件名 ---------- */}
          <Form.Item
            name="file"
            label="点击此上传文件"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={
              showUploader ? [{ required: true, message: '请上传文件' }] : []
            }
          >
            {showUploader ? (
              <Dragger
                name="file"
                beforeUpload={() => false}
                multiple={false}
                style={{ padding: '24px 0' }}
              >
                <UploadOutlined style={{ fontSize: 32 }} />
                <div>点击此上传文件</div>
              </Dragger>
            ) : (
              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                已上传文件：{editing?.filename || '（无文件名）'}
              </div>
            )}
          </Form.Item>

          <Form.Item name="gen_key" valuePropName="checked">
            <Checkbox>产生密钥</Checkbox>
          </Form.Item>
          <Form.Item name="encrypt_file" valuePropName="checked">
            <Checkbox>加密文件</Checkbox>
          </Form.Item>
          <Form.Item name="submit_enc_file" valuePropName="checked">
            <Checkbox>提交应密文件</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssetsPage;

