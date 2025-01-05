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
                //res.status(500).json({ success: false, error: err.message });
            } else {
                console.log('データ登録成功:', results);
                //res.status(201).json({ success: true, id: results.insertId });
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
                //res.status(500).json({ success: false, error: err2.message });
            } else {
                console.log('データ登録成功:', results2);
                //res.status(201).json({ success: true, id: results2.insertId });
            }
        }
    );
});




// app.post('/jandb', async (req, res) => {
//     console.log("jandb0");
//     const data = req.body.data;
//     console.log("data=", data);
//     console.log("テスト前");
//     console.log("itemName: itemData.itemName, itemImageUrl: itemData.itemImageUrl, brandName: itemData.brandName, makerName: itemData.makerName,quantity: su.current.value, expiration_type: date.current.value, nasi: Nasi.checked, recipe_name:recipe.current.value, expiration_date: buydate.current.value");
//     try {
//         /*データベースに値を登録する*/
//         console.log('リクエスト受信: /jandb');
//     const {
//         jan_code,
//         itemName,
//         itemImageUrl,
//         brandName,
//         makerName,
//         quantity,
//         expiration_type,
//         nasi,
//         recipe_name,
//         expiration_date,
//     } = req.body.data;
//         const { jan_code, itemName, itemImageUrl, brandName, makerName } = req.body.data;
//         const insertQuery = `
//             INSERT INTO product (jancode, itemName, itemImageUrl, brandName, makerName, quantity, expiration_type, nasi, recipe_name, expiration_date)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         console.log(jan_code, itemName, itemImageUrl, brandName, makerName);
//         connection.query(
//             insertQuery,
//             [jan_code, itemName, itemImageUrl, brandName, makerName, quantity, expiration_type, nasi, recipe_name, expiration_date],
//             (err, results) => {
//                 if (err) {
//                     console.error('データ登録エラー:', err);
//                     res.status(500).json({ success: false, error: err.message });
//                     return;
//                 }
//                 console.log('データ登録成功:', results);
//                 res.status(201).json({ success: true, id: results.insertId });
//             }
//         );
//         console.log("データ完");

//     } catch (error) {
//         console.error('処理中にエラーが発生しました', error);
//         res.status(500).json({ success: false, error: error.message })
//     }
// });


// app.put('/janjb', (req, res) => {
//     const productId = req.params.id;
//     const updateQuery = 'UPDATE product SET conpleted = ? WHERE id = ?';
//     connection.query(updateQuery, [true, productId], (err, results) => {
//         if (err) {
//             console.error("MySQLエラー:", err);
//             return res.status(500).json({ error: "タスクの完了状態の更新に失敗しました" });
//         }
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: "指定されたタスクが見つかりません" });
//         }
//         //res.status(200).json({ id: productId, completed: true });//completed定義してないけどOK?
//     });
// })




/*stockのテーブル*/
// app.get('/jandb', async (req, res) => {
//     const getTasksQuery = 'SELECT * FROM stock';
//     connection.query(getTasksQuery, (err, results) => {
//         if (err) {
//             console.error("MYSQLエラー:", err);
//             return res.status(500).json({ error: "タスクの取得に失敗しました。" });
//         }
//         res.status(200).json(results);
//     });
// });

//stockのテーブルに追加する
// app.post('/jandb', async (req, res) => {
//     console.log("jandb0");
//     const data = req.body.data;
//     console.log("data=", data);
//     console.log("テスト前");
//     try {
//         /*データベースに値を登録する*/
//         const { quantity, expiration_type, nasi, recipe_name, expiration_date } = req.body.data;
//         const insertQuery = 'INSERT INTO product (jancode, itemName, itemImageUrl, brandName, makerName, quantity, expiration_type, nasi, recipe_name, expiration_date)';
//         connection.query(insertQuery, [quantity, expiration_type, nasi, recipe_name, expiration_date], (err, results) => {//サイトではcompletedがfalseのときとなっているがこれはどうする

//             //res.status(201).json({ id: results.insertId, quantity, expiration_type, nasi, recipe_name, expiration_date })
//         });
//         console.log("データ完");

//     } catch (error) {
//         console.error('処理中にエラーが発生しました', error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });
// app.put('/janjb', (req, res) => {
//     const stockId = req.params.id;
//     const updateQuery = 'UPDATE stock SET conpleted = ? WHERE id = ?';
//     connection.query(updateQuery, [true, stockId], (err, results) => {
//         if (err) {
//             console.error("MySQLエラー:", err);
//             return res.status(500).json({ error: "タスクの完了状態の更新に失敗しました" });
//         }
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: "指定されたタスクが見つかりません" });
//         }
//         //res.status(200).json({ id: stockId, completed: true });//completed定義してないけどOK?
//     });
// })


//サーバ起動
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});