const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const AUTH = require("./routers/auth.route");
const User = require("./routers/user.route");

dotenv.config();

const APP = express();
const PORT = process.env.PORT || 3300;

APP.use(express.json());
APP.use(cors());
APP.use("/auth", AUTH);
APP.use("/user", User);

APP.all("*", (req, res) => {
  res.send("404");
});

APP.listen(PORT, () => console.log(`Server running at ${PORT}`));
