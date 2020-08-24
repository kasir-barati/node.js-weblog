const CategoryModel = require("../../models/category");
const UserModel = require("../../models/user");
const TagModel = require("../../models/tag");

class CommentValidator {
    static async postCreateComment (req, res, next) {
        try {
            const { id } = req.session.user;
            const { title, content, description, thumbnail, baner, isPublished , categories, tags } = req.body;
        } catch (error) { next(error) };
    };

    static async checkCategoryTitleExistence(req, res, next) {
        try {
            const { title } = req.params;
            const errorMessages = [];
            
            !await CategoryModel.findOne({ where: { title } }) ? errorMessages.push('همچین دسته بندی نداشتیمو') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('/404');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async checkUserIdExistence(req, res, next) {
        try {
            const { id } = req.params;
            const errorMessages = [];
            
            !await UserModel.findByPk(id) ? errorMessages.push('همچین کاربری نداشتیمو') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('/404');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async checkTagTitleExistence(req, res, next) {
        try {
            const { title } = req.params;
            const errorMessages = [];
            
            !await TagModel.findOne({ where: { title } }) ? errorMessages.push('همچین تگی نداشتیمو') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('/404');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };
};

module.exports = CommentValidator;