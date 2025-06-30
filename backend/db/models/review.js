'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {

      // define association here
      Review.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true
      });
      // A Review belongs to a Spot
      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true
      });

      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewId",
        onDelete: "CASCADE",
        hooks: true
      });

    }
  }


  Review.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
        },
      },

      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        },
      },

      createdAt: {
        type: DataTypes.DATE,
      },

      updatedAt: {
        type: DataTypes.DATE,
      },

    },

    {
      sequelize,
      modelName: 'Review',
      defaultScope: {
        attributes: {
          //  exclude: ['createdAt', 'updatedAt'],
        },
      },
    }
  );
  return Review;
};
