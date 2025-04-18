import React from 'react';
import { Card, List } from 'antd';

const MainPage = () => {
  // 模拟数据
  const assetData = [
    { name: '资产1', value: '85%' },
    { name: '资产2', value: '70%' },
    { name: '资产3', value: '55%' },
    { name: '资产4', value: '40%' },
    { name: '资产5', value: '25%' },
  ];

  const taskData = [
    { name: '任务1', value: '80%' },
    { name: '任务2', value: '65%' },
    { name: '任务3', value: '45%' },
    { name: '任务4', value: '30%' },
    { name: '任务5', value: '20%' },
  ];

  return (
    <>
      <Card title="Top 5 数据资产" style={{ marginBottom: '24px' }}>
        <List
          dataSource={assetData}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
              />
              <div style={{ 
                width: '200px',
                height: '20px',
                background: '#f0f0f0',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: item.value,
                  height: '100%',
                  background: '#1890ff',
                  transition: 'all 0.3s'
                }} />
              </div>
              <div style={{ marginLeft: '10px', minWidth: '45px' }}>{item.value}</div>
            </List.Item>
          )}
        />
      </Card>
      <Card title="Top 5 任务">
        <List
          dataSource={taskData}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
              />
              <div style={{ 
                width: '200px',
                height: '20px',
                background: '#f0f0f0',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: item.value,
                  height: '100%',
                  background: '#52c41a',
                  transition: 'all 0.3s'
                }} />
              </div>
              <div style={{ marginLeft: '10px', minWidth: '45px' }}>{item.value}</div>
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default MainPage;
