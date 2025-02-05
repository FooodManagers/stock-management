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
    <div className="max-w-md mx-auto p-6 bg-white mt-10 rounded shadow">
      <button 
        onClick={handleLogout}
        className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        ログアウト
      </button>
    </div>
  );
};
