import React from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  DatabaseOutlined,
  KeyOutlined,
  ProfileOutlined,
  FileOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

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
      label: 'Dashboard',
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
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Title level={4} style={{ margin: 0 }}>DASHBOARD</Title>
        <Button 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
        >
          Log Out
        </Button>
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