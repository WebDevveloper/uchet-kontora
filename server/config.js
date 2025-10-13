const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Замените на вашего пользователя MySQL
  password: 'root', // Замените на ваш пароль
  database: 'rieltor'   // Название базы данных
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
  } else {
    console.log('Подключено к базе данных MySQL');
  }
});

module.exports = db;