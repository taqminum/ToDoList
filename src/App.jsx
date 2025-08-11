import React from 'react';
import TodoList from './todoList';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <TodoList />
    </ConfigProvider>
  );
}

export default App;