const Users = require('../data/user.json');
const jwt = require('jsonwebtoken');
exports.AuthMiddleware = (req, res, next) => {
  const fingerprint = req.headers.authorization.replace('Bearer ', '');
  if (!fingerprint) {
    return res.status(400).send('bad request');
  }

  try {
    const verify = jwt.verify(fingerprint, process.env.PRIVATE_KEY);
    const find = Users.data.find(item => item.id === verify.id);
    if (find) {
      req.fingerprint = verify
      next();
    } else {
      return res.status(400).send('Bad request');
    }
  } catch (err) {
    console.log(err);
    res.status(400).send('bad request');
  }
};