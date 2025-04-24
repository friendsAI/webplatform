import React, { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      //const res = await axios.post("http://localhost:8888/api/auth/login", {
      const res = await axios.post("/api/auth/login", {
        username: values.username,
        password: values.password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        message.success("登录成功");
        navigate("/main"); // ✅ 登录成功后跳转首页
      } else {
        message.error("登录失败：未返回 token");
      }
    } catch (err) {
      console.error('登录错误：', err);
      message.error("用户名或密码错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: 400, margin: "100px auto" }}>
      <Card title="用户登录">
        <Form onFinish={handleLogin}>
          <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;

