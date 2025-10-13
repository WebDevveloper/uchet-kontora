const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', (req, res) => {
  Transaction.getAll((err, results) => {
    if (err) return res.status(500).send({ message: 'Ошибка получения транзакции' });
    res.send(results);
  });
});

router.get('/:id', (req, res) => {
  Transaction.getById(req.params.id, (err, results) => {
    if (err || results.length === 0) return res.status(404).send({ message: 'Транзакция не найден' });
    res.send(results[0]);
  });
});

router.post('/', (req, res) => {
  Transaction.create(req.body, (err, result) => {
    if (err) return res.status(500).send({ message: 'Ошибка создания транзакции' });
    res.send({ message: 'Транзакция создана', Transaction_id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  Transaction.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка обновления транзакции' });
    res.send({ message: 'Транзакция обновлена' });
  });
});

router.delete('/:id', (req, res) => {
  Transaction.delete(req.params.id, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка удаления траезакции' });
    res.send({ message: 'Транзакция удалена' });
  });
});

module.exports = router;