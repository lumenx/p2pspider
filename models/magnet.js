"use strict";

module.exports = function(sequelize, DataTypes) {
  var Magnet = sequelize.define("Magnet", {
    hash: DataTypes.STRING,
    name: DataTypes.STRING,
    files: DataTypes.STRING,
    size: DataTypes.INTEGER
  });
  return Magnet;
};