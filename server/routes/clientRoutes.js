const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

router.get('/', (req, res) => {
  Client.getAll((err, results) => {
    if (err) return res.status(500).send({ message: 'Ошибка получения клиента' });
    res.send(results);
  });
});

router.get('/:id', (req, res) => {
  Client.getById(req.params.id, (err, results) => {
    if (err || results.length === 0) return res.status(404).send({ message: 'Клиент не найден' });
    res.send(results[0]);
  });
});

router.post('/', (req, res) => {
  Client.create(req.body, (err, result) => {
    if (err) return res.status(500).send({ message: 'Ошибка создания клиента' });
    res.send({ message: 'Клиент создан', Client_id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  Client.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка обновления клиента' });
    res.send({ message: 'Клиент обновлен' });
  });
});

router.delete('/:id', (req, res) => {
  Client.delete(req.params.id, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка удаления клиента' });
    res.send({ message: 'Клиент удален' });
  });
});

module.exports = router;