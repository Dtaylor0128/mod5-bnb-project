'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class SpotImage extends Model {
        static associate(models) {

            // define association here

            SpotImage.belongsTo(models.Spot, {
                foreignKey: "spotId",
                onDelete: "CASCADE",
                hooks: true
            });

        }
    }
    SpotImage.init({
        spotId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [8, 500],
                isGoodUrl(val) {
                    if (val.startsWith(" ")) {
                        throw new Error("Can't start with empty space")
                    } else if (val.endsWith(" ")) {
                        throw new Error("Dont end with spaces please");
                    }
                }
            }
        },
        preview: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
        {
            sequelize,
            modelName: 'SpotImage',
            // defaultScope: {
            //     attributes: {
            //       exclude: ['createdAt', 'updatedAt'],
            //     },
            //   },
        }
    );
    return SpotImage;
};
