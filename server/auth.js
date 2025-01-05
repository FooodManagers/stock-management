const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'kys008mysqlroot',
  database: 'stockmanagementdb',
};

const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_key';

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
// jan_code: null,
// item_name: itemNameRef.current.value,
// quantity: quantityRef.current.value,
// expiration_date: expirationDate,
// expiration_type: expirationType,
// has_expiration: hasExpiration,
// recipe_name: recipeNameRef.current.value,
// buy_date: buyDateRef.current.value
router.post('/stockRegister', async (req, res) => {
  /*stockテーブルに登録するデータ*/
  const {jan_code,item_name, quantity, expiration_date, expiration_type, has_expiration,recipe_name, buy_date ,mail} = req.body.data;
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
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ success: false, error: 'Token is required' });
  }

  try {
    // トークンをデコードしてユーザー情報を取得
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const selectQuery = `
      SELECT mail FROM users WHERE id = ?
    `;

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(selectQuery, [userId]);
    await connection.end();

    if (rows.length > 0) {
      res.status(200).json({ success: true, email: rows[0].email });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (err) {
    console.error('データ取得エラー:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;