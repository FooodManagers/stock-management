// src/components/LoginForm.jsx
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Input, Button, Spacer, Link} from "@heroui/react";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/react";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/login`, {
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
      <Card className="w-96 h-96">
        <form
          onSubmit={handleSubmit}
          // className="bg-white p-6 rounded shadow-md w-96"
        >
          <h2 className="text-2xl font-bold my-8 text-center">ログイン</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-6">
            <Input
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="bordered"
              size="md"
              className="mx-auto w-80"
            />
          </div>
          <Spacer y={4} />
          <div className="mb-6">
            <Input
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="bordered"
              size="md"
              className="mx-auto w-80"
            />
          </div>
          <div className="mb-6 flex justify-center">
            <Button
              type="submit"
              color="success"
              className="text-white w-80"
            >
              ログイン
            </Button>
          </div>
          <Link href="/register" size="md" className="text-center block">
            登録はこちら
          </Link>
        </form>
      </Card>
    </div>
  );
}

export default Login;
