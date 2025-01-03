const router = require('express').Router();
const {body, validationResult} = require('express-validator');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'kys008mysqlroot',
  database: 'stockmanagementdb',
};

//データベースからユーザー情報を取得する関数
async function getUsers() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM Users');
    return rows;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}



router.get('/', (req, res) => {
  res.send('Hello from the auth router!');
});

//ユーザ新規登録用API
router.post('/register', body("email").isEmail(),body("password").isLength({min:6}), async (req, res) => {
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
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
  console.log(email, password);
  let hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.execute('INSERT INTO users (mail, password) VALUES (?, ?)', [email, hashedPassword]);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
  //クライアントへのJWT発行
  const token = await JWT.sign(
    {
     email: email,
    },
    "secret",
    {
      expiresIn: "24h",
    }
  );
  return res.json({
    token: token,
  });
});

//ログイン用API
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
    const token = await JWT.sign(
      {
        email: email,
      },
      "secret",
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
  

module.exports = router;