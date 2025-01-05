const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

/*mySQLへの接続情報*/
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kys008mysqlroot',
    database: 'stockmanagementdb',
});

// 接続
connection.connect((err) => {
    if (err) {
        console.error("MYSQL接続エラー:", err);
        return;
    } else {
        console.log("MYSQLに接続しました。");
    }
});

router.post('/', async (req, res) => {
  console.log('リクエスト受信: /jandb');
  /* productテーブルに登録するデータ */
  const { jan_code, itemName, itemImageUrl, brandName, makerName } = req.body;

  /* productテーブルに登録するクエリ */
  const insertQuery = `
    INSERT INTO product (jan_code, goods_name, image_url, brand_name, maker_name)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    /* データベース接続を確立 */
    const connection = await mysql.createConnection(dbConfig);
    /* productテーブルにデータを登録 */
    const [results] = await connection.execute(insertQuery, [jan_code, itemName, itemImageUrl, brandName, makerName]);
    await connection.end();

    console.log('データ登録成功:', results);
    res.status(201).json({ success: true, id: results.insertId });
  } catch (err) {
    console.error('データ登録エラー:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
module.exports = router;