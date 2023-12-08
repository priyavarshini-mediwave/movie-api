// const { Module } = require("module");
// const config = require("../config/config");
const { sequelize, models, Sequelize } = require("../config/sequelize-config");

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
      message: error,
    });
  }
};
module.exports = {
  addMovieController,
};
// const addMovie = await models.movies.create({
//     movie_name: req.xop.movie_name,
//     movie_desc: req.xop.movie_desc,
//     release_year: req.xop.release_year,
//     user_id: req.decoded.id,
//   });
