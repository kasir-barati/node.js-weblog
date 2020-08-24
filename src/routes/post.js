const router = require('express').Router();

const PostController = require('../middlewares/controllers/post');
const PostValidator = require('../middlewares/validators/post');

router.route('/:slug')
    .get(PostController.getPost);

router.route('/category/:title')
    .get(PostValidator.checkCategoryTitle, PostController.getCategoryPosts);

router.route('/tag/:title')
    .get(PostValidator.checkTagTitle, PostController.getTagPosts);
    
router.route('/user/:id')
    .get(PostValidator.checkUserId, PostController.getUserPosts);

module.exports = router;