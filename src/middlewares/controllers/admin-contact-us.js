const IndexService = require('../../services/index');
const AdminContactUsService = require('../../services/admin-contact-us');

class AdminCategoryController {
    static async getContactUs(req, res, next) {
        try {
            const { id } = req.user;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags(id);
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories(id);
            const { categories: allCategories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            const { tickets } = await AdminContactUsService.readContactUs();
            const { comments } = await AdminCommentService.readUserComments(5, id);
            
            res.render('admin/contact-us', {
                tags,
                tickets,
                comments,
                messages,
                categories,
                allCategories,
                errorMessages,
                importantPosts,
                user: req.user,
                pageTitle: `Money-Network - Categories`
            });
        } catch (error) { next(error) };
    };

    static async postResponse(req, res, next) {
        try {
            const { id } = req.params;
            const { userEmail, adminEmail, subject, message } = req.body;

            await AdminContactUsService.createTicket(id, userEmail, adminEmail, subject, message);

            req.flash('messages', 'پاسخ ارسال شد');
            res.redirect('/admin/contact-us');
        } catch (error) { next(error) };
    };

    static async deleteContactUs(req, res, next) {
        try {
            const { id } = req.params;

            await AdminContactUsService.deleteContactUs(id);

            req.flash('messages', 'تیکت کاربر حذف شد');
            res.redirect('/admin/contact-us');
        } catch (error) { next(error) };
    };
};

module.exports = AdminCategoryController;
