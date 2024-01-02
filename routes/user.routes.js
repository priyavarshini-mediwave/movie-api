const express = require("express");
const {
  signUpSchema,
  updateUserSchema,
  loginSchema,
  updatePasswordSchema,
} = require("../validations/authentication.schema");
const {
  addUserController,
  loginController,
  accountViewController,
  updateUserController,
  updateUserPasswordController,
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
router.patch(
  "/users/user/updatePassword",
  isAuthorised,
  validate(updatePasswordSchema),
  updateUserPasswordController
);
module.exports = router;
