const router = require('express').Router();

const AdminTagController = require('../middlewares/controllers/admin-tag');
const AdminTagValidator = require('../middlewares/validators/admin-tag');
const Auth = require('../middlewares/controllers/auth');

router.route('/')
    .all(Auth.isAdmin)
    .get(AdminTagController.getTags);

router.route('/create')
    .all(Auth.isAdmin)
    .get(AdminTagController.getCreateTag)
    .post(AdminTagValidator.postCreateTag, AdminTagController.postCreateTag);

router.route('/edit/:title')
    .all(Auth.isAdmin)
    .get(AdminTagValidator.checkTagTitle, AdminTagController.getEditTag);

router.route('/:title')
    .all(Auth.isAdmin, AdminTagValidator.checkTagTitle)
    .put(AdminTagValidator.putTag, AdminTagController.putTag)
    .delete(AdminTagController.deleteTag);

module.exports = router;