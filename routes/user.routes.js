const express = require("express");
const {
  signUpSchema,
  updateUserSchema,
  loginSchema,
} = require("../validations/authentication.schema");
const {
  addUserController,
  loginController,
  accountViewController,
  updateUserController,
} = require("../controllers/users.controller");
const { validate } = require("../middlewares/validate.middleware");
const { isAuthorised } = require("../middlewares/authorisation.middleware");
const router = express.Router();

router.post("/signup", validate(signUpSchema), addUserController);

router.post("/login", validate(loginSchema), loginController);

router.get("/users/userInfo", isAuthorised, accountViewController);

router.patch(
  "/users/user/updateUser",
  isAuthorised,
  validate(updateUserSchema),
  updateUserController
);

module.exports = router;
