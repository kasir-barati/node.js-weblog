const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const initialize = require('./initialize');
const UserModel = require('../../models/user');
const UserRoleModel = require('../../models/user-role');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try { done(null, await UserModel.findOne({ where: { email } })) } catch (error) { done(error) };
}));

initialize();

const callback = async (req, res, next) => {
    const userRole = await UserRoleModel.findByPk(req.user.userRoleId);

    if (userRole.accessLevel === 4) {
        res.redirect('/admin/posts');
    } else {
        res.redirect('/');
    };
};

module.exports = {
    passport,
    callback
};