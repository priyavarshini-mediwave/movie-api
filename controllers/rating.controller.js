const { sequelize, models, Sequelize } = require("../config/sequelize-config");
const addRatingController = async (req, res, next) => {
  try {
    const addRating = await models.rating.create({
      movie_id: req.params.id,
      rating_value: req.body.rating_value,
      user_id: req.decoded.user_id,
    });
    if (addRating) {
      res.json(addRating);
    } else {
      return next({
        status: 400,
        message: "Failed to add Movie",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: error,
    });
  }
};
module.exports = {
  addRatingController,
};
