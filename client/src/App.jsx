import { BottomNaviBar } from "./components/BottomNaviBar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Home } from "./components/Home";
import { List } from "./components/List";
import { Scan } from "./components/Scan";
import { Recipes } from "./components/Recipes";
import { Settings } from "./components/Settings";
import Login from "./components/Login";
import Register from "./components/Register"; // ユーザー登録コンポーネントのインポート
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Hand } from './components/Hand';
import { Scanfinish } from './components/Scanfinish';

const AppContent = () => {
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // ローディング状態を追加
  const navigate = useNavigate();




  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      axios
        .post("http://localhost:5000/api/auth/verifyToken", { token })
        .then((response) => {
          if (response.data.valid) {
            setIsAuthenticated(true);
          } else {
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
          navigate("/login");
        })
        .finally(() => {
          setLoading(false); // ローディング完了
        });
    } else {
      navigate("/login");
      setLoading(false); // ローディング完了
    }
  }, [navigate]);

  useEffect(() => {
    fetch("/api/message")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error:", error));
  }, []);

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (!isAuthenticated) {
    return <Login />; // 認証されていない場合はログイン画面を表示
  }

  return (
    <>
      <div>
        <h1>{message}</h1>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/hand" element={<Hand />} />
        <Route path="/scanfinish" element={<Scanfinish />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* ユーザー登録ルートの追加 */}
      </Routes>
      {isAuthenticated && <BottomNaviBar />} {/* 認証されている場合のみ表示 */}
    </>
  );
};

export const App = () => (
  <Router>
    <AppContent />
  </Router>
);
