import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // 创建message实例（解决静态方法警告）
  const [messageApi, contextHolder] = message.useMessage();

  const handleRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      // 使用实例方法替代静态方法
      messageApi.error('两次密码不一致');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username: values.username,
        password: values.password
      });
      
      // 使用实例方法显示成功提示
      messageApi.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      messageApi.error(error.response?.data?.msg || '注册失败');
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
      {/* 必须添加contextHolder到组件树中，否则提示不显示 */}
      {contextHolder}
      
      <Card title="注册" style={{ width: 350 }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleRegister}
        >
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
          
          <Form.Item 
            name="confirmPassword" 
            label="确认密码" 
            rules={[{ required: true, message: '请确认密码' }]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            已有账号？<Link to="/login">去登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
