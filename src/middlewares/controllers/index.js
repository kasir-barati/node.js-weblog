const IndexService = require('../../services/index');
const { postPerPage } = require('../../config');
const EmailService = require('../../services/email');

class IndexController {
    static async getContactUs(req, res, next) {
        try {
            const messages = req.flash('messages');
            const errorMessages = req.flash('errorMessages');
            const { tags } = await IndexService.readTags();
            const { categories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('contact-us', {
                tags,
                messages,
                categories,
                errorMessages,
                importantPosts,
                pageTitle: 'MoNey-NetWork - Contact Us',
            });
        } catch (error) { next(error) };
    };

    static async getAboutUs(req, res, next) {
        try {
            const { users } = await IndexService.readUsers([4, 3]);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('about-us', {
                users,
                importantPosts,
                pageTitle: 'MoNey-NetWork - About Us'
            });
        } catch (error) { next(error) };
    };

    static async postEmailVerification(req, res, next) {
        try {
            const { email } = req.body;

            await IndexService.sendEmailActivation(email);

            req.flash('messages', ['ایمیلتو یه چک کن']);
            res.redirect('/login');
        } catch (error) { next(error) };
    };

    static async getEmailVerification(req, res, next) {
        try {
            const { token } = req.params;
            
            await IndexService.activateUserAccount(token);
            req.flash('messages', ['ایمیلت فعالیده شد.']);
            res.redirect('/login');
        } catch (error) { next(error) };
    };

    static async getIndex(req, res, next) {
        try {
            const { posts: latestPosts } = await IndexService.readCategoryPosts(3, 1, 'latest');
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('index', {
                latestPosts,
                importantPosts,
                pageTitle: 'MoNey-NetWork - Imagine it'
            });
        } catch (error) { next(error) };
    };

    static async get404(req, res, next) {
        try {
            const errorMessages = req.flash('errorMessages');
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            const messages = req.flash('messages');

            res.render('404', {
                messages,
                errorMessages,
                importantPosts,
                pageTitle: 'MoNey-NetWork - 404'
            });
        } catch (error) { next(error) };
    };

    static async getBlog(req, res, next) {
        try {
            const page = req.query.page || 1;
            const { tags } = await IndexService.readTags();
            const { categories } = await IndexService.readCategories();
            const { posts, postsNumber } = await IndexService.readCategoryPosts(postPerPage, page, 'latest');
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            const pagesNumber = Math.ceil(postsNumber / postPerPage);

            res.render('blog/index', {
                tags,
                posts,
                categories,
                importantPosts,
                currentPage: page,
                pageTitle: 'MoNey-NetWork - Blog',
                prevPage: page > 0 ? Number(page) - 1 : undefined,
                nextPage: page < pagesNumber ? Number(page) + 1 : undefined
            });
        } catch (error) { next(error) };
    };

    static async postSearch(req, res, next) {
        try {
            const { search } = req.body;
            const page = req.params.page || 1;
            const { tags } = await IndexService.readTags();
            const { categories } = await IndexService.readCategories();
            const { posts, postsNumber } = await IndexService.searchInPosts(postPerPage, page, search);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            const pagesNumber = Math.ceil(postsNumber / postPerPage);

            res.render('blog/index', {
                tags,
                posts,
                categories,
                importantPosts,
                currentPage: page,
                pageTitle: 'MoNey-NetWork - Blog',
                prevPage: page > 0 ? Number(page) - 1 : undefined,
                nextPage: page < pagesNumber ? Number(page) + 1 : undefined
            });
        } catch (error) { next(error) };
    };

    static async getLogin(req, res, next) {
        try {
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags();
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('login', {
                tags,
                messages,
                categories,
                errorMessages,
                importantPosts,
                pageTitle: 'MoNey-NetWork - Login'
            });
        } catch (error) { next(error) };
    };

    static async getLogout (req, res, next) {
        try {
            req.logout();
            res.redirect('/');
        } catch (error) { next(error) };
    };

    static async postPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            
            await IndexService.sendRecoveryPasswordLink(email);

            req.flash('messages', ['ایمیلتو چک کن. برات یه ایمیل فرستادیم']);
            res.redirect('/login');
        } catch (error) { next(error) };
    };

    static async getPasswordResetToken(req, res, next) {
        try {
            const { token } = req.params;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags();
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('password-reset', {
                tags,
                token,
                messages,
                categories,
                errorMessages,
                importantPosts,
                pageTitle: 'MoNey-NetWork - Password reset'
            });
        } catch (error) { next(error) };
    };

    static async putPasswordResetToken(req, res, next) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            await IndexService.updatePassword(token, password);

            req.flash('messages', ['رمزتو عوض کردیم. خوش باشی']);
            res.redirect('/login');
        } catch (error) { next(error) };
    };

    static async getRegister(req, res, next) {
        try {
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags();
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('register', {
                tags,
                messages,
                categories,
                errorMessages,
                importantPosts,
                pageTitle: 'MoNey-NetWork - Registration'
            });
        } catch (error) { next(error) };
    };

    static async postRegister(req, res, next) {
        try {
            const avatar = req.files ? req.files.avatar : null;
            const { fullname, email, password, phone } = req.body;

            await IndexService.createUser(fullname, email, password, avatar, phone);
            await IndexService.sendEmailActivation(email);

            req.flash('messages', 'اکانتت ساحته رفت. الان وقتشه که ایمیلتو تائید کنی');
            res.redirect('/login');
        } catch (error) { next(error) };
    };

    static async postContactUs(req, res, next) {
        try {
            const { fullname, email, subject, message } = req.body;

            await IndexService.createTicket(fullname, email, subject, message);

            req.flash('messages', 'تیکت ارسال شد');
            res.redirect('/contact-us');
        } catch (error) { next(error) };
    };
};

module.exports = IndexController;