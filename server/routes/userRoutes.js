const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).send({ message: 'Ошибка получения пользователей' });
    res.send(results);
  });
});

router.get('/:id', (req, res) => {
  User.getById(req.params.id, (err, results) => {
    if (err || results.length === 0) return res.status(404).send({ message: 'Пользователь не найден' });
    res.send(results[0]);
  });
});


router.post('/', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  User.create({ ...req.body, password: hashedPassword }, (err, result) => {
    if (err) return res.status(500).send({ message: 'Ошибка создания пользователя' });
    res.send({ message: 'Пользователь создан', user_id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  User.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка обновления пользователя' });
    res.send({ message: 'Пользователь обновлен' });
  });
});

router.delete('/:id', (req, res) => {
  User.delete(req.params.id, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка удаления пользователя' });
    res.send({ message: 'Пользователь удален' });
  });
});

module.exports = router;