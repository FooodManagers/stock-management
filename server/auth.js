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

module.exports = router;