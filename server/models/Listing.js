const db = require('../config');

class Listing {
  static getAll(callback) {
    const query = `
      SELECT 
        l.listing_id,
        l.price,
        l.listing_date,
        l.status,
        a.apartment_id,
        a.address,
        a.bedrooms,
        a.bathrooms,
        a.square_footage,
        GROUP_CONCAT(ai.image_url) AS images
      FROM 
        listings l
      JOIN 
        apartments a ON l.apartment_id = a.apartment_id
      LEFT JOIN 
        apartmentimages ai ON a.apartment_id = ai.apartment_id
      WHERE 
        l.status = 'active'
      GROUP BY 
        l.listing_id, a.apartment_id
      LIMIT 3
    `;
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      const listings = results.map(listing => {
        listing.images = listing.images ? listing.images.split(',') : [];
        return listing;
      });
      callback(null, listings);
    });
  }

  static getById(id, callback) {
    const query = `
      SELECT 
        l.listing_id,
        l.price,
        l.listing_date,
        l.status,
        a.apartment_id,
        a.address,
        a.bedrooms,
        a.bathrooms,
        a.square_footage,
        GROUP_CONCAT(ai.image_url) AS images,
        ag.agent_id,
        u.name AS agent_name,
        ag.phone AS agent_phone,
        u.email AS agent_email
      FROM 
        listings l
      JOIN 
        apartments a ON l.apartment_id = a.apartment_id
      LEFT JOIN 
        apartmentimages ai ON a.apartment_id = ai.apartment_id
      JOIN 
        agents ag ON l.listing_agent_id = ag.agent_id
      JOIN 
        users u ON ag.user_id = u.user_id
      WHERE 
        l.listing_id = ?
      GROUP BY 
        l.listing_id, a.apartment_id, ag.agent_id, u.user_id
    `;
    db.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      if (results.length === 0) return callback(null, null);
      const listing = results[0];
      listing.images = listing.images ? listing.images.split(',') : [];
      callback(null, listing);
    });
  }

  static create(data, callback) {
    db.query(
      'INSERT INTO listings (listing_id, apartment_id, seller_id, listing_agent_id, price, listing_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.listing_id, data.apartment_id, data.seller_id, data.listing_agent_id, data.price, data.listing_date, data.status],
      callback
    );
  }

  static update(id, data, callback) {
    db.query(
      'UPDATE listings SET listing_id = ?, apartment_id = ?, seller_id = ?, listing_agent_id = ?, price = ?, listing_date = ?, status = ? WHERE listing_id = ?',
      [data.listing_id, data.apartment_id, data.seller_id, data.listing_agent_id, data.price, data.listing_date, data.status, id],
      callback
    );
  }

  static delete(id, callback) {
    db.query('DELETE FROM listings WHERE listing_id = ?', [id], callback);
  }
}

module.exports = Listing;