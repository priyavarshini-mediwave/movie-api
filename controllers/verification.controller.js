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
          to: req.body.to,
          subject: "Forgot Password Verification OTP",
          // text: 'test content', // plain text body
          html: `<p> Your OTP to change password ${otp}.</p><p>Otp will expire in 5 minutes</p> 
        <button><a href="${url}" target="_blank">View</a></button><p>Donot share the OTP. </p>`, // html body
        };

        transporter.sendMail(options, (error, info) => {
          if (error) console.log("\n mail error..", error);
          return console.log("\n success...", info);
        });
        return res.json("Mail sent");
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
module.exports = {
  mailController,
};
