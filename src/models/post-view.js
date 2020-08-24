const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('./index');

class PostViewModel extends Model {};
PostViewModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    userIp: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    systemInfo: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    }
}, {
    sequelize,
    modelName: 'post_views',
    timestamps: true,
    updatedAt: false,
    paranoid: false
});

module.exports = PostViewModel;