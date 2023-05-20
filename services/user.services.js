const User = require("../data/user.json");

const UserService = (req, res) => {
  res.json({
    info: req.fingerprint,
    data: [...User.data]
  });
};

module.exports = UserService;