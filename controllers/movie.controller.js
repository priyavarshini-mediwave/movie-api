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
const listMovieController = async (req, res, next) => {
  try {
    // const movieList = await models.movies.findAll();
    // if (movieList) {
    //   res.json(movieList);
    // } else {
    //   return next({
    //     status: 400,
    //     message: "No movie found",
    //   });
    // }
    const moviesList = await models.movies.findAll({
      attributes: ["movies.id", "movies.movie_id", "movies.movie_name"],
      logging: true,
      attributes: [
        [
          Sequelize.fn("AVG", Sequelize.col("rating.rating_value")),
          "overall_rating",
        ],
        "movie_id",
      ],
      include: [
        {
          as: "rating",
          model: models.rating,
          required: true,
          // where: whereQuery,

          group: ["movie_id"],
        },
      ],

      group: [
        "movies.id",
        "movies.movie_id",
        "movies.movie_name",
        "rating.rating_id",
        "rating.id",
      ],
      order: [["movie_name", "asc"]],
    });
    //console.log(moviesList);
    if (moviesList) {
      res.send(moviesList);
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
    });
  }
};

module.exports = {
  addMovieController,
  listMovieController,
};
// const addMovie = await models.movies.create({
//     movie_name: req.xop.movie_name,
//     movie_desc: req.xop.movie_desc,
//     release_year: req.xop.release_year,
//     user_id: req.decoded.id,
//   });
