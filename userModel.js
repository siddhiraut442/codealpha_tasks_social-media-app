const db = require('../config/db');
exports.getUserById = (id, cb) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], cb);
};
