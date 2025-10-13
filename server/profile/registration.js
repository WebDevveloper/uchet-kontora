const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SECRET_KEY = '2a3374e5bfc9624dc4c645b5fca7f9c2ae240ec52d01ad25c43d2c1e7ddfbd37';

// Фейковая база данных (замени на настоящую, если нужно)
const users = [];

// Хеширование пароля с помощью crypto
function hashPassword(password) {
  return crypto.createHmac('sha256', SECRET_KEY)
               .update(password)
               .digest('hex');
}

// Регистрация
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password); // Предполагается хеширование пароля
  try {
    const [result] = await db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'client']
    );
    res.status(201).json({ message: 'Пользователь зарегистрирован' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации', error });
  }
});

// Вход
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);

  const user = users.find(u => u.email === email && u.password === hashedPassword);
  if (!user) {
    return res.status(401).json({ message: 'Неверный email или пароль' });
  }

  // Создание JWT-токена
  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Защищенный маршрут (например, для профиля)
app.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: 'Добро пожаловать в личный кабинет', user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Неверный токен' });
  }
});