const Joi = require("joi");

const ratingValueSchema = Joi.object({
  // ,movie_id: Joi.string().required()
  //user_id: Joi.string().required(),
  rating_value: Joi.number().integer().min(1).max(5).required(),
});

module.exports = {
  ratingValueSchema,
};
