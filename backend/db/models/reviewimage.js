'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ReviewImage extends Model {
        static associate(models) {

            // define association here

            ReviewImage.belongsTo(models.Review, {
                foreignKey: "reviewId",
                onDelete: "CASCADE",
                hooks: true
            });

        }
    }

    ReviewImage.init(
        {

            reviewId: {
                type: DataTypes.INTEGER,
                allowNull: false,
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

        },
        {
            sequelize,
            modelName: 'ReviewImage',
        }
    );
    return ReviewImage;
};
