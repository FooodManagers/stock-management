const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const secretKey = process.env.JWT_SECRET;

router.get('/', (req, res) => {
  res.send('Hello from the auth router!');
});

// ユーザ新規登録用API
router.post('/register', body("email").isEmail(), body("password").isLength({ min: 6 }), async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM users WHERE mail = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: 'すでにそのユーザーは存在しています。' }] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute('INSERT INTO users (mail, password) VALUES (?, ?)', [email, hashedPassword]);
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// ログイン用API
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM users WHERE mail = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ errors: [{ msg: 'ユーザーが見つかりません。' }] });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ errors: [{ msg: 'パスワードが間違っています。' }] });
    }

    const token = jwt.sign(
      {
        email: email,
      },
      secretKey,
      {
        expiresIn: "24h",
      }
    );
    return res.json({
      token: token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// トークン検証用API
router.post('/verifyToken', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({ valid: true, decoded });
  } catch (error) {
    res.json({ valid: false, error: 'Invalid token' });
  }
});

// ユーザーのメールアドレスをもとにstockデータを取得するAPI
router.get('/stock', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM stock WHERE mail = ?', [email]);
    await connection.end();

    res.json(rows);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});
// jan_codeを基に商品情報を取得するAPI
router.get('/product', async (req, res) => {
  const jan_code = req.headers['jan_code'];
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM product WHERE jan_code = ?', [jan_code]);
    await connection.end();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ error: 'Failed to fetch product data' });
  }
});

router.get('/recipeword', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT recipe_name FROM stock
      WHERE mail = ? AND recipe_name IS NOT NULL
      ORDER BY expiration_date ASC, stock_id ASC
      LIMIT 1
    `, [email]);
    await connection.end();

    res.json(rows[0] || {});
  } catch (error) {
    console.error('Error fetching recipe data:', error);
    res.status(500).json({ error: 'Failed to fetch recipe data' });
  }
});
router.post('/stockRegister', async (req, res) => {
  /*stockテーブルに登録するデータ*/
  const { jan_code, item_name, quantity, expiration_date, expiration_type, has_expiration, recipe_name, buy_date, mail } = req.body.data;
  /*stockテーブルに登録するクエリ*/
  const insertQuery2 = `
      INSERT INTO stock (jan_code, item_name, recipe_name, expiration_date, expiration_type, has_expiration, buy_date, quantity, mail)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  /*stockテーブルにデータを登録*/
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(insertQuery2, [jan_code, item_name, recipe_name, expiration_date, expiration_type, has_expiration, buy_date, quantity, mail]);
    await connection.end();

    console.log('データ登録成功:', results);
    res.status(201).json({ success: true, id: results.insertId });
  } catch (err) {
    console.error('データ登録エラー:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// メールアドレスを取得するエンドポイント
router.get('/getEmail', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    // トークンをデコードしてユーザー情報を取得
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT mail FROM users WHERE mail = ?', [email]);
    await connection.end();

    if (rows.length > 0) {
      res.status(200).json({ success: true, email: rows[0].mail });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (err) {
    console.error('データ取得エラー:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ストック削除用API
router.delete('/stock/:id', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;
    const stockId = req.params.id;
    console.log('Deleting stock:', stockId);

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('DELETE FROM stock WHERE stock_id = ? AND mail = ?', [stockId, email]);
    await connection.end();

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Stock not found' });
    }
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: 'Failed to delete stock' });
  }
});

// ストック更新用API
router.put('/stockedit/:id', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;
    const stockId = req.params.id;
    console.log('Editing stock:', stockId);
    const { item_name, quantity, expiration_date, expiration_type, recipe_name } = req.body;
    console.log('Editing stock:', item_name, quantity, expiration_date, expiration_type, recipe_name);

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('UPDATE stock SET item_name = ?, quantity = ?, expiration_date = ?, expiration_type = ?, recipe_name = ? WHERE stock_id = ? AND mail = ?', [item_name, quantity, expiration_date, expiration_type, recipe_name, stockId, email]);
    await connection.end();

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Stock not found' });
    }
  } catch (error) {
    console.error('Error editing stock:', error);
    res.status(500).json({ error: 'Failed to edit stock' });
  }
});

// Middleware: JWT認証
const shoppingListAuth = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, secretKey);
    req.email = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// アイテム追加
// POST /shopping-list
router.post('/shopping-list', shoppingListAuth, async (req, res) => {
  const { name } = req.body;
  const email = req.email;

  if (!name) return res.status(400).json({ error: 'Item name is required' });

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO shopping_list (mail, name) VALUES (?, ?)',
      [email, name]
    );
    await connection.end();

    res.status(201).json({ id: result.insertId, mail: email, name, is_checked: false });
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).json({ error: err.message });
  }
});


// 一覧取得
// GET /shopping-list

router.get('/shopping-list', shoppingListAuth, async (req, res) => {
  const email = req.email;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM shopping_list WHERE mail = ? ORDER BY created_at DESC',
      [email]
    );
    await connection.end();

    res.json(rows);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: err.message });
  }
});


// チェック付け・外し
// PATCH /shopping-list/:id/check

router.patch('/shopping-list/:id/check', shoppingListAuth, async (req, res) => {
  const id = req.params.id;
  const { is_checked } = req.body;
  const email = req.email;

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'UPDATE shopping_list SET is_checked = ? WHERE shopping_list_id = ? AND mail = ?',
      [is_checked, id, email]
    );
    await connection.end();

    if (result.affectedRows > 0) {
      res.json({ id, is_checked });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: err.message });
  }
});


// 削除
// DELETE /shopping-list/:id

router.delete('/shopping-list/:id', shoppingListAuth, async (req, res) => {
  const id = req.params.id;
  const email = req.email;

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'DELETE FROM shopping_list WHERE shopping_list_id = ? AND mail = ?',
      [id, email]
    );
    await connection.end();

    if (result.affectedRows > 0) {
      res.json({ deletedId: id });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
