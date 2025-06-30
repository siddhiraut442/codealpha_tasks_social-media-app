const express = require('express');
const router = express.Router();
const { getComments, createComment } = require('../controllers/commentController');

// Get comments for a specific post
router.get('/:postId', getComments);

// Add a new comment to a post
router.post('/', createComment);

module.exports = router;
