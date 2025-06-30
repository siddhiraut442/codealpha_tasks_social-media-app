const Comment = require('../models/commentModel');

exports.createComment = (req, res) => {
  Comment.createComment(req.body, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId });
  });
};

exports.getComments = (req, res) => {
  Comment.getCommentsByPostId(req.params.postId, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};
