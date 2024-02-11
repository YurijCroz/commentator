"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comments", {
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      parentCommentId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Comments",
          key: "commentId",
        },
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      fileName: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "userId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comments");
  },
};
