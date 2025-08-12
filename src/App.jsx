import TodoList from './todoList';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN'; // 中文语言包

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{
      token: {
        colorPrimary: '#1677ff', // 主题色
        fontSize: 16, // 全局字体大小
      },
    }}>
      <TodoList />
    </ConfigProvider>
  );
}

export default App;