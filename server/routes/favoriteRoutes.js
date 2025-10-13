const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config');

// Секретный ключ для JWT (рекомендуется хранить в переменных окружения)
const JWT_SECRET = '2a3374e5bfc9624dc4c645b5fca7f9c2ae240ec52d01ad25c43d2c1e7ddfbd37';

// Middleware для проверки JWT-токена
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Требуется авторизация' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Неверный токен' });
      req.user = decoded;
      next();
    });
  }
  
// Получение избранного
router.get('/', verifyToken, async (req, res) => {
  try {
    const [favorites] = await db.query(`
      SELECT 
        f.favorite_id,
        l.listing_id,
        a.address,
        l.price,
        (SELECT image_url FROM ApartmentImages 
         WHERE apartment_id = a.apartment_id 
         LIMIT 1) AS image
      FROM Favorites f
      JOIN Listings l ON f.listing_id = l.listing_id
      JOIN Apartments a ON l.apartment_id = a.apartment_id
      WHERE f.user_id = ?`, [req.user.user_id]);

    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});
  
  // GET – проверка, находится ли объявление в избранном
  router.get('/check', verifyToken, (req, res) => {
    const user_id = req.user.user_id;
    const listing_id = req.query.listing_id;
    if (!listing_id) return res.status(400).json({ message: 'listing_id required' });
    const query = 'SELECT * FROM Favorites WHERE user_id = ? AND listing_id = ?';
    db.query(query, [user_id, listing_id], (err, results) => {
      if (err) {
        console.error('Ошибка при проверке избранного:', err);
        return res.status(500).json({ message: 'Ошибка при проверке избранного' });
      }
      res.json({ isFavorite: results.length > 0 });
    });
  });
  
// Добавление в избранное
router.post('/', verifyToken, async (req, res) => {
  try {
    const { listing_id } = req.body;
    if (!listing_id) return res.status(400).json({ error: 'Требуется listing_id' });

    const [existing] = await db.query(
      'SELECT * FROM Listings WHERE listing_id = ?',
      [listing_id]
    );
    if (!existing.length) return res.status(404).json({ error: 'Объявление не найдено' });

    const [result] = await db.query(
      'INSERT INTO Favorites (user_id, listing_id) VALUES (?, ?)',
      [req.user.user_id, listing_id]
    );

    res.json({ 
      message: 'Добавлено в избранное',
      favorite_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
  
  // DELETE – удаление объявления из избранного
  router.delete('/', verifyToken, (req, res) => {
    const user_id = req.user.user_id;
    const listing_id = req.query.listing_id;
    if (!listing_id) return res.status(400).json({ message: 'listing_id required' });
    const query = 'DELETE FROM Favorites WHERE user_id = ? AND listing_id = ?';
    db.query(query, [user_id, listing_id], (err, result) => {
      if (err) {
        console.error('Ошибка при удалении из избранного:', err);
        return res.status(500).json({ message: 'Ошибка при удалении из избранного' });
      }
      res.json({ message: 'Объявление удалено из избранного' });
    });
  });
  
  module.exports = router;