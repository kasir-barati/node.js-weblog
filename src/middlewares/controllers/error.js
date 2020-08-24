const IndexService = require("../../services/index");

class ErrorController {
    static async notFoundPage (req, res, next) {
        try {
            const messages = req.flash('messages');
            const errorMessages = req.flash('errorMessages');
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.status(404).render('404', {
                messages,
                errorMessages,
                importantPosts,
                pageTitle: 'MoNey-NetWork - 404'
            });
        } catch (error) { next(error) };
    };
    static async internalErrorPage (error, req, res, next) {
        try {
            console.error(error);
            const messages = req.flash('messages');
            const errorMessages = req.flash('errorMessages');
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            
            res.status(500).render('500', {
                messages,
                errorMessages,
                importantPosts,
                csrfToken: req.csrfToken(),
                pageTitle: 'MoNey-NetWork - 500'
            });
        } catch (error) { next(error) };
    };
};

module.exports = ErrorController;