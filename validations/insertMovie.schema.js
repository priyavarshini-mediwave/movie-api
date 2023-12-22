//movie_name,
//movie_desc
//release_year
//user_id
const Joi = require("joi");

const movieaddSchema = Joi.object({
  movie_name: Joi.string().required().min(5),
  movie_desc: Joi.string().required(),
  //release_year: Joi.number().integer().required(),
  release_year: Joi.string().pattern(new RegExp("^[0-9]{4}$")).required(),
  //   user_id: Joi.string().required(),
});
const updatemovieSchema = Joi.object({
  movie_name: Joi.string().min(5),
  movie_desc: Joi.string(),
  release_year: Joi.string().pattern(new RegExp("^[0-9]{4}$")),
});

module.exports = {
  movieaddSchema,
  updatemovieSchema,
};
