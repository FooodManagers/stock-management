const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

/*mySQLへの接続情報*/
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
  const { jan_code, itemName, itemImageUrl, brandName, makerName } = req.body.data;

  /* productテーブルに登録するクエリ */
  const insertQuery = `
    INSERT INTO product (jan_code, goods_name, image_url, brand_name, maker_name)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    insertQuery,
    [jan_code, itemName, itemImageUrl, brandName, makerName],/*VALUES(?,?,?,?,?)に入る値がこれ*/
    (err, results) => {
        if (err) {
            console.error('データ登録エラー:', err);
            //res.status(500).json({ success: false, error: err.message });
        } else {
            console.log('データ登録成功:', results);
            //res.status(201).json({ success: true, id: results.insertId });
        }
    }
);

  /*stockテーブルに登録するデータ*/
  const { quantity, expiration_date, expiration_type, nasi, recipe_name, buy_date, mail} = req.body.data;
  /*stockテーブルに登録するクエリ*/
  const insertQuery2 = `
      INSERT INTO stock (jan_code, item_name, recipe_name, expiration_date, expiration_type, has_expiration, buy_date, quantity, mail)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  /*stockテーブルにデータを登録*/
  connection.query(
      insertQuery2,
      [jan_code, itemName, recipe_name, expiration_date, expiration_type, nasi, buy_date, quantity,mail],/*VALUES(?,?,?,?,?)に入る値がこれ*/
      (err2, results2) => {
          if (err2) {
              console.error('データ登録エラー:', err2);
              //res.status(500).json({ success: false, error: err2.message });
          } else {
              console.log('データ登録成功:', results2);
              //res.status(201).json({ success: true, id: results2.insertId });
          }
      }
  );
});
module.exports = router;
