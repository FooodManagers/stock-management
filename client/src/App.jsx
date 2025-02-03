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
import ManualInput from './components/ManualInput';
import "./global.css";

const AppContent = () => {
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // ローディング状態を追加
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      axios
        .post("http://it232044-pc.tail6d80a5.ts.net:5000/api/auth/verifyToken", { token })
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

  return (
    <>
      <div>
        <h1>{message}</h1>
      </div>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/list" element={isAuthenticated ? <List /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/scan" element={isAuthenticated ? <Scan /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/hand" element={isAuthenticated ? <Hand /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/scanfinish" element={isAuthenticated ? <Scanfinish /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/recipes" element={isAuthenticated ? <Recipes /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/settings" element={isAuthenticated ? <Settings setIsAuthenticated={setIsAuthenticated} /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} /> {/* ユーザー登録ルートの追加 */}
        <Route path="/manualinput" element={isAuthenticated ? <ManualInput /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
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
