import TodoList from './pages/todoList';
import Login from './pages/login';
import Register from './pages/register';
import { isLogin } from './auth';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN'; 
import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// 登录保护路由：未登录时重定向到登录页
const PrivateRoute = ({ children }) => {
  return isLogin() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
    <ConfigProvider locale={zhCN} theme={{
      token: {
        colorPrimary: '#1677ff', 
        fontSize: 16, // 全局字体大小
      },
    }}>
      {/* 路由规则定义 */}
        <Routes>
          {/* 公开路由：登录、注册页 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 受保护路由：TodoList 仅登录用户可访问 */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            } 
          />

          {/* 其他未匹配路由：重定向到登录页 */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;