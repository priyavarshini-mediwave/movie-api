const { DataTypes } = require("sequelize");
module.exports = function model(sequelize, types) {
  const Rating = sequelize.define(
    "rating",
    {
      rating_id: {
        type: types.UUID,
        defaultValue: types.UUIDV4,
        primarykey: true,
        unique: true,
      },
      rating_value: {
        type: types.INTEGER,
        allowNull: false,
      },
      movie_id: {
        type: types.UUID,
        references: {
          model: {
            tableName: "movies",
          },
          key: "movie_id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      user_id: {
        type: types.UUID,
        references: {
          model: {
            tableName: "users",
          },
          key: "user_id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "rating",
      timestamps: false,
    }
  );
  Rating.associate = function (models) {
    Rating.belongsTo(models.users, {
      as: "users",
      foreignKey: "user_id",
      targetKey: "user_id",
    });
    Rating.belongsTo(models.movies, {
      as: "movies",
      foreignKey: "movie_id",
      targetKey: "movie_id",
    });
  };
  return Rating;
};
