// const { Module } = require("module");
// const config = require("../config/config");
const { sequelize, models, Sequelize } = require("../config/sequelize-config");
const movies = require("../models/movies");
const rating = require("../models/rating");

//const Op = Sequelize.Op;

const addMovieController = async (req, res, next) => {
  try {
    const searchMovie = await models.movies.findAll({
      attributes: ["movie_name", "release_year"],
      where: {
        movie_name: req.xop.movie_name,
        release_year: req.xop.release_year,
      },
    });
    if (searchMovie.length == 0) {
      const createMovie = await models.movies.create({
        movie_name: req.xop.movie_name,
        movie_desc: req.xop.movie_desc,
        release_year: req.xop.release_year,
        user_id: req.decoded.user_id,
      });
      if (createMovie) {
        res.json({
          movie_name: createMovie.movie_name,
          movie_desc: createMovie.movie_desc,
          release_year: createMovie.release_year,
          user_id: createMovie.user_id,
        });
      } else {
        return next({
          status: 400,
          message: "Failed to add Movie",
        });
      }
    } else {
      return next({
        status: 400,
        message: "Movie already exits",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message,
    });
  }
};
//Get All Movies
const getAllMovieController = async (req, res, next) => {
  try {
    const getMovies = await models.movies.findAll({
      attributes: ["movie_id", "movie_name", "release_year", "movie_desc"],
      include: [
        {
          model: models.rating,
          as: "rating",
          attributes: ["rating_value"],
        },
      ],
    });
    // const totalItems = getMovies.length;
    // const totalPages = Math.ceil(totalItems / itemsPerPage);
    // const currentPage = 1;
    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const endIndex = startIndex + itemsPerPage;

    // const moviesForPage = getMovies.slice(startIndex, endIndex);
    const oneMoive = getMovies.map((m) => {
      const overallRating = m.rating.length
        ? m.rating.reduce((total, rating) => total + rating.rating_value, 0) /
          m.rating.length
        : 0;
      return {
        movie_id: m.movie_id,
        movie_name: m.movie_name,
        release_year: m.release_year,
        movie_desc: m.movie_desc,
        rating: overallRating,
      };
    });

    res.json(oneMoive);
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};
//Get One movie
const getOneMovieController = async (req, res, next) => {
  try {
    const getMovie = await models.movies.findOne({
      attributes: ["movie_name"],
      where: { movie_id: req.params.movie_id },
      include: [
        {
          model: models.rating,
          as: "rating",
          attributes: ["rating_value"],
          include: [
            {
              model: models.users,
              as: "ratingDoneBy",
              attributes: ["user_name"],
            },
          ],
        },
        {
          model: models.users,
          as: "addedBy",
          attributes: ["user_name"],
        },
      ],
      logging: true,
    });

    const ratings = getMovie.rating.map((rating) => ({
      rating: rating.rating_value,
      ratedBy: rating.ratingDoneBy.user_name,
    }));

    const overallRating = getMovie.rating.length
      ? getMovie.rating.reduce(
          (total, rating) => total + rating.rating_value,
          0
        ) / getMovie.rating.length
      : 0;

    const movieWithFormattedData = {
      movieName: getMovie.movie_name,
      addedBy: getMovie.addedBy.user_name,
      ratings,
      overallRating,
    };

    res.json({
      movieWithFormattedData,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};
// Update movie

const updateMovieController = async (req, res, next) => {
  try {
    const searchMovie = await models.movies.findOne({
      where: { movie_id: req.params.movie_id },
      logging: true,
    });
    console.log("searchMovie", searchMovie);
    if (req.decoded.user_id !== searchMovie.user_id) {
      return next({
        status: 400,
        message: "You cannot edit this movie",
      });
    }
    if (searchMovie === null) {
      return next({
        status: 400,
        message: "Movie not found",
      });
    } else {
      const updatedMovie = await models.movies.update(
        {
          movie_name: req.body.movie_name,
          movie_desc: req.body.movie_desc,
          release_year: req.body.release_year,
        },
        {
          where: {
            movie_id: req.params.movie_id,
          },
          returning: true,
          // individualHooks: true,
        }
      );
      if (updatedMovie) {
        res.json(req.body);
      }
    }
  } catch (error) {
    console.log("\n error...", error);
    return res.json({
      message: error,
    });
  }
};
module.exports = {
  addMovieController,
  getAllMovieController,
  getOneMovieController,
  updateMovieController,
};
// const addMovie = await models.movies.create({
//     movie_name: req.xop.movie_name,
//     movie_desc: req.xop.movie_desc,
//     release_year: req.xop.release_year,
//     user_id: req.decoded.id,
//   });
