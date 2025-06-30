const db = require('../config/db');

// Create a new post
exports.createPost = (req, res) => {
  console.log('📨 Received post:', req.body);
  const { user_id, content } = req.body;

  if (!user_id || !content) {
    return res.status(400).json({ error: 'user_id and content are required' });
  }

  const query = 'INSERT INTO posts (user_id, content) VALUES (?, ?)';
  db.query(query, [user_id, content], (err, result) => {
    if (err) {
      console.error('❌ DB error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId });
  });
};

// Get all posts with usernames
exports.getPosts = (req, res) => {
  const query = `
    SELECT posts.id, posts.content, posts.likes, posts.user_id, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Like a post
exports.likePost = (req, res) => {
  const { post_id } = req.body;
  if (!post_id) return res.status(400).json({ error: 'post_id is required' });

  const query = 'UPDATE posts SET likes = likes + 1 WHERE id = ?';
  db.query(query, [post_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
};

// Delete a post (with user ownership check)
exports.deletePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.body.user_id;

  // Step 1: Check if post belongs to requesting user
  const checkQuery = 'SELECT * FROM posts WHERE id = ? AND user_id = ?';
  db.query(checkQuery, [postId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Step 2: Delete the post
    const deleteQuery = 'DELETE FROM posts WHERE id = ?';
    db.query(deleteQuery, [postId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Post deleted successfully' });
    });
  });
};
