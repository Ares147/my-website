require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Фиксированный админ
const ADMIN = {
  id: 2,
  login: '2',
  passwordHash: '$2a$12$X9xXz7LQlZ9b1U6vJQq/R.1406' // Хеш пароля "1406"
};

// Генерация JWT
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Вход для админа
app.post('/api/admin/login', async (req, res) => {
  const { login, password } = req.body;

  if (login !== ADMIN.login) {
    return res.status(401).json({ error: 'Неверные данные' });
  }

  const isMatch = await bcrypt.compare(password, ADMIN.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Неверные данные' });
  }

  res.json({ token: generateToken(ADMIN.id) });
});

// Проверка токена
app.get('/api/admin/verify', (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send();

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));