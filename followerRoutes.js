const express = require('express');
const router = express.Router();
const { followUser } = require('../controllers/followerController');
router.post('/follow', followUser);
module.exports = router;