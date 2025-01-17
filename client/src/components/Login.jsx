// src/components/LoginForm.jsx
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../output.css";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      Cookies.set("token", response.data.token, { expires: 1 }); // JWTをCookieに保存
      setError("");
      setIsAuthenticated(true); // 認証状態を更新
      alert("ログイン成功!");
      navigate("/"); // ホーム画面にリダイレクト
    } catch (err) {
      setError("ログインに失敗しました。メールアドレスまたはパスワードを確認してください。");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">ログイン</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          ログイン
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")} // 登録画面に遷移
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 mt-4"
        >
          登録
        </button>
      </form>
    </div>
  );
}

export default Login;
