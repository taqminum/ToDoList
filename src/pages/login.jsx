import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';
import { setToken } from '../auth';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // 创建message实例（核心优化点）
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: values.username,
        password: values.password
      });
      
      setToken(response.data.token);
      // 使用实例方法显示成功提示
      messageApi.success('登录成功');
      navigate('/');
    } catch (error) {
      // 使用实例方法显示错误提示（包括输错密码的情况）
      messageApi.error(error.response?.data?.msg || '登录失败');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5' 
    }}>
      {/* 必须添加contextHolder到组件树，否则提示不显示 */}
      {contextHolder}
      
      <Card title="登录" style={{ width: 350 }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleLogin}
        >
          {/* 表单内容保持不变 */}
          <Form.Item 
            name="username" 
            label="用户名" 
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            label="密码" 
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            还没有账号？<Link to="/register">去注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
    