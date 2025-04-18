import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const LogsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>日志管理</Title>
      <div>日志页面内容</div>
    </div>
  );
};

export default LogsPage; 