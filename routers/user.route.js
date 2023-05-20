const express = require('express');
const UserService = require('../services/user.services');
const { AuthMiddleware } = require('../middleware/auth.middlewrae');

const User = express.Router();

User.use(AuthMiddleware);

User.get("/getuser", UserService);

module.exports = User;