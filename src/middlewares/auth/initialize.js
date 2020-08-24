const passport = require('passport');
const UserModel = require('../../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findByPk(id)

            done(null, user);
        } catch (error) {
            done(error);
        };
    });
};