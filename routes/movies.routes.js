const express = require("express");
const {
  movieaddSchema,
  updatemovieSchema,
} = require("../validations/insertMovie.schema");
const {
  addMovieController,
  listMovieController,
} = require("../controllers/movie.controller");
const { validate } = require("../middlewares/validate.middleware");
const { isAuthorised } = require("../middlewares/authorisation.middleware");
const router = express.Router();

router.post(
  "/movies",
  isAuthorised,
  validate(movieaddSchema),
  addMovieController
);
router.get("/movies/list", listMovieController);
module.exports = router;
