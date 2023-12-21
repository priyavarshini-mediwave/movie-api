const express = require("express");
const {
  movieaddSchema,
  updatemovieSchema,
} = require("../validations/insertMovie.schema");
const {
  addMovieController,
  getAllMovieController,
  getOneMovieController,
  updateMovieController,
  getMovieToUpdateController,
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
router.get("/movies/list", isAuthorised, getAllMovieController);
router.get("/movies/list/:movie_id", isAuthorised, getOneMovieController);
router.post(
  "/movies/list/update/:movie_id",
  isAuthorised,
  validate(updatemovieSchema),
  updateMovieController
);
router.get(
  "/movies/list/update/:movie_id",
  isAuthorised,
  getMovieToUpdateController
);
module.exports = router;
