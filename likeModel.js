const db = require('../config/db');
exports.likePost = (userId, postId, cb) => {
  db.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId], cb);
};
