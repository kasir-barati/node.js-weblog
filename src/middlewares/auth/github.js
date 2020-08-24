const crypto = require('crypto');

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;


const config = require('../../config');
const initialize = require('./initialize');
const UserModel = require('../../models/user');
const EmailService = require('../../services/email');
const UserRoleModel = require('../../models/user-role');

passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL,
    scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const password = crypto.randomBytes(5).toString('hex');
        const simpleUser = await UserRoleModel.findOne({ where: { accessLevel: 1 } });
        const user = await UserModel.findOrCreate({
            where: { socialAccountId: profile.id },
            defaults: {
                fullname: profile.displayName || '',
                email: profile.emails[0].value || null,
                phone: profile.phone || null,
                avatar: profile._json.avatar_url || 'http://arianacloud.af/img/avatars/default.png',
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