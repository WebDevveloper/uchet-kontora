const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment');

router.get('/', (req, res) => {
    Apartment.getAll((err, results) => {
    if (err) return res.status(500).send({ message: 'Ошибка получения квартиры' });
    res.send(results);
  });
});

router.get('/:id', (req, res) => {
  Apartment.getById(req.params.id, (err, results) => {
    if (err || results.length === 0) return res.status(404).send({ message: 'Квартира не найден' });
    res.send(results[0]);
  });
});

router.post('/', (req, res) => {
  Apartment.create(req.body, (err, result) => {
    if (err) return res.status(500).send({ message: 'Ошибка создания квартиры' });
    res.send({ message: 'Квартира создана', Apartment_id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  Apartment.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка обновления квартиры' });
    res.send({ message: 'Квартира обновлена' });
  });
});

router.delete('/:id', (req, res) => {
  Apartment.delete(req.params.id, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка удаления квартиры' });
    res.send({ message: 'Квартира удалена' });
  });
});

module.exports = router;