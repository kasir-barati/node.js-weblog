const CategoryModel = require("../../models/category");
const Validator = require('../../services/validator');
const PostModel = require("../../models/post");
const TagModel = require("../../models/tag");

class AdminPostValidator {
    static async deletePost(req, res, next) {
        try {
            const errorMessages = [];
            const { slug } = req.params;
            const post = await PostModel.findOne({ where: { slug } });

            if (!post) {
                errorMessages.push('همچین پستی نداشتیمو');
            } else if (post.userId !== req.user.id) {
                errorMessages.push('تو همچین پستی نداری.');
            };

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async checkCategoryTitle(req, res, next) {
        try {
            const { title } = req.params;
            const errorMessages = [];

            !await CategoryModel.findOne({ where: { title } }) ? errorMessages.push('همچین دسته بندی نداشتیمو') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async checkTagTitle(req, res, next) {
        try {
            const { title } = req.params;
            const errorMessages = [];

            !await TagModel.findOne({ where: { title } }) ? errorMessages.push('همچین تگی نداشتیمو') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async putEditPost(req, res, next) {
        try {
            const errorMessages = [];
            const { slug } = req.params;
            const thumbnail = req.files ? req.files.thumbnail : null;
            const baner = req.files ? req.files.baner : null;
            const post = await PostModel.findOne({ where: { slug } });
            const { title, markedContent, description, isPublished, categories, tags } = req.body;

            if (!post || post.userId !== req.user.id) {
                errorMessages.push('همچین پستی نداشتیمو');
            } else if (!title || !markedContent || !description || !categories || !tags) {
                errorMessages.push('همه‌ی فیلدا رو باس پر کنی')
            } else {
                !Validator.isSmallerThan(255, title) ? errorMessages.push('عنوان پست بیشتر از ۲۵۵ کارکتر نباس باشه') : '';
                !Validator.isSmallerThan(600, description) ? errorMessages.push('توضیحات پست بیشتر از ۶۰۰ کارکتر نباس باشه') : '';
                if (thumbnail) {
                    !Validator.isPicture(thumbnail.name) ? errorMessages.push('فرمت عکسای مجاز: png, jpg, jpeg, svg') : '';
                };
                if (baner) {
                    !Validator.isPicture(baner.name) ? errorMessages.push('فرمت عکسای مجاز: png, jpg, jpeg, svg') : '';
                };
                categories.split('-').map(category => category.trim()).forEach(async category => {
                    !await CategoryModel.findOne({ where: { title: category } }) ? errorMessages.push(`این دسته بندی ${category} رو نداریم`) : '';
                });
                tags.split('-').map(tag => tag.trim()).forEach(async tag => {
                    !await TagModel.findOne({ where: { title: tag } }) ? errorMessages.push(`این تگ ${tag} رو نداریم`) : '';
                });
            };

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect(`back`);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async createPost(req, res, next) {
        try {
            const errorMessages = [];
            const { thumbnail, baner } = req.files;
            const { title, markedContent, description, isPublished, categories, tags } = req.body;

            if (!title || markedContent || description || thumbnail || baner || categories || tags) {
                errorMessages.push('همه‌ی فیلدا رو باس پر کنی')
            } else {
                !Validator.isSmallerThan(255, title) ? errorMessages.push('عنوان پست بیشتر از ۲۵۵ کارکتر نباس باشه') : '';
                !Validator.isSmallerThan(600, description) ? errorMessages.push('توضیحات پست بیشتر از ۶۰۰ کارکتر نباس باشه') : '';
                !Validator.isPicture(thumbnail.name) ? errorMessages.push('فرمت عکسای مجاز: png, jpg, jpeg, svg') : '';
                !Validator.isPicture(baner.name) ? errorMessages.push('فرمت عکسای مجاز: png, jpg, jpeg, svg') : '';
                categories.split('-').map(category => category.trim()).forEach(async category => {
                    !await CategoryModel.findOne({ where: { title: category } }) ? errorMessages.push(`این دسته بندی ${category} رو نداریم`) : '';
                });
                tags.split('-').map(tag => tag.trim()).forEach(async tag => {
                    !await TagModel.findOne({ where: { title: tag } }) ? errorMessages.push(`این تگ ${category} رو نداریم`) : '';
                });
            };

            if (errorMessages.length > 0) {
                req.flash('post', { title, markedContent, description, thumbnail, baner, isPublished: isPublished === 'checked' ? true : false, categories, tags });
                req.flash('errorMessages', errorMessages);
                res.redirect('/posts/create');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };
};

module.exports = AdminPostValidator;