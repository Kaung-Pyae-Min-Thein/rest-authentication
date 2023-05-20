const { writeFileSync, readFileSync } = require("fs");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const mailer = require("nodemailer");
const Users = require("../data/user.json");
const jwt = require("jsonwebtoken");

dotenv.config();
exports.RegisterUserService = async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).send("Bad request");
    return;
  }

  const DuplicateUser = Users.data.find(
    (item) => item.email === req.body.email
  );

  if (DuplicateUser) {
    return res.status(300).send("DuplicateUser");
  }

  bcrypt.hash(req.body.password, Number(process.env.SALT), (err, hash) => {
    if (err) {
      res.status(500);
      return;
    }
    // res.send(hash)
    const ID = "uid-" + Math.floor(Math.random() * 100000);
    const Certificate = jwt.sign({ id: ID }, process.env.PRIVATE_KEY, {
      expiresIn: 5 * 60000,
    });
    mailer
      .createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      })
      .sendMail(
        {
          from: "Facebook",
          to: req.body.email,
          subject: "Hello",
          text: `Hello ${req.body.username}, Click link to verify \n http://localhost:3000/auth/verify/${Certificate}`,
        },
        async (err, info) => {
          if (err) {
            res.send(500);
            return;
          }

          try {
            Users.data.push({
              id: ID,
              name: req.body.username,
              email: req.body.email,
              password: hash,
              verified: false,
              created: new Date(),
            });
            console.log(__dirname);
            await writeFileSync(
              `${__dirname}/../data/user.json`,
              JSON.stringify(Users)
            );
            return res.send("success");
          } catch (err) {
            console.log(err);
            res.status(500).send("internal server error");
          }
        }
      );
  });
};

exports.VerifyUserService = async (req, res) => {
  try {
    const Verification = jwt.verify(
      req.params.certificate,
      process.env.PRIVATE_KEY
    );

    const FoundUser = Users.data.find((item) => item.id === Verification.id);
    if (FoundUser) {
      Users.data.map((item) => {
        if (item.id === FoundUser.id) {
          item.verified = true;
        }
      });
      await writeFileSync(
        "${__dirname}/../data/user.json",
        JSON.stringify(Users)
      );

      res.redirect("http://localhost:5173/login");
    } else {
      return res.status(400).send("Bad request");
    }
  } catch (err) {
    console.log(err);
    res.stauts(400).send("Bad Request");
  }
};

exports.loginUserService = async (req, res) => {
  console.log(req.body.email);
  const CheckUser = Users.data.find((item) => item.email === req.body.email);

  if (CheckUser) {
    if (CheckUser.verified) {
      bcrypt.compare(req.body.password, CheckUser.password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).send("Password err");
        } else {
          return res.json({
            certificate: jwt.sign(
              {
                id: CheckUser.id,
                email: CheckUser.email,
                name: CheckUser.name,
              },
              process.env.PRIVATE_KEY,
              { expiresIn: "30d" }
            ),
          });
        }
      });
    } else {
      return res.status(400).send("User need to verify");
    }
  } else {
    return res.status(400).send("User name or password invalid");
  }
};
