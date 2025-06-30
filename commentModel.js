const db = require('../config/db');
exports.createComment = (data, cb) => {
  db.query('INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)', [data.post_id, data.user_id, data.comment], cb);
};
exports.getCommentsByPostId = (postId, cb) => {
  db.query('SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = ? ORDER BY created_at ASC', [postId], cb);
};

