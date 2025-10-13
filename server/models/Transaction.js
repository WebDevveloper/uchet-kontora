const db = require('../config');

class Transaction {
  static getAll(callback) {
    db.query('SELECT * FROM transactions', callback);
  }

  static getById(id, callback) {
    db.query('SELECT * FROM transactions WHERE transaction_id = ?', [id], callback);
  }

  static create(data, callback) {
    db.query('INSERT INTO transactions (listing_id, buyer_id, sale_date, selling_agent_id) VALUES (?, ?, ?, ?)', 
      [data.listing_id, data.buyer_id, data.sale_date, data.selling_agent_id], callback);
  }

  static update(id, data, callback) {
    db.query('UPDATE transactions SET listing_id = ?, buyer_id = ?, sale_date = ?, selling_agent_id = ? WHERE listing_id = ?', 
      [data.listing_id, data.buyer_id, data.sale_date, data.selling_agent_id, id], callback);
  }

  static delete(id, callback) {
    db.query('DELETE FROM transactions WHERE listing_id = ?', [id], callback);
  }
}

module.exports = Transaction;