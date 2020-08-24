const TagModel = require("../../models/tag");
const Validator = require('../../services/validator');

class AdminTagValidator {
    static async postCreateTag(req, res, next) {
        try {
            const errorMessages = [];
            const { title, description } = req.body;

            if (!title || !description) {
                errorMessages.push('همه‌ی فیلدا رو باس پر کنی')
            } else if (await TagModel.findOne({ where: { title } })) {
                errorMessages.push(`این تگ رو داریم`);
            } else {
                !Validator.isSmallerThan(255, title) ? errorMessages.push('عنوان پست بیشتر از ۲۵۵ کارکتر نباس باشه') : '';
                !Validator.isSmallerThan(600, description) ? errorMessages.push('توضیحات پست بیشتر از ۶۰۰ کارکتر نباس باشه') : '';
            };

            if (errorMessages.length > 0) {
                req.flash('post', { title, description });
                req.flash('errorMessages', errorMessages);
                res.redirect('/admin/tags/create');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async checkTagTitle(req, res, next) {
        try {
            const { title } = req.params;
            const errorMessages = [];

            !await TagModel.findOne({ where: { title } }) ? errorMessages.push('همچین دسته بندی نداشتیمو') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('/404');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async putTag(req, res, next) {
        try {
            const errorMessages = [];
            const { title: oldTitle } = req.params;
            const { title, description } = req.body;

            if (!title || !description) {
                errorMessages.push('همه‌ی فیلدا رو باس پر کنی')
            } else if (title !== oldTitle && await TagModel.findOne({ where: { title } })) {
                errorMessages.push(`این دسته بندی رو داریم`);
            } else {
                !Validator.isSmallerThan(50, title) ? errorMessages.push('عنوان پست بیشتر از ۵۰ کارکتر نباس باشه') : '';
                !Validator.isSmallerThan(300, description) ? errorMessages.push('توضیحات پست بیشتر از ۳۰۰ کارکتر نباس باشه') : '';
            };

            if (errorMessages.length > 0) {
                req.flash('post', { title, description });
                req.flash('errorMessages', errorMessages);
                res.redirect(`/admin/tags/edit/${oldTitle}`);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };
};

module.exports = AdminTagValidator;