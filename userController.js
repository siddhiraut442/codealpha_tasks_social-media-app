const User = require('../models/userModel');
exports.getUser = (req, res) => {
  User.getUserById(req.params.id, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
};
