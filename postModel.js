const db = require('../config/db');
exports.getAllPosts = cb => {
  db.query('SELECT posts.*, users.username, (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC', cb);
};
exports.createPost = (data, cb) => {
  db.query('INSERT INTO posts (user_id, content) VALUES (?, ?)', [data.user_id, data.content], cb);
};