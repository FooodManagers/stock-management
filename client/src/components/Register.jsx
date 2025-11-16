import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button, Spacer, Link } from "@heroui/react";
import { Card } from "@heroui/react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/register`, {
        email,
        password,
      });
      setError("");
      alert("ユーザー登録成功!");
      navigate("/login"); // ログイン画面にリダイレクト
    } catch (err) {
      setError("ユーザー登録に失敗しました。メールアドレスまたはパスワードを確認してください。");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 h-96">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold my-8 text-center">ユーザー登録</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
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
            <Button type="submit" color="primary" className="text-white w-80">
              登録
            </Button>
          </div>
          <Link href="/login" size="md" className="text-center block">
            ログインはこちら
          </Link>
        </form>
      </Card>
    </div>
  );
}

export default Register;
