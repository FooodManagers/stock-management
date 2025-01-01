const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェア設定
app.use(cors());
app.use(express.json());

// React の静的ファイルを提供
app.use(express.static(path.join(__dirname, '../client/build')));

// サンプル API エンドポイント
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// その他のリクエストは React の index.html を返す
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// サーバーを起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
