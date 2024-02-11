"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Comment, {
        as: "comments",
        foreignKey: "userId",
        targetKey: "userId",
      });
    }
  }

  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "email is in an invalid format",
          },
        },
      },
      homePage: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: false,
    }
  );

  return User;
};
