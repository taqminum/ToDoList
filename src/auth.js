import Cookies from 'js-cookie';

// 有效期1天
export const setToken = (token) => {
  Cookies.set('token', token, { expires: 1 });
};

export const getToken = () => {
  return Cookies.get('token');
};

// 清除Token退出登录
export const removeToken = () => {
  Cookies.remove('token');
};

export const isLogin = () => {
  return !!getToken();
};