const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');

router.get('/', (req, res) => {
  Agent.getAll((err, results) => {
    if (err) return res.status(500).send({ message: 'Ошибка получения агента' });
    res.send(results);
  });
});

router.get('/:id', (req, res) => {
  Agent.getById(req.params.id, (err, results) => {
    if (err || results.length === 0) return res.status(404).send({ message: 'Агент не найден' });
    res.send(results[0]);
  });
});

router.post('/', (req, res) => {
  Agent.create(req.body, (err, result) => {
    if (err) return res.status(500).send({ message: 'Ошибка создания агента' });
    res.send({ message: 'Агент создан', Agent_id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  Agent.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка обновления агента' });
    res.send({ message: 'Агент обновлен' });
  });
});

router.delete('/:id', (req, res) => {
  Agent.delete(req.params.id, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка удаления агента' });
    res.send({ message: 'Агент удален' });
  });
});

module.exports = router;