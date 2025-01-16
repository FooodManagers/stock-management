const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());

//jancodeを受け取る
router.post('/', (req, res) => {
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

module.exports = router;
