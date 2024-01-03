const jwt = require("jsonwebtoken");
const { models } = require("../config/sequelize-config");
const helper = require("../services/helper");
const config = require("../config/config");
const { mailConfig, transporter } = require("../config/email-config");

//Mail controller
const mailController = async (req, res, next) => {
  function generateRandomNumber() {
    var minm = 1000;
    var maxm = 9999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  }
  let otp = generateRandomNumber();
  console.log(otp);
  let url = "http://localhost:5173/";
  const options = {
    from: `Sender<${mailConfig.email}>`,
    to: req.body.to,
    subject: "Forgot Password Verification OTP",
    // text: 'test content', // plain text body
    html: `<p> your otp to change password ${otp}</p> 
      <buuton><a href="${url}" target="_blank">View</a></button>`, // html body
  };

  transporter.sendMail(options, (error, info) => {
    if (error) console.log("\n mail error..", error);
    return console.log("\n success...", info);
  });
  return res.json("Mail sent");
};

module.exports = {
  mailController,
};
