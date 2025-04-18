import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const UsersPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>用户权限管理</Title>
      <div>用户权限页面内容</div>
    </div>
  );
};

export default UsersPage; 