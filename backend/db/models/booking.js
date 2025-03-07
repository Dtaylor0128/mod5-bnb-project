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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // write a custom validation in here
          isAGoodDate(val){
            // 12-05-2025 -> dec, 5th 2025
             // [12, 05, 2025]
             const dateArr = val.split("-");
              for(let date of dateArr){
                if(typeof parseInt(date) !== "number"){
                  throw new Error("Oooppps")
                }
              }


          }
        }
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        isAGoodEndDate(val){
          // checking if the end date comes after the new date
          const startDate = new Date(this.startDate);
          const endDate = new Date(val);

          if(endDate < startDate){
            throw new Error("End date can not come before start date");
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
