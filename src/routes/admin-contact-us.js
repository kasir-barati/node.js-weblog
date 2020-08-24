const router = require('express').Router();

const AdminContactUsController = require('../middlewares/controllers/admin-contact-us');
const AdminContactUsValidator = require('../middlewares/validators/admin-contact-us');
const Auth = require('../middlewares/controllers/auth');

router.route('/')
    .all(Auth.isAdmin)
    .get(AdminContactUsController.getContactUs);

router.route('/:id')
    .all(Auth.isAdmin, AdminContactUsValidator.checkContactUsId)
    .post(AdminContactUsValidator.postResponse, AdminContactUsController.postResponse)
    .delete(AdminContactUsController.deleteContactUs);

module.exports = router;