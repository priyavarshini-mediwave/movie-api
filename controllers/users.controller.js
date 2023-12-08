const jwt = require("jsonwebtoken");
const { models } = require("../config/sequelize-config");
const helper = require("../services/helper");
const config = require("../config/config");
const { where } = require("sequelize");

const addUserController = async (req, res, next) => {
  try {
    const searchUser = await models.users.findAll({
      attributes: ["email", "user_name"],
      where: { email: req.body.email, user_name: req.body.user_name },
    });
    if (searchUser.length == 0) {
      const usersCreate = await models.users.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        user_name: req.body.user_name,
        user_password: req.body.user_password,
        phone_no: req.body.phone_no,
      });
      res.json({
        usersCreate,
      });
    } else {
      return next({
        status: 400,
        message: "user already exits, check the email and username",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      message: error.errors.map((d) => d.message),
    });
  }
};
const loginController = async (req, res, next) => {
  try {
    const searchUser = await models.users.findOne({
      where: {
        email: req.body.email,
        //  user_password: req.body.user_password
      },
    });
    if (searchUser === null) {
      return next({
        status: 400,
        message: "invalid email and username",
      });
    } else {
      console.log(searchUser.user_password);
      console.log("req.pass", req.body.user_password);
      const passwordMatch = await helper.comparePassword(
        req.body.user_password,
        searchUser.user_password
      );
      console.log(passwordMatch);
      if (passwordMatch) {
        const payload = {
          id: searchUser.id,
          user_id: searchUser.user_id,
          user_name: searchUser.user_name,
        };
        const created_token = jwt.sign(payload, config.jwtSecret, {
          expiresIn: "1h",
        });
        const updateToken = await models.users.update(
          {
            token: created_token,
          },
          {
            where: {
              id: searchUser.id,
            },
            returning: true,
          }
        );

        return res.json({
          updateToken,
        });
      }
      return res.status(403).send("Username or Password doesnot match");
    }
  } catch (error) {
    console.log("\n error...", error);
    return res.send(error);
  }
};
const accountViewController = async (req, res) => {
  try {
    const searchUser = await models.users.findOne({
      attributes: ["email", "user_name"],
      where: {
        id: req.decoded.id,
      },
      logging: true,
    });
    return res.json({
      searchUser,
    });
  } catch (error) {
    console.log("\n error...", error);
    return res.send(error);
  }
};
const updateUserController = async (req, res, next) => {
  try {
    const searchUser = await models.users.findOne({
      where: { id: req.decoded.id },
      logging: true,
    });
    if (searchUser === null) {
      return next({
        status: 400,
        message: "user not found",
      });
    } else {
      const [rowsUpdated, [updatedUser]] = await models.users.update(
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          user_name: req.body.user_name,
          user_password: req.body.user_password,
          phone_no: req.body.phone_no,
        },
        {
          where: {
            id: req.decoded.id,
          },
          returning: true,
          individualHooks: true,
        }
      );

      res.json({
        updatedUser,
      });
    }
  } catch (error) {
    console.log("\n error...", error);
    return res.send(error);
  }
};
module.exports = {
  addUserController,
  loginController,
  accountViewController,
  updateUserController,
};
