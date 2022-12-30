var jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const db = require("../models");
const User = db.user;

exports.verifyEmailService = async (token) => {
  try {
    const decodedToken = await jwt.verify(token, authConfig.secret);
    if (!decodedToken) {
      throw {
        errorMsg: "Invalid token",
      };
    }
    if (decodedToken && decodedToken.createdUser) {
      const userDetails = await User.findOne({
        where: {
          email: decodedToken.email,
        },
      })
      if (userDetails.is_email_verified) {
        throw {
          errorMsg: "User is already verified",
        };
      }
      if (!userDetails.is_email_verified) {
        userDetails.is_email_verified = true;
        await userDetails.save();
        return {
          status: true,
          message: "Valid token",
        };
      }
    }
  } catch (err) {
    throw {
      errorMsg: err,
    };
  }
};
