import React from 'react';
import { Layout, Menu, Button, Typography,Space } from 'antd';
import {
  DatabaseOutlined,
  KeyOutlined,
  ProfileOutlined,
  FileOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import companyLogo from '../static/company-logo.jpg';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'main',
      icon: <DatabaseOutlined />,
      label: '首页',
    },
    {
      key: 'assets',
      icon: <DatabaseOutlined />,
      label: '数据资产',
    },
    {
      key: 'keys',
      icon: <KeyOutlined />,
      label: '密钥管理',
    },
    {
      key: 'tasks',
      icon: <ProfileOutlined />,
      label: '任务管理',
    },
    {
      key: 'logs',
      icon: <FileOutlined />,
      label: '日志',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户权限',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
  background: '#fff',
  padding: '0 24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  height: '64px'
}}>
  {/* 只在内部加flex容器 */}
  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
    {/* 左边空 */}
    <div style={{ flex: 1 }} />

    {/* 中间标题 */}
    <div style={{ flex: 1, textAlign: 'center' }}>
      <Title level={4} style={{ margin: 0,fontSize: '32px',  color: '#1890ff' }}>
        天 行 网 安 机 密 计 算 平 台
      </Title>
    </div>

    {/* 右边图片 + 按钮 */}
    <div style={{ flex: 1, textAlign: 'right' }}>
      <Space size="middle">
        <img src={companyLogo} alt="Company Logo" style={{ height: '120px' }} />
        <Button 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          style={{
            backgroundColor: '#e6f7ff',
            borderColor: '#91d5ff',
            color: '#1890ff'
          }}
        >
          Log Out
        </Button>
      </Space>
    </div>
  </div>
</Header>

      <Layout>
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname.substring(1)]}
            defaultSelectedKeys={['main']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => navigate(`/${key}`)}
          />
        </Sider>
        <Content style={{ padding: '24px', background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 