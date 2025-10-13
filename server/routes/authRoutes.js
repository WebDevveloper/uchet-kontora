const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const db = require('../config');

// Секретный ключ для JWT (в реальном проекте рекомендуется хранить его в переменных окружения)
const JWT_SECRET = '2a3374e5bfc9624dc4c645b5fca7f9c2ae240ec52d01ad25c43d2c1e7ddfbd37';

// Эндпоинт регистрации пользователя
router.post('/register', (req, res) => {
  let { email, password, name, role } = req.body;
  
  // Если роль не передана, устанавливаем значение по умолчанию
  if (!role) {
    role = 'client';
  }
  
  // Хэшируем пароль с использованием алгоритма SHA-256
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
  // Создаем пользователя в базе данных
  User.create({ email, password: hashedPassword, name, role }, (err, result) => {
    if (err) {
      console.error('Ошибка при создании пользователя:', err);
      return res.status(500).send({ message: 'Ошибка при создании пользователя' });
    }
    
    // Генерируем JWT-токен для нового пользователя
    const token = jwt.sign({ user_id: result.insertId, email }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ message: 'Пользователь создан', user_id: result.insertId, token });
  });
});

// Эндпоинт авторизации пользователя
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Хэшируем пароль аналогичным способом
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
  // Ищем пользователя с указанным email и хэшированным паролем
  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Ошибка при авторизации:', err);
      return res.status(500).send({ message: 'Ошибка авторизации' });
    }
    
    if (results.length === 0) {
      return res.status(401).send({ message: 'Неверные данные для входа' });
    }
    
    const user = results[0];
    const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ message: 'Успешная авторизация', token });
  });
});

// Middleware для проверки JWT-токена
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send({ message: 'Нет токена' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Неверный токен' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Неверный токен' });
    }
    req.user = decoded;
    next();
  });
}

// Защищённый эндпоинт получения профиля пользователя
router.get('/profile', verifyToken, (req, res) => {
  const user_id = req.user.user_id;
  User.getById(user_id, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.send(results[0]);
  });
});

module.exports = router;