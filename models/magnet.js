"use strict";

module.exports = function(sequelize, DataTypes) {
  var Magnet = sequelize.define("Magnet", {
    hash: DataTypes.STRING,
    name: DataTypes.STRING(1000),
    files: DataTypes.TEXT,
    size: DataTypes.BIGINT,
    node_count: DataTypes.INTEGER
  }, {
    indexs: [
        {
            unique: true,
            fields: ['hash']
        }
    ]
  });
  return Magnet;
};
