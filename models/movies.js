const { DataTypes } = require("sequelize");
module.exports = function model(sequelize, types) {
  const Movies = sequelize.define(
    "movies",
    {
      movie_id: {
        type: types.UUID,
        defaultValue: types.UUIDV4,
        primarykey: true,
        unique: true,
      },
      movie_name: {
        type: types.STRING,
        allowNull: false,
      },
      movie_desc: {
        type: types.STRING,
        allowNull: false,
      },
      release_year: {
        type: types.INTEGER,
        allowNull: false,
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
      movie_img_path: {
        type: DataTypes.TEXT,
        defaultValue: "",
        allowNull: true,
      },
    },

    {
      tableName: "movies",
      timestamps: false,
    }
  );
  Movies.associate = function (models) {
    Movies.belongsTo(models.users, {
      as: "addedBy",
      foreignKey: "user_id",
      targetKey: "user_id",
    });
    Movies.hasMany(models.rating, {
      as: "rating",
      foreignKey: "movie_id",
      sourceKey: "movie_id",
    });
  };
  return Movies;
};
