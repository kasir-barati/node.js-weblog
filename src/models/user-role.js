const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('./index');

class UserRoleModel extends Model {};
UserRoleModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    accessLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true
        }
    }
}, {
    sequelize,
    modelName: 'userRoles',
    timestamps: true,
    paranoid: false
});

module.exports = UserRoleModel;