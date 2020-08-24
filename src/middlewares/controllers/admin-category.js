const IndexService = require('../../services/index');
const AdminCategoryService = require('../../services/admin-category');

class AdminCategoryController {
    static async getCategories(req, res, next) {
        try {
            const { id } = req.user;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags(id);
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories(id);
            const { categories: allCategories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            // fetch latest relative comments
            
            res.render('admin/category/index', {
                tags,
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

    static async getCreateCategory(req, res, next) {
        try {
            const category = req.flash('category');
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags();
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('admin/category/create', {
                tags,
                category,
                messages,
                categories,
                errorMessages,
                importantPosts,
                user: req.user,
                pageTitle: `Money-Network - Create your category`
            });
        } catch (error) { next(error) };
    };

    static async postCreateCategory(req, res, next) {
        try {
            const { title, description } = req.body;
            
            await AdminCategoryService.createCategory(title, description);

            req.flash('messages', ['دسته بندی ساخته رف']);
            res.redirect('/admin/categories');
        } catch (error) { next(error) };
    };

    static async getEditCategory(req, res, next) {
        try {
            const { title } = req.params;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags();
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories();
            const { category } = await AdminCategoryService.readCategory(title);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('admin/category/edit', {
                tags,
                messages,
                category,
                categories,
                errorMessages,
                importantPosts,
                user: req.user,
                pageTitle: `Money-Network - Your category`
            });
        } catch (error) { next(error) };
    };

    static async putCategory(req, res, next) {
        try {
            const { title: oldTitle } = req.params;
            const { title, description } = req.body;

            const { category } = await AdminCategoryService.readCategory(oldTitle);
            await AdminCategoryService.editCategory(category.id, title, description);

            req.flash('messages', ['دسته بندی ویرایش شد']);
            res.redirect('/admin/categories');
        } catch (error) { next(error) };
    };

    // delete post
    static async deleteCategory(req, res, next) {
        try {
            const { title } = req.params;
            const { category } = await AdminCategoryService.readCategory(title);

            await AdminCategoryService.deleteCategory(category.id);

            req.flash('messages', ['دسته بندی حذف شذ']);
            res.redirect('/admin/categories');
        } catch (error) { next(error) };
    };
};

module.exports = AdminCategoryController;