const path = require('path');

const UserModel = require('../models/user');
const { baseUrl } = require('../config');
const fs = require('fs');
const util = require('util');

const unlink = util.promisify(fs.unlink);

class AdminUserService {
    /**
     * read user
     * @param {UUID} id user id
     * @return {object} user
     */
    static async readUser(id) {
        try {
            const user = await UserModel.findByPk(id);

            return { user };
        } catch (error) { throw error };
    };

    /**
     * delete user
     * @param {UUID} id user id
     */
    static async deleteUser(id) {
        try {
            const user = await UserModel.findByPk(id);
            
            user.isDeleted = true;
            user.emailVerified = false;
            await unlink(path.join(__dirname, '..', '..', 'public', 'img', 'avatars', user.avatar.split('/avatars/')[1]));
            user.avatar = null;
            user.password = null;

            return await user.save();
        } catch (error) { throw error };
    };
    
    /**
     * 
     * @param {UUID} id user id
     * @param {string} email user email
     * @param {string} fullname user fullname
     * @param {string} phone user phone
     * @param {url} avatar user avatar
     */
    static async editUser(id, email, fullname, phone, avatar) {
        try {
            const user = await UserModel.findByPk(id);
            
            if (avatar) {
                const avatarFilename = `${Math.ceil(Math.random() * 1000)}${avatar.name}`;
                await avatar.mv(path.join(__dirname, '..', '..', 'public', 'img', 'avatars', avatarFilename));
                await unlink(path.join(__dirname, '..', '..', 'public', 'img', 'avatars', user.avatar.split('/avatars/')[1]));
                user.avatar = `${baseUrl}/img/avatars/${avatarFilename}`;
            };
            user.email = email;
            user.phone = phone;
            user.fullname = fullname;
            return await user.save();
        } catch (error) { throw error };
    };
};

module.exports = AdminUserService;