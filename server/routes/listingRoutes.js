const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

router.get('/', (req, res) => {
  Listing.getAll((err, listings) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(listings);
  });
});

router.get('/:id', (req, res) => {
  Listing.getById(req.params.id, (err, listing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!listing) return res.status(404).json({ message: 'Листинг не найден' });
    res.json(listing);
  });
});

router.post('/', (req, res) => {
  Listing.create(req.body, (err, result) => {
    if (err) return res.status(500).send({ message: 'Ошибка создания листинга' });
    res.send({ message: 'Листинг создан', Listing_id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  Listing.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка обновления листинга' });
    res.send({ message: 'Листинг обновлен' });
  });
});

router.delete('/:id', (req, res) => {
  Listing.delete(req.params.id, (err) => {
    if (err) return res.status(500).send({ message: 'Ошибка удаления листинга' });
    res.send({ message: 'Листинг удален' });
  });
});

module.exports = router;