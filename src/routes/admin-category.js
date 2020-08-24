const router = require('express').Router();

const AdminCategoryController = require('../middlewares/controllers/admin-category');
const AdminCategoryValidator = require('../middlewares/validators/admin-category');
const Auth = require('../middlewares/controllers/auth');

router.route('/')
    .all(Auth.isAdmin)
    .get(AdminCategoryController.getCategories);

router.route('/create')
    .all(Auth.isAdmin)
    .get(AdminCategoryController.getCreateCategory)
    .post(AdminCategoryValidator.postCreateCategory, AdminCategoryController.postCreateCategory);

router.route('/edit/:title')
    .all(Auth.isAdmin)
    .get(AdminCategoryValidator.checkCategoryTitle, AdminCategoryController.getEditCategory);

router.route('/:title')
    .all(Auth.isAdmin, AdminCategoryValidator.checkCategoryTitle)
    .put(AdminCategoryValidator.putCategory, AdminCategoryController.putCategory)
    .delete(AdminCategoryController.deleteCategory);

module.exports = router;