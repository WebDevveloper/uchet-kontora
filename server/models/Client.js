const db = require('../config');

class Client {
  static getAll(callback) {
    db.query('SELECT * FROM clients', callback);
  }

  static getById(id, callback) {
    db.query('SELECT * FROM clients WHERE client_id = ?', [id], callback);
  }

  static create(data, callback) {
    db.query('INSERT INTO clients (client_id, user_id, phone, address) VALUES (?, ?, ?, ?)', 
      [data.client_id, data.user_id, data.phone, data.address], callback);
  }

  static update(id, data, callback) {
    db.query('UPDATE clients SET client_id = ?, user_id = ?, phone = ?, address = ? WHERE client_id = ?', 
      [data.client_id, data.user_id, data.phone, data.address, id], callback);
  }

  static delete(id, callback) {
    db.query('DELETE FROM clients WHERE client_id = ?', [id], callback);
  }
}

module.exports = Client;