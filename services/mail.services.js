const mailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const Transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

