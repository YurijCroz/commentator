"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userName: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      homePage: {
        type: Sequelize.STRING(256),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      refreshToken: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
