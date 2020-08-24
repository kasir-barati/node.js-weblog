const PostModel = require("../../models/post");
const UserModel = require("../../models/user");
const CommentModel = require("../../models/comment");
const Validator = require('../../services/validator');

class AdminCommentValidator {
    static async postCreateComment(req, res, next) {
        try {
            const errorMessages = [];
            const { markedContent, commentId, postId } = req.body;

            if (!markedContent || !postId) {
                errorMessages.push('باس یه پیغومی بینویسی');
            } else if (!await PostModel.findByPk(postId)) {
                errorMessages.push(`همچین پستی نداریم`);
            } else {
                if (commentId) {
                    !await CommentModel.findByPk(commentId) ? errorMessages.push(`همچین کامنتی نداریم`) : '';
                };
                !Validator.isSmallerThan(400, markedContent) ? errorMessages.push('کامنت بیشتر از ۴۰۰ کارکتر مجاز نی') : '';
            };

            if (errorMessages.length > 0) {PostModel
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async checkCommentId(req, res, next) {
        try {
            const { id } = req.params;
            const errorMessages = [];

            !await CommentModel.findByPk(id) ? errorMessages.push('همچین کامنتی نداشتیمو') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('/404');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async putComment(req, res, next) {
        try {
            const errorMessages = [];
            const { markedContent } = req.body;

            if (!markedContent) {
                errorMessages.push('باس یه پیغومی بینویسی');
            } else {
                !Validator.isSmallerThan(800, markedContent) ? errorMessages.push('کامنت بیشتر از ۴۰۰ کارکتر مجاز نی') : '';
            };

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };
}; 

module.exports = AdminCommentValidator;