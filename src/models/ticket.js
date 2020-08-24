const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class TicketModel extends Model{};
TicketModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    }
}, {
    sequelize,
    modelName: 'tickets',
    timestamps: true,
    paranoid: false,
    updatedAt: false
});

module.exports = TicketModel;