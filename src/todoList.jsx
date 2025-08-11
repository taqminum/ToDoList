import React, { useState, useEffect } from 'react';
import { Input, Button, DatePicker, List, Checkbox, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

// 配置后端接口基础地址（根据实际后端地址修改）
const BASE_URL = 'http://localhost:5000/api/todos'; 

const TodoList = () => {
  // 输入框和日期的状态
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState(null);
  // Todo 列表数据
  const [todos, setTodos] = useState([]);

  // 从后端获取 Todo 列表
  useEffect(() => {
    fetchTodos();
  }, []);

  // 获取 Todo 列表的函数
  const fetchTodos = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('获取 Todo 列表失败:', error);
    }
  };

  // 添加 Todo 的函数
  const addTodo = async () => {
    if (!taskName.trim()) return; // 空内容不添加
    try {
      const response = await axios.post(BASE_URL, {
        title: taskName,
        dueDate: dueDate ? dueDate.format('YYYY-MM-DD') : null,
        completed: false
      });
      setTodos([...todos, response.data]);
      // 清空输入
      setTaskName('');
      setDueDate(null);
    } catch (error) {
      console.error('添加 Todo 失败:', error);
    }
  };

  // 更新 Todo 完成状态的函数
  const updateTodoStatus = async (id, completed) => {
    try {
      await axios.put(`${BASE_URL}/${id}`, { completed });
      // 局部更新状态，避免重新请求列表
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  // 删除 Todo 的函数
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('删除 Todo 失败:', error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h1 style={{ textAlign: 'center' }}>Todo List</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Input 
          placeholder="输入任务名称" 
          value={taskName} 
          onChange={(e) => setTaskName(e.target.value)} 
        />
        <DatePicker 
          value={dueDate} 
          onChange={(date) => setDueDate(date)} 
          placeholder="选择截止时间"
        />
        <Button type="primary" onClick={addTodo}>
          添加
        </Button>
      </div>

      {todos.length > 0 ? (
        <List
          dataSource={todos}
          renderItem={todo => (
            <List.Item>
              <Checkbox 
                checked={todo.completed} 
                onChange={(e) => updateTodoStatus(todo.id, e.target.checked)}
              >
                {todo.completed ? (
                  <s>{todo.title}</s>
                ) : (
                  todo.title
                )}
                {todo.dueDate && (
                  <span style={{ marginLeft: '10px', color: '#888' }}>
                    截止日期：{todo.dueDate}
                  </span>
                )}
              </Checkbox>
              <Popconfirm 
                title="确定删除吗？" 
                onConfirm={() => deleteTodo(todo.id)}
              >
                <DeleteOutlined style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }} />
              </Popconfirm>
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div>No data</div>
        </div>
      )}
    </div>
  );
};

export default TodoList;