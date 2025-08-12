import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Input, Button, DatePicker, List, Checkbox, Popconfirm, 
  Space 
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getToken, removeToken, isLogin } from '../auth';

// 后端接口地址（请替换为你的实际接口）
const BASE_URL = 'http://localhost:5000/api/todos';

const todoList = () => {
  // 状态管理
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 页面加载时验证登录状态并加载数据
  useEffect(() => {
    // 未登录则跳转到登录页
    if (!isLogin()) {
      navigate('/login');
      return;
    }
    
    // 已登录则加载任务列表
    fetchTodos();
  }, [navigate]);

  // 获取任务列表（带身份验证）
  const fetchTodos = async () => {
    try {
      const response = await axios.get(BASE_URL, {
        headers: { 
          Authorization: `Bearer ${getToken()}`  // 携带Token验证身份
        }
      });
      setTodos(response.data || []);
    } catch (error) {
      console.error('获取任务失败:', error);
      // Token无效或过期，强制退出登录
      if (error.response?.status === 401) {
        message.error('登录已过期，请重新登录');
        removeToken();
        navigate('/login');
        return;
      }
      // 其他错误显示本地示例数据
      setTodos([
        { id: 1, title: '示例任务1', completed: false, dueDate: '2025-12-31' },
        { id: 2, title: '示例任务2', completed: true, dueDate: '2025-11-30' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 添加新任务
  const addTodo = async () => {
    if (!taskName.trim()) return;

    try {
      const newTodo = {
        title: taskName,
        dueDate: dueDate ? dueDate.format('YYYY-MM-DD') : null,
        completed: false
      };

      const response = await axios.post(BASE_URL, newTodo, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      // 添加成功，更新本地列表
      setTodos([...todos, response.data]);
      // 清空输入
      setTaskName('');
      setDueDate(null);
    } catch (error) {
      console.error('添加任务失败:', error);
      // 本地临时添加，提升用户体验
      setTodos([
        ...todos,
        { ...newTodo, id: Date.now() }  // 用时间戳作为临时ID
      ]);
    }
  };

  // 更新任务完成状态
  const updateTodoStatus = async (id, completed) => {
    try {
      await axios.put(`${BASE_URL}/${id}`, { completed }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      // 本地更新状态
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('更新状态失败:', error);
      // 本地更新，确保用户操作有反馈
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    }
  };

  // 删除任务
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      // 本地删除
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('删除任务失败:', error);
      // 本地删除，确保用户操作有反馈
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  // 退出登录
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // 加载中状态
  if (isLoading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        maxWidth: 1200, 
        width: '100%', 
        margin: '0 auto' 
      }}>
        {/* 顶部区域：标题 + 退出登录按钮 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px' 
        }}>
          <h1 style={{ 
            fontSize: '28px', 
            color: '#333',
            margin: 0 
          }}>
            Todo List
          </h1>
          <Button danger onClick={handleLogout}>
            退出登录
          </Button>
        </div>

        {/* 输入区域 */}
        <Space size="middle" style={{ 
          width: '100%', 
          marginBottom: '30px',
          display: 'flex',
          flexWrap: 'wrap'
        }}>
          <Input 
            placeholder="输入任务名称" 
            value={taskName} 
            onChange={(e) => setTaskName(e.target.value)} 
            style={{ flex: 1, minWidth: '150px' }}
            onPressEnter={addTodo}
          />
          <DatePicker 
            value={dueDate} 
            onChange={(date) => setDueDate(date)} 
            placeholder="截止日期"
            style={{ minWidth: '150px' }}
          />
          <Button type="primary" onClick={addTodo}>
            添加
          </Button>
        </Space>

        {/* 任务列表 */}
        {todos.length > 0 ? (
          <List
            dataSource={todos}
            renderItem={todo => (
              <List.Item style={{ 
                padding: '12px 0', 
                borderBottom: '1px solid #f0f0f0' 
              }}>
                <Checkbox 
                  checked={todo.completed} 
                  onChange={(e) => updateTodoStatus(todo.id, e.target.checked)}
                  style={{ fontSize: '16px' }}
                >
                  <span style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#999' : '#333'
                  }}>
                    {todo.title}
                  </span>
                  {todo.dueDate && (
                    <span style={{ 
                      marginLeft: '15px', 
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      截止：{todo.dueDate}
                    </span>
                  )}
                </Checkbox>
                <Popconfirm 
                  title="确定删除？" 
                  onConfirm={() => deleteTodo(todo.id)}
                  placement="right"
                >
                  <DeleteOutlined style={{ 
                    color: '#ff4d4f', 
                    marginLeft: '15px',
                    cursor: 'pointer'
                  }} />
                </Popconfirm>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 0', 
            color: '#666'
          }}>
            暂无任务，添加一个吧～
          </div>
        )}
      </div>
    </div>
  );
};

export default todoList;
