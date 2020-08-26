const IndexService = require('../../services/index');
const AdminTagService = require('../../services/admin-tag');

class AdminTagController {
    static async getTags(req, res, next) {
        try {
            const { id } = req.user;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags(id);
            const errorMessages = req.flash('errorMessages');
            const { tags: allTags } = await IndexService.readTags();
            const { categories } = await IndexService.readCategories(id);
            const { comments } = await AdminCommentService.readUserComments(5, id);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            
            res.render('admin/tag/index', {
                tags,
                allTags,
                messages,
                comments,
                categories,
                errorMessages,
                importantPosts,
                user: req.user,
                pageTitle: `Money-Network - Tags`
            });
        } catch (error) { next(error) };
    };

    static async getCreateTag(req, res, next) {
        try {
            const tag = req.flash('tag');
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags();
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('admin/tag/create', {
                tag,
                tags,
                messages,
                categories,
                errorMessages,
                importantPosts,
                user: req.user,
                pageTitle: `Money-Network - Create your tag`
            });
        } catch (error) { next(error) };
    };

    static async postCreateTag(req, res, next) {
        try {
            const { title, description } = req.body;
            
            await AdminTagService.createTag(title, description);

            req.flash('messages', ['تگ ساخته رف']);
            res.redirect('/admin/tags');
        } catch (error) { next(error) };
    };

    static async getEditTag(req, res, next) {
        try {
            const { title } = req.params;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags();
            const errorMessages = req.flash('errorMessages');
            const { tag } = await AdminTagService.readTag(title);
            const { categories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('admin/tag/edit', {
                tag,
                tags,
                messages,
                categories,
                errorMessages,
                importantPosts,
                user: req.user,
                pageTitle: `Money-Network - Your tag`
            });
        } catch (error) { next(error) };
    };

    static async putTag(req, res, next) {
        try {
            const { title: oldTitle } = req.params;
            const { title, description } = req.body;

            const { tag } = await AdminTagService.readTag(oldTitle);
            await AdminTagService.editTag(tag.id, title, description);

            req.flash('messages', ['تگ ویرایش شد']);
            res.redirect('/admin/tags');
        } catch (error) { next(error) };
    };

    // delete post
    static async deleteTag(req, res, next) {
        try {
            const { title } = req.params;
            const { tag } = await AdminTagService.readTag(title);

            await AdminTagService.deleteTag(tag.id);

            req.flash('messages', ['تگ حذف شذ']);
            res.redirect('/admin/tags');
        } catch (error) { next(error) };
    };
};

module.exports = AdminTagController;
