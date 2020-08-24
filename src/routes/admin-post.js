const router = require('express').Router();

const AdminPostController = require('../middlewares/controllers/admin-post');
const AdminPostValidator = require('../middlewares/validators/admin-post');
const Auth = require('../middlewares/controllers/auth');

router.route('/')
    .all(Auth.isAdmin)
    .get(AdminPostController.getPosts);

router.route('/create')
    .all(Auth.isAdmin)
    .get(AdminPostController.getCreatePost)
    .post(AdminPostValidator.createPost, AdminPostController.createPost);

router.route('/edit/:slug')
    .all(Auth.isAdmin)
    .get(AdminPostController.getEditPost);

router.route('/:slug')
    .all(Auth.isAdmin)
    .put(AdminPostValidator.putEditPost, AdminPostController.putEditPost)
    .delete(AdminPostValidator.deletePost, AdminPostController.deletePost);

router.route('/category/:title')
    .all(Auth.isAdmin)
    .get(AdminPostValidator.checkCategoryTitle, AdminPostController.getCategoryPosts);

router.route('/tag/:title')
    .all(Auth.isAdmin)
    .get(AdminPostValidator.checkTagTitle, AdminPostController.getTagPosts);

module.exports = router;