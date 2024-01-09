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
  deleteMovieController,
} = require("../controllers/movie.controller");
const { validate } = require("../middlewares/validate.middleware");
const { isAuthorised } = require("../middlewares/authorisation.middleware");
const { multerupload } = require("../middlewares/multerupload.middleware");
const router = express.Router();

router.post(
  "/movies",
  isAuthorised,
  multerupload("").single("file"),
  validate(movieaddSchema),
  addMovieController
);
router.get("/movies/list", isAuthorised, getAllMovieController);
router.get("/movies/list/:movie_id", isAuthorised, getOneMovieController);
router.post(
  "/movies/update/:movie_id",
  isAuthorised,
  validate(updatemovieSchema),
  updateMovieController
);
router.get(
  "/movies/update/:movie_id",
  isAuthorised,
  getMovieToUpdateController
);
router.delete("/movies/delete/:movie_id", isAuthorised, deleteMovieController);
module.exports = router;
