import React, { useState } from 'react';
import { Typography, Input, Button, Table, Space, Modal, Form, Radio, Upload, Checkbox } from 'antd';
import { SearchOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Dragger } = Upload;

const AssetsPage: React.FC = () => {
  // 列表数据（模拟）
  const dataSource = [
    { key: '1', name: '数据资产1', type: '结构化数据', source: '系统A', updateTime: '2024-03-20', status: '正常' },
    { key: '2', name: '数据资产2', type: '非结构化数据', source: '系统B', updateTime: '2024-03-19', status: '正常' },
  ];

  const columns = [
    { title: '资产名称', dataIndex: 'name', key: 'name' },
    { title: '资产类型', dataIndex: 'type', key: 'type' },
    { title: '数据来源', dataIndex: 'source', key: 'source' },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作', key: 'action', render: () => (
        <Space size="middle">
          <a>查看</a>
          <a>编辑</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  // 弹窗控制
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const openModal = () => setVisible(true);
  const closeModal = () => {
    form.resetFields();
    setVisible(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('提交的数据：', values);
      // TODO: 提交到后台
      closeModal();
    } catch (err) {
      // 验证失败
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>数据资产管理</Title>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input placeholder="搜索数据资产" prefix={<SearchOutlined />} style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
          新增数据
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} />

      {/* 新增资产弹窗 */}
      <Modal
        title="新增数据资产"
        open={visible}
        onOk={handleOk}
        onCancel={closeModal}
        okText="确定"
        cancelText="取消"
        maskClosable={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="数据集名称"
            name="name"
            rules={[{ required: true, message: '请输入数据集名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item label="数据集来源" name="source" initialValue="upload">
            <Radio.Group>
              <Radio value="upload">文件上传</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="点击此上传文件"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={[{ required: true, message: '请上传文件' }]}
          >
            <Dragger name="file" beforeUpload={() => false} multiple={false} style={{ padding: '24px 0' }}>
              <UploadOutlined style={{ fontSize: 32 }} />
              <div>点击此上传文件</div>
            </Dragger>
          </Form.Item>

          <Form.Item name="options" valuePropName="checkedList">
            <Checkbox value="genKey">产生密钥</Checkbox>
            <Checkbox value="encryptFile">加密文件</Checkbox>
            <Checkbox value="submitEncFile">提交应密文件</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssetsPage;
