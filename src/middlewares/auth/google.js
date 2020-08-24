const passport = require('passport');

const config = require('../../config');
const initialize = require('./initialize');
const UserModel = require('../../models/user');
const UserRoleModel = require('../../models/user-role');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const simpleUser = await UserRoleModel.findOne({ where: { accessLevel: 1 } });
        const user = await UserModel.findOrCreate({
            where: {
                socialAccountId: profile.id
            },
            defaults: {
                fullname: profile.displayName || '',
                email: profile.emails || null,
                phone: profile.phone || null,
                avatar: profile._json.avatar_url || 'http://192.168.1.102:3000/img/avatars/default.png',
                emailVerified: true,
                socialAccountId: profile.id,
                userRoleId: simpleUser.id,
                password
            }
        });
        const emailContent = await EmailService.oauthWelcomeEmailContent(password);
        EmailService.sendMail(user.eamil, 'MoNey-NetWork - Your temporary password', emailContent);

        return done(null, user);
    } catch (error) { return done(error) };
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