"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
        targetKey: "userId",
      });
      Comment.belongsTo(models.Comment, {
        as: "parentComment",
        foreignKey: "parentCommentId",
        allowNull: true,
      });
      Comment.hasMany(models.Comment, {
        as: "replies",
        foreignKey: "parentCommentId",
        targetKey: "commentId",
      });
    }
  }

  Comment.init(
    {
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      parentCommentId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "Comments",
      timestamps: false,
    }
  );

  return Comment;
};
