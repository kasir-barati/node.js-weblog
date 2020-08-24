const router = require('express').Router();

const AdminCommentController = require('../middlewares/controllers/admin-comment');
const AdminCommentValidator = require('../middlewares/validators/admin-comment');
const Auth = require('../middlewares/controllers/auth');

router.route('/create')
    .all(Auth.isLoggedIn)
    .post(AdminCommentValidator.postCreateComment, AdminCommentController.postCreateComment);

router.route('/:id')
    .all(Auth.isLoggedIn, AdminCommentValidator.checkCommentId)
    .put(AdminCommentValidator.putComment, AdminCommentController.putComment)
    .delete(AdminCommentController.deleteComment);

module.exports = router;