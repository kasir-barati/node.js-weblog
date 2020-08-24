const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('./index');
const { truncate } = require('./tag');

class CategoryModel extends Model {};
CategoryModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    }
}, {
    sequelize,
    modelName: 'categories',
    timestamps: true,
    paranoid: false
});

module.exports = CategoryModel;