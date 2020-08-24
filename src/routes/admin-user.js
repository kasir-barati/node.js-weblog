const router = require('express').Router();

const AdminUserController = require('../middlewares/controllers/admin-user');
const AdminUserValidator = require('../middlewares/validators/admin-user');
const Auth = require('../middlewares/controllers/auth');

router.route('/')
    .all(Auth.isLoggedIn)
    .get(AdminUserController.getUsers);

router.route('/create')
    .all(Auth.isAdmin)
    .get(AdminUserController.getCreateUser)
    .post(AdminUserValidator.postCreateUser, AdminUserController.postCreateUser);

router.route('/edit/:id')
    .all(Auth.isAdmin)
    .get(AdminUserValidator.checkUserId, AdminUserController.getEditUser);

router.route('/:id')
    .all(Auth.isLoggedIn, AdminUserValidator.checkUserId)
    .put(AdminUserValidator.putUser, AdminUserController.putUser)
    .delete(AdminUserController.deleteUser);

router.route('/password-reset')
    .all(Auth.isLoggedIn)
    .put(AdminUserValidator.putPasswordReset, AdminUserController.putPasswordReset);

module.exports = router;