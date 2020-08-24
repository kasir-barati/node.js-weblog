const { sequelize } = require('./index');
const { Model, DataTypes } = require('sequelize');

class TagModel extends Model {};
TagModel.init({
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
    modelName: 'tags',
    timestamps: true,
    paranoid: false
});

module.exports = TagModel;