const { DataTypes } = require("sequelize");
module.exports = function model(sequelize, types) {
  const Users = sequelize.define(
    "users",
    {
      user_id: {
        type: types.UUID,
        defaultValue: types.UUIDV4,
        primarykey: true,
        unique: true,
      },
      first_name: {
        type: types.STRING,
        allowNull: false,
      },
      last_name: {
        type: types.STRING,
        defaultValue: "",
      },
      user_name: {
        type: types.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: types.STRING,
        allowNull: false,
      },
      user_password: {
        type: types.STRING,
        allowNull: false,
      },
      phone_no: {
        type: types.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
  Users.beforeCreate(async (user) => {
    try {
      if (user.user_password) {
        user.user_password = await helper.hashPassword(user.user_password);
      }
    } catch (error) {
      console.log("\n save password hash error...", error);
    }
  });
  Users.addHook("beforeUpdate", async (user) => {
    console.log("Update user", user);
    try {
      if (user.changed("user_password") && user.user_password) {
        user.user_password = await helper.hashPassword(user.user_password);
        console.log("Update user password", user.user_password);
      }
    } catch (error) {
      console.log("\n Update user_password hash error:", error);
    }
  });
  Users.associate = function (models) {
    Users.hasMany(models.movies, {
      as: "movies",
      foreignKey: "user_id",
      sourceKey: "user_id",
    });
    Users.hasMany(models.rating, {
      as: "rating",
      foreignKey: "user_id",
      sourceKey: "user_id",
    });
  };
  return Users;
};
