const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const agentRoutes = require('./routes/agentRoutes');
const clientRoutes = require('./routes/clientRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const listingRoutes = require('./routes/listingRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();

// Middleware для обработки JSON
app.use(bodyParser.json());

// Middleware для CORS
app.use(cors());

// Подключение маршрутов
app.use('/users', userRoutes);
app.use('/agents', agentRoutes);
app.use('/clients', clientRoutes);
app.use('/apartments', apartmentRoutes);
app.use('/listings', listingRoutes);
app.use('/transactions', transactionRoutes);
app.use('/auth', authRoutes);
app.use('/favorites', favoriteRoutes);


// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});