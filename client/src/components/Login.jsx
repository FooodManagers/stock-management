// src/components/LoginForm.jsx
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../output.css";
import { Input, Button, Spacer, Link} from "@heroui/react";

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
          <Input
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            variant="bordered"
            size="lg"
          />
        </div>
        <Spacer y={4} />
        <div className="mb-4">
          <Input
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            variant="bordered"
            size="lg"
          />
        </div>
        <Button
          type="submit"
          color="success"
          className="text-white"
          fullWidth
        >
          ログイン
        </Button>
        <Button
          type="button"
          color="secondary"
          onPress={() => navigate("/register")} // 登録画面に遷移
          fullWidth
        >
          登録
        </Button>
      </form>
    </div>
  );
}

export default Login;
