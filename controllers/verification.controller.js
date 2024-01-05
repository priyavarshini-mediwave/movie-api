const jwt = require("jsonwebtoken");
const { models } = require("../config/sequelize-config");
const helper = require("../services/helper");
const config = require("../config/config");
const { mailConfig, transporter } = require("../config/email-config");
const { error, log } = require("console");

//Mail controller
const mailController = async (req, res, next) => {
  try {
    const searchUser = await models.users.findOne({
      where: {
        email: req.body.email,
      },
    });
    console.log("searchUser", searchUser);
    function generateRandomNumber() {
      var minm = 1000;
      var maxm = 9999;
      return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    }
    let otp = generateRandomNumber();
    console.log(otp);
    let url = "http://localhost:5173/";
    if (searchUser) {
      const verifyCreate = await models.verificationtable.create({
        verification_type: "forgot-password",
        otp: otp,
        expiresAt: new Date().getTime() + 5 * 60000,
        user_id: searchUser.user_id,
      });

      if (verifyCreate) {
        const options = {
          from: `Sender<${mailConfig.email}>`,
          to: req.body.email,
          subject: "Forgot Password Verification OTP",
          // text: 'test content', // plain text body
          html: `<p> Your OTP to change password ${otp}.</p><p>Otp will expire in 5 minutes</p> 
        <button><a href="${url}" target="_blank">View</a></button><p>Donot share the OTP. </p>`, // html body
        };

        transporter.sendMail(options, (error, info) => {
          if (error) console.log("\n mail error..", error);
          return console.log("\n success...", info);
        });
        console.log("verifyCreate", verifyCreate);
        return res.json({
          response: verifyCreate,
          message: "Mail sent",
        });
      } else {
        return next({
          status: 400,
          message: "Otp not created",
        });
      }
    } else {
      return next({
        status: 400,
        message: "User Does Not exist",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: error,
    });
  }
};
const otpCheckController = async (req, res, next) => {
  try {
    const searchUser = await models.verificationtable.findOne({
      where: {
        user_id: req.params.user_id,
      },
    });
    // console.log(searchUser);
    // console.log(searchUser.otp);
    const otpValue = searchUser.otp;
    const userOtp = req.body.otp;
    //console.log("userOtp", userOtp);
    if (searchUser) {
      if (otpValue === userOtp) {
        if (new Date().getTime() > searchUser.expiresAt) {
          const removeOtp = await models.verificationtable.destroy({
            where: {
              user_id: req.params.user_id,
            },
          });
          console.log("removeOtponExpiry", removeOtp);
          return next({
            status: 400,
            message: "OTP expired",
          });
        } else {
          const removeOtp = await models.verificationtable.destroy({
            where: {
              user_id: req.params.user_id,
            },
          });
          console.log("removeOtp", removeOtp);
          return res.json({
            deletedValue: searchUser,
            message: "OTP verified Successfully",
          });
        }
      } else {
        return next({
          status: 400,
          message: "OTP invalid",
        });
      }
    } else {
      return next({
        status: 400,
        message: "User Not found",
      });
    }
  } catch (error) {
    console.log("error:", error);
    return res.json({
      message: error.message,
    });
  }
};
const forgotPasswordController = async (req, res, next) => {
  try {
    const searchUser = await models.users.findOne({
      where: {
        user_id: req.params.user_id,
      },
    });
    if (searchUser) {
      const updatedPassword = await models.users.update(
        {
          user_password: req.body.new_password,
        },
        {
          where: {
            user_id: req.params.user_id,
          },
          returning: true,
          //   individualHooks: true,
        }
      );
      console.log("updatedForgotPassword:", updatedPassword);
      if (updatedPassword) {
        return res.json({
          message: "Password Updated Successfully",
        });
      } else {
        return next({
          status: 400,
          message: "Password not updated",
        });
      }
    } else {
      return next({
        status: 400,
        message: "No user found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: error,
    });
  }
};
module.exports = {
  mailController,
  otpCheckController,
  forgotPasswordController,
};
