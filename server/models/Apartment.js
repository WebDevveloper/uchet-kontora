const db = require('../config');

class Apartment {
  static getAll(callback) {
    db.query('SELECT * FROM apartments', callback);
  }

  static getById(id, callback) {
    db.query('SELECT * FROM apartments WHERE apartment_id = ?', [id], callback);
  }

  static create(data, callback) {
    db.query('INSERT INTO apartments (address, bedrooms, bathrooms, square_footage, owner_id) VALUES (?, ?, ?, ?, ?)', 
      [data.address, data.bedrooms, data.bathrooms, data.square_footage, data.owner_id], callback);
  }

  static update(id, data, callback) {
    db.query('UPDATE apartments SET address = ?, bedrooms = ?, bathrooms = ?, square_footage = ?, owner_id = ? WHERE apartment_id = ?', 
      [data.address, data.bedrooms, data.bathrooms, data.square_footage, data.owner_id, id], callback);
  }

  static delete(id, callback) {
    db.query('DELETE FROM apartments WHERE apartment_id = ?', [id], callback);
  }
}

module.exports = Apartment;