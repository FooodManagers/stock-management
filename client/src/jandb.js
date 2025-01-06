const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3003;

app.use(cors());//異なるオリジンから接続できるようにする
app.use(express.json());

/*mySQLへの接続情報*/
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user1',
    password: 'user1',
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

/*データベースにデータを追加する*/
app.post('/jandb', (req) => {
    console.log('リクエスト受信: /jandb');

    /*productテーブルに登録するデータ*/
    const { jan_code, itemName, itemImageUrl, brandName, makerName } = req.body.data;
    /*productテーブルに登録するクエリ*/
    const insertQuery = `
        INSERT INTO product (jan_code, goods_name, image_url, brand_name, maker_name)
        VALUES (?, ?, ?, ?, ?)
        `;
    /*productテーブルにデータを登録*/
    connection.query(
        insertQuery,
        [jan_code, itemName, itemImageUrl, brandName, makerName],/*VALUES(?,?,?,?,?)に入る値がこれ*/
        (err, results) => {
            if (err) {
                console.error('データ登録エラー:', err);
            } else {
                console.log('データ登録成功:', results);
            }
        }
    );

    /*stockテーブルに登録するデータ*/
    const { quantity, expiration_date, expiration_type, nasi, recipe_name, buy_date } = req.body.data;
    /*stockテーブルに登録するクエリ*/
    const insertQuery2 = `
        INSERT INTO stock (jan_code, item_name, recipe_name, expiration_date, expiration_type, has_expiration, buy_date, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    /*stockテーブルにデータを登録*/
    connection.query(
        insertQuery2,
        [jan_code, itemName, recipe_name, expiration_date, expiration_type, nasi, buy_date, quantity],/*VALUES(?,?,?,?,?)に入る値がこれ*/
        (err2, results2) => {
            if (err2) {
                console.error('データ登録エラー:', err2);
            } else {
                console.log('データ登録成功:', results2);
            }
        }
    );
});


//サーバ起動
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});