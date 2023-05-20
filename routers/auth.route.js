
const EXPRESS = require("express");
const { RegisterUserService, VerifyUserService, loginUserService } = require("../services/auth.services");
const AUTH = EXPRESS.Router();

AUTH.post('/register', RegisterUserService);

AUTH.get('/verify/:certificate', VerifyUserService);

AUTH.post("/login", loginUserService);





module.exports = AUTH;