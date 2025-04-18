import React from 'react';
import { Typography, Input, Button, Table, Space, Tag } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const TasksPage = () => {
  // 模拟数据
  const dataSource = [
    {
      key: '1',
      name: '数据处理任务1',
      type: '数据清洗',
      status: '运行中',
      progress: '75%',
      startTime: '2024-03-20 10:00',
      creator: '张三',
    },
    {
      key: '2',
      name: '数据处理任务2',
      type: '数据转换',
      status: '已完成',
      progress: '100%',
      startTime: '2024-03-19 15:30',
      creator: '李四',
    },
  ];

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === '运行中' ? 'green' : status === '已完成' ? 'blue' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>查看</a>
          <a>暂停</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: '24px' }}>
        <Title level={2}>任务管理</Title>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Input
            placeholder="搜索任务"
            prefix={<SearchOutlined />}
            style={{ width: '300px' }}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            新建任务
          </Button>
        </div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </>
  );
};

export default TasksPage; 