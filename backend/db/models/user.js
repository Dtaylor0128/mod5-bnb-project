'use strict';
const { Model, DataTypes } = require('sequelize');
const { Validator } = require('sequelize')

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId',
        as: 'Owner',
        onDelete: "CASCADE",
        hooks: true
      });

      User.hasMany(models.Review, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true
      });

      User.hasMany(models.Booking, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true
      });
    }
  }

  User.init(
    {
      firstName: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
          isAlpha: true
        }
      },
      lastName: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
          isAlpha: true
        }
      },
      email: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },

      },
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          },
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
        },
      },
    }
  );

  return User;
};
