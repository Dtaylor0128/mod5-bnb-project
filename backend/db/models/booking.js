'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Booking extends Model {
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true
      });
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true
      });
    };
  };

  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          // // write a custom validation in here
          // Simplified Version of pastDate
          // isDate: true,
          // isNotInPast(value) {
          //   const today = new Date();
          //   today.setHours(0, 0, 0, 0);
          //   if (new Date(value) < today) {
          //     throw new Error("Start date cannot be in the past, please try again");
          //   }
          // }

          isAGoodDate(val) {
            // 12-05-2025 -> dec, 5th 2025
            // [12, 05, 2025]
            const dateArr = val.split("-");
            for (let date of dateArr) {
              if (typeof parseInt(date) !== "number") {
                throw new Error("Start date cannot be in the past, please try again")
              }
            }
          }
        }
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          // isDate: true,
          // isAfterStartDate(value) {
          //   if (new Date(value) <= new Date(this.startDate)) {
          //     throw new Error("End date cannot be before or on start date, please try again");
          //   }
          // }

          isAGoodEndDate(val) {
            // checking if the end date comes after the new date
            const startDate = new Date(this.startDate);
            const endDate = new Date(val);

            if (endDate < startDate) {
              throw new Error("End date can not come before start date");
            }
          }
        }
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      // defaultScope: {
      //   attributes: {
      //     exclude: ['createdAt', 'updatedAt'],
      //   },
      // },
    }
  );

  return Booking;
};
