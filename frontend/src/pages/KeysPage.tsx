import React, { useEffect, useState } from 'react';
import {
  Typography,
  Input,
  Button,
  Table,
  Space,
  Tag,
  message,
  Modal,
  Radio,
  Pagination,
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const apiBase = `http://${window.location.hostname}:8888/api`;

interface KeyRow {
  key: string;
  id?: number;
  folder: string;
  enc_key: string;
  status: 'valid' | 'invalid';
  asset_name: string;
  created_on: string;
}

interface FileItem {
  id: string;
  filename: string;
  uploaded_at: string;
}

const KeysPage: React.FC = () => {
  const [rows, setRows] = useState<KeyRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [encryptModalVisible, setEncryptModalVisible] = useState(false);
  const [encryptTarget, setEncryptTarget] = useState<KeyRow | null>(null);
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/keys/list`);
      const list = await res.json();
      setRows(
        Array.isArray(list)
          ? list.map((i: any) => ({
              key: String(i.id),
              id: i.id,
              folder: i.id,
              enc_key: i.enc_key,
              status: i.status,
              asset_name: i.asset_name,
              created_on: i.created_on,
            }))
          : []
      );
    } catch (e) {
      console.error(e);
      message.error('加载密钥列表失败');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleGenerate = async () => {
    try {
      const res = await fetch(`${apiBase}/keys/generate`, {
        method: 'POST',
      });
      const result = await res.json();
      if (result.ok) {
        message.success('密钥生成成功');
        fetchKeys();
      } else {
        message.error(result.error || '密钥生成失败');
      }
    } catch (e) {
      console.error(e);
      message.error('请求失败，无法生成密钥');
    }
  };

  const handleEncrypt = async (rec: KeyRow) => {
    setEncryptTarget(rec);
    setSelectedFileId(null);
    setPage(1);
    try {
      const res = await fetch(`${apiBase}/keys/files/by-asset/${rec.id}`);
      const list = await res.json();
      setFileList(Array.isArray(list) ? list : []);
      setEncryptModalVisible(true);
    } catch (e) {
      console.error('加载文件失败', e);
      message.error('加载文件失败');
      setFileList([]);
    }
  };

  const handleSubmitKey=async (rec: KeyRow) => {

  };


  const handleDelete = (rec: KeyRow) => {
      Modal.confirm({
        title: `确定删除「${rec.id}」吗？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          try {
            const res = await fetch(`${apiBase}/keys/${rec.id}`, {
              method: 'DELETE',
            });
            const result = await res.json();
      if (!res.ok || result.error) throw new Error( result.error || '删除失败');
            message.success('删除成功');
            fetchKeys();
          } catch (e: any) {
            message.error(e.message || '删除失败');
          }
        },
      });
    }; 





  const columns = [
    {
      title: '密钥名称',
      dataIndex: 'folder',
      key: 'folder',
      render: (f: string) => f,
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
          {rec.status === 'invalid' ? (
            <span style={{ color: 'gray', cursor: 'not-allowed' }}>加密</span>
          ) : (
          <a onClick={() => handleEncrypt(rec)}>加密</a>
          )}
          <a onClick={() => handleSubmitKey(rec)}>提交密钥</a> 
          <a onClick={() => handleDelete(rec)}>删除</a> 
        </Space>
      ),
    },
  ];

  const currentPageFiles = fileList.slice((page - 1) * 5, page * 5);

  return (
    <div style={{ padding: 24 }}>
      

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          placeholder="搜索密钥 / 资产名称"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleGenerate}>
          产生密钥
        </Button>
      </div>

      <Table
        dataSource={rows.filter((r) => {
          const kw = search.toLowerCase();
          return (
            r.folder.toLowerCase().includes(kw) ||
            r.asset_name.toLowerCase().includes(kw)
          );
        })}
        columns={columns}
        rowKey="key"
        loading={loading}
        locale={{ emptyText: '暂无密钥数据' }}
      />

      <Modal
        open={encryptModalVisible}
        title="选择待加密文件"
        onCancel={() => setEncryptModalVisible(false)}
        
        onOk={async () => {
          if (selectedFileId && encryptTarget) {
            try {
              const res = await fetch(`${apiBase}/keys/encrypt`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  fileId: selectedFileId,
                  keyId: encryptTarget.id,
                }),
              });
        
              const result = await res.json();
        
              if (res.ok) {
                message.success('加密成功！');
                setEncryptModalVisible(false);
                window.location.reload(); //加密成功后重新刷新页面
                //</div>fetch(`${apiBase}/keys`)
                  //.then((res) => res.json())
                  //.then((data) => setKeysList(data));
              } else {
                message.error(`加密失败: ${result.error || '未知错误'}`);
              }
            } catch (err) {
              console.error('请求加密失败:', err);
              message.error('请求加密接口失败');
            }
          } else {
            message.warning('请先选择一个文件');
          }
        }}        
        okText="加密"
        cancelText="取消"
        width={500}
      >
        <Table
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedFileId ? [selectedFileId] : [],
            onChange: (selectedRowKeys) => setSelectedFileId(selectedRowKeys[0] as string),
          }}
          columns={[
            {
              title: '序号',
              render: (_: any, __: any, index: number) => (page - 1) * 5 + index + 1,
            },
            { title: '文件名', dataIndex: 'filename', key: 'filename' },
            { title: '上传时间', dataIndex: 'uploaded_at', key: 'uploaded_at' },
          ]}
          dataSource={currentPageFiles.map((f) => ({ ...f, key: f.id }))}
          pagination={false}
          rowKey="id"
        />
        <Pagination
          current={page}
          pageSize={5}
          total={fileList.length}
          onChange={setPage}
          style={{ marginTop: 16, textAlign: 'right' }}
        />
      </Modal>
    </div>
  );
};

export default KeysPage;
