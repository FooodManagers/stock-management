const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

//ミドルウェア
app.use(cors());
app.use(bodyParser.json());

//jancodeを受け取る
app.post('/barcode', (req, res) => {
    const codes = req.body.codes;

    if (!Array.isArray(codes) || codes.length === 0) {
        return res.status(400).json({ error: '無効なデータ' });
    }

    //一番多く読み取れたjancode(正しいjancode)を探す
    const countMap = {};
    codes.forEach(code => {
        countMap[code] = (countMap[code] || 0) + 1;
    });

    let maxCount = 0;
    let adoptedValue = null;
    for (let code in countMap) {
        if (countMap[code] >= maxCount) {//maxCountより大きかったら
            maxCount = countMap[code];//countMap[code]をmaxCountに入れる
            adoptedValue = code;
        }
    }

    console.log('Adopted Value:', adoptedValue);
    res.json({ success: true, adoptedValue });
});

//サーバ起動
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});