const CategoryModel = require("../../models/category");
const Validator = require('../../services/validator');
const UserModel = require("../../models/user");
const PostModel = require("../../models/post");
const TagModel = require("../../models/tag");
const router = require("../../routes/post");

class PostValidator {
    static async checkCategoryTitle(req, res, next) {
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

    static async checkUserId(req, res, next) {
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

    static async checkTagTitle(req, res, next) {
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

module.exports = PostValidator;