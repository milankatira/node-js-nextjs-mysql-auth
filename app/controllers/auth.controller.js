const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { sendEmail } = require("../utils/sendEmail");
const { verifyEmailService } = require("../service/auth.service");
const { server_url } = require("../constant/app.constant");

exports.signup = async (req, res) => {
  try {
    const user = await User.create({
      roles: req.body.roles,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    var AuthToken = jwt.sign(
      { id: user.id, email: user.email },
      config.secret,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    await sendEmail(
      user.email,
      "email verification",
      `${server_url}/api/verify/${AuthToken}`
    );
    res.send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      accessToken: token,
      message: "user login successful",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
      roles: req.body.roles
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const data = await verifyEmailService(token);
    return res.status(200).json({
      status: true,
      message: "email verified successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error,
    });
  }
};
