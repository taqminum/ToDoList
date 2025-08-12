import React, { useState, useEffect } from 'react';
import { Input, Button, DatePicker, List, Checkbox, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

// 后端接口地址（请替换为你的实际接口）
const BASE_URL = 'http://localhost:5000/api/todos';

const TodoList = () => {
  // 状态管理
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 加载状态

  // 初始化加载数据
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(BASE_URL);
        setTodos(response.data || []); // 确保是数组
      } catch (error) {
        console.error('获取数据失败:', error);
        // 失败时显示本地测试数据，避免空白
        setTodos([
          { id: 1, title: '示例任务1', completed: false, dueDate: '2025-12-31' },
          { id: 2, title: '示例任务2', completed: true, dueDate: '2025-11-30' }
        ]);
      } finally {
        setIsLoading(false); // 无论成功失败都结束加载
      }
    };

    fetchTodos();
  }, []);

  // 添加任务
  const addTodo = async () => {
    if (!taskName.trim()) return;

    try {
      const newTodo = {
        title: taskName,
        dueDate: dueDate ? dueDate.format('YYYY-MM-DD') : null,
        completed: false
      };

      const response = await axios.post(BASE_URL, newTodo);
      setTodos([...todos, response.data]);
      // 清空输入
      setTaskName('');
      setDueDate(null);
    } catch (error) {
      console.error('添加任务失败:', error);
      // 本地添加，提升用户体验
      setTodos([
        ...todos,
        { ...newTodo, id: Date.now() } // 用时间戳作为临时ID
      ]);
    }
  };

  // 更新任务状态
  const updateTodoStatus = async (id, completed) => {
    try {
      await axios.put(`${BASE_URL}/${id}`, { completed });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('更新状态失败:', error);
      // 本地更新，避免用户操作无反馈
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    }
  };

  // 删除任务
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('删除任务失败:', error);
      // 本地删除，提升用户体验
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  // 加载中显示
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
    // 全屏容器
    <div style={{ 
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      // 内容居中容器
      <div style={{ 
        maxWidth: 768, 
        margin: '0 auto', // 水平居中
        width: '100%'
      }}>
        {/* 标题 */}
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '28px', 
          color: '#333',
          marginBottom: '30px'
        }}>
          Todo List
        </h1>

        {/* 输入区域 */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '30px',
          flexWrap: 'wrap' // 小屏幕自动换行
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
        </div>

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

export default TodoList;
