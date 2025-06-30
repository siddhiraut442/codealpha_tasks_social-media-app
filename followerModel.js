const db = require('../config/db');
exports.followUser = (followerId, followingId, cb) => {
  db.query('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [followerId, followingId], cb);
};