const bcrypt = require('bcrypt');
const { Model, DataTypes } = require('sequelize');

const PostModel = require('./post');
const { sequelize } = require('./index');
const CommentModel = require('./comment');
const PostViewModel = require('./post-view');
const UserRoleModel = require('./user-role');
const { passwordHashSalt } = require('../config');

class UserModel extends Model {};
UserModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    fullname: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: DataTypes.STRING,
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //     isUrl: true
        // }
    },
    password: DataTypes.STRING,
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    socialAccountId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'users',
    timestamps: true,
    paranoid: false,
    hooks: {
        beforeCreate: async function (user) {
            const salt = await bcrypt.genSalt(Number(passwordHashSalt));
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

/**
 * users 1:N posts
 */
UserModel.hasMany(PostModel);
PostModel.belongsTo(UserModel, { constraints: true, onDelete: 'NO ACTION' });
/**
 * users 1:N comments
 */
UserModel.hasMany(CommentModel);
CommentModel.belongsTo(UserModel, { constraints: true, onDelete: 'NO ACTION'});
/**
 * users 1:N post_views
 */
UserModel.hasMany(PostViewModel);
PostViewModel.belongsTo(UserModel);
/**
 * userRole 1:N user
 */
UserRoleModel.hasMany(UserModel);
UserModel.belongsTo(UserRoleModel, { constraints: true, onDelete: 'NO ACTION' });

module.exports = UserModel;