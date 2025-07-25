const express = require('express');
const cors = require('cors');
const path = require('path');
const stockList = require('./stockList');
const auth = require('./auth');
const recipe = require('./recipe');
const jandb = require('./jandb');
const code = require('./code');
const jan = require('./jan');

const app = express();
// ミドルウェア設定
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use('/auth', auth);
app.use('/recipe', recipe);
app.use('/jandb', jandb);
app.use('/code', code);
app.use('/jan', jan);


app.use(express.json());

// // React の静的ファイルを提供
// app.use(express.static(path.join(__dirname, '../client/build')));

// サンプル API エンドポイント
// app.get('/api/message', (req, res) => {
//     res.json({ message: 'Hello from the backend!' });
// });
// /api/stock エンドポイントを追加
app.get('/stock',async (req, res) => {
    try {
        const items = await stockList.getItems(); // stockList モジュールを使用してデータを取得
        res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});


// // その他のリクエストは React の index.html を返す
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
//

// サーバーを起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
