import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const Settings = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // クッキーからトークンを削除
    Cookies.remove('token');
    // 認証状態を更新
    setIsAuthenticated(false);
    // ログインページにリダイレクト
    navigate('/login');
  };

  return (
    <div>
      <h1>Settings</h1>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
};
