const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();


//jancodeを受け取る
router.post('/', async (req, res) => {
    console.log("jancodefinish0");
    const data = req.body.data;
    console.log("data=", data);
    const JANCODE_APP_ID = process.env.JANCODE_APP_ID
    const url = `https://api.jancodelookup.com/?appId=${JANCODE_APP_ID}&query=${data}`;
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
        console.log("jancode", product.codeNumber);
        console.log("product.itemName", product.itemName);
        console.log("product.brandName", product.brandName);
        console.log("product.makerName", product.makerName);
        console.log("product.itemImageUrl", product.itemImageUrl);
        res.json({
            succsess: true,
            jancode: product.codeNumber,
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

module.exports = router;