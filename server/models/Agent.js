const db = require('../config');

class Agent {
  static getAll(callback) {
    db.query('SELECT * FROM agents', callback);
  }

  static getById(id, callback) {
    db.query('SELECT * FROM agents WHERE agent_id = ?', [id], callback);
  }

  static create(data, callback) {
    db.query('INSERT INTO agents (agent_id, user_id, phone) VALUES (?, ?, ?)', 
      [data.agent_id, data.user_id, data.phone], callback);
  }

  static update(id, data, callback) {
    db.query('UPDATE agents SET agent_id = ?, user_id = ?, phone = ? WHERE agent_id = ?', 
      [data.agent_id, data.user_id, data.phone, id], callback);
  }

  static delete(id, callback) {
    db.query('DELETE FROM agents WHERE agent_id = ?', [id], callback);
  }
}

module.exports = Agent;