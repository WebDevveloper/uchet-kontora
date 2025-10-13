const db = require('../config');

class User {
  static getAll(callback) {
    db.query('SELECT * FROM users', callback);
  }

  static getById(id, callback) {
    db.query('SELECT * FROM users WHERE user_id = ?', [id], callback);
  }

  static create(data, callback) {
    db.query('INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)', 
      [data.email, data.password, data.role, data.name], callback);
  }

  static update(id, data, callback) {
    db.query('UPDATE users SET email = ?, password = ?, role = ?, name = ? WHERE user_id = ?', 
      [data.email, data.password, data.role, data.name, id], callback);
  }

  static delete(id, callback) {
    db.query('DELETE FROM users WHERE user_id = ?', [id], callback);
  }
}

module.exports = User;