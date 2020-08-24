const AdminCommentService = require('../../services/admin-comment');

class AdminCommentController {
    static async postCreateComment(req, res, next) {
        try {
            const { id } = req.user;
            const { markedContent, commentId, postId } = req.body;

            await AdminCommentService.createComment(id, markedContent, commentId, postId);

            req.flash('messages', ['کامنت ساخته رف']);
            res.redirect('back');
        } catch (error) { next(error) };
    };

    static async putComment(req, res, next) {
        try {
            const { id } = req.params;
            const { markedContent } = req.body;

            await AdminCommentService.editComment(id, markedContent);

            req.flash('messages', ['کامنت ویرایش شد']);
            res.redirect('back');
        } catch (error) { next(error) };
    };

    static async deleteComment(req, res, next) {
        try {
            const { id } = req.params;
            
            await AdminCommentService.deleteComment(id);

            req.flash('messages', ['کامنت حذف شذ']);
            res.redirect('back');
        } catch (error) { next(error) };
    };
};

module.exports = AdminCommentController;