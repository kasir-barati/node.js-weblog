const router = require('express').Router();

const passportLocal = require('../middlewares/auth/local');
const passportGoogle = require('../middlewares/auth/google');
const passportGithub = require('../middlewares/auth/github');
const IndexController = require('../middlewares/controllers/index');
const IndexValidator = require('../middlewares/validators/index');
const Auth = require('../middlewares/controllers/auth');

router.route('/')
    .get(IndexController.getIndex);

router.route('/404')
    .get(IndexController.get404);

router.route('/blog')
    .get(IndexController.getBlog);

router.route('/search')
    .post(IndexController.postSearch);

router.route('/login')
    .all(Auth.isLoggedIn)
    .get(IndexController.getLogin)
    .post(IndexValidator.postLogin, passportLocal.passport.authenticate('local', { failureRedirect: '/login' }), passportLocal.callback);

router.route('/logout')
    .all(Auth.isLoggedIn)
    .get(IndexController.getLogout);

router.route('/auth/github')
    .all(Auth.isLoggedIn)
    .get(passportGithub.passport.authenticate('github', { scope: ['user:email'] }));

router.route('/auth/github/callback')
    .all(Auth.isLoggedIn)
    .get(passportGithub.passport.authenticate('github', { failureRedirect: '/login' }), passportGithub.callback);

router.route('/auth/google')
    .all(Auth.isLoggedIn)
    .get(passportGoogle.passport.authenticate('google', { scope: ['user:email'] }));

router.route('/auth/google/callback')
    .all(Auth.isLoggedIn)
    .get(passportGoogle.passport.authenticate('google', { failureRedirect: '/login' }), passportGoogle.callback);

router.route('/register')
    .all(Auth.isLoggedIn)
    .get(IndexController.getRegister)
    .post(IndexValidator.postRegister, IndexController.postRegister);

router.route('/email-verification')
    .all(Auth.isLoggedIn)
    .post(IndexValidator.postEmailVerification, IndexController.postEmailVerification);

router.route('/email-verification/:token')
    .all(Auth.isLoggedIn)
    .get(IndexValidator.getEmailVerification, IndexController.getEmailVerification);

router.route('/password-reset')
    .all(Auth.isLoggedIn)
    .post(IndexValidator.postPasswordReset, IndexController.postPasswordReset);

router.route('/password-reset/:token')
    .all(Auth.isLoggedIn)
    .get(IndexValidator.getPasswordResetToken, IndexController.getPasswordResetToken)
    .put(IndexValidator.putPasswordResetToken, IndexController.putPasswordResetToken);

router.route('/contact-us')
    .get(IndexController.getContactUs)
    .post(IndexValidator.postContactUs, IndexController.postContactUs);

router.route('/about-us')
    .get(IndexController.getAboutUs);

module.exports = router;