"use strict";

module.exports.emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

module.exports.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

module.exports.userNameRegex = /^[a-zA-Zа-яА-Я]+$/gm;

module.exports.homePageRegex = /^(http|https):\/\/[^\s\/$.?#].[^\s]*$/i;
