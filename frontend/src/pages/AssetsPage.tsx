import React from 'react';
import { Typography, Input, Button, Table, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AssetsPage = () => {
  // 模拟数据
  const dataSource = [
    {
      key: '1',
      name: '数据资产1',
      type: '结构化数据',
      source: '系统A',
      updateTime: '2024-03-20',
      status: '正常',
    },
    {
      key: '2',
      name: '数据资产2',
      type: '非结构化数据',
      source: '系统B',
      updateTime: '2024-03-19',
      status: '正常',
    },
  ];

  const columns = [
    {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '资产类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '数据来源',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看</a>
          <a>编辑</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Title level={2}>数据资产管理</Title>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Input
            placeholder="搜索数据资产"
            prefix={<SearchOutlined />}
            style={{ width: '300px' }}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            新增数据
          </Button>
        </div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </>
  );
};

export default AssetsPage; 