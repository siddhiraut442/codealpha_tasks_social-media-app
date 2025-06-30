const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.post('/like', postController.likePost);
router.delete('/:id', postController.deletePost);

module.exports = router; // ✅ must export router
