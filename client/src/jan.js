const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3002;

//ミドルウェア
app.use(cors());
app.use(express.json());

//jancodeを受け取る
app.post('/jancodefinish', async (req, res) => {
    console.log("jancodefinish0");
    const data = req.body.data;
    console.log("data=", data);
    const url = `https://api.jancodelookup.com/?appId=e4c2c84cc860d50e4df967f1535645f3&query=${data}`;
    console.log("テスト前");
    try {
        const response = await fetch(url);
        console.log("テスト");
        if (!response.ok) {
            throw new Error('ネットワークエラーが発生しました');
        }
        const result = await response.json();
        console.log("データ");
        const product = await result.product[0];
        console.log("product.itemName", product.itemName);
        console.log("product.brandName", product.brandName);
        console.log("product.makerName", product.makerName);
        console.log("product.itemImageUrl", product.itemImageUrl);
        res.json({
            succsess: true,
            itemName: product.itemName,
            brandName: product.brandName,
            makerName: product.makerName,
            itemImageUrl: product.itemImageUrl,
        });
        console.log("データ完");

    } catch (error) {
        console.error('処理中にエラーが発生しました', error);
        res.status(500).json({ success: false, error: error.message })
    }
});
//サーバ起動
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});