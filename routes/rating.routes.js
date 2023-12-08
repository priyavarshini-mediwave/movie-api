const express = require("express");
const { ratingValueSchema } = require("../validations/ratingValue.schema");
const { addRatingController } = require("../controllers/rating.controller");

const { validate } = require("../middlewares/validate.middleware");
const { isAuthorised } = require("../middlewares/authorisation.middleware");
const router = express.Router();
router.post(
  "/rating",
  isAuthorised,
  validate(ratingValueSchema),
  addRatingController
);
module.exports = router;
