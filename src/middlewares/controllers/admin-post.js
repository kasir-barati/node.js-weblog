const IndexService = require('../../services/index');
const AdminPostService = require('../../services/admin-post');
const PostService = require('../../services/post');
const { postPerPage } = require('../../config');

class AdminPostController {
    static async getPosts(req, res, next) {
        try {
            const { id } = req.user;
            const page = req.params.page || 1;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags(id);
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories(id);
            const { posts, postsNumber } = await AdminPostService.readUserPosts(postPerPage, page, id);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            const pagesNumber = Math.ceil(postsNumber / postPerPage);
            // fetch comments: answers to your comment, comments below your post

            res.render('admin/post/index', {
                tags,
                posts,
                messages,
                categories,
                errorMessages,
                importantPosts,
                user: req.user,
                currentPage: page,
                pageTitle: `Money-Network - User posts`,
                prevPage: page > 0 ? Number(page) - 1 : undefined,
                nextPage: page < pagesNumber ? Number(page) + 1 : undefined
            });
        } catch (error) { next(error) };
    };

    static async getCreatePost(req, res, next) {
        try {
            const post = req.flash('post');
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags();
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('admin/post/create', {
                tags,
                post,
                messages,
                categories,
                errorMessages,
                importantPosts,
                user: req.user,
                pageTitle: `Money-Network - Create your post`
            });
        } catch (error) { next(error) };
    };

    static async createPost(req, res, next) {
        try {
            const { id } = req.user;
            const { thumbnail, baner } = req.files;
            let { title, markedContent, description, isPublished, categories, tags } = req.body;
            categories = categories.split('-').map(category => category.trim())
            tags = tags.split('-').map(tag => tag.trim())
            await AdminPostService.createPost(id, title, description, markedContent, thumbnail, baner, isPublished === 'checked' ? true : false, categories, tags);

            req.flash('messages', ['پست ساخته رف']);
            res.redirect('/admin/posts');
        } catch (error) { next(error) };
    };

    // return user's post with the given category title
    static async getCategoryPosts(req, res, next) {
        try {
            const { id } = req.user;
            const { title } = req.params;
            const page = req.params.page || 1;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags(id);
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories(id);
            const { posts, postsNumber } = await AdminPostService.readCategoryUserPosts(postPerPage, page, title, id);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            const pagesNumber = Math.ceil(postsNumber / postPerPage);

            res.render('admin/post/index', {
                tags,
                posts,
                messages,
                categories,
                errorMessages,
                user: req.user,
                importantPosts,
                currentPage: page,
                pageTitle: `Money-Network - ${title} tag posts`,
                prevPage: page > 0 ? Number(page) - 1 : undefined,
                nextPage: page < pagesNumber ? Number(page) + 1 : undefined
            })
        } catch (error) { next(error) };
    };

    // return user's post with the given tag title
    static async getTagPosts(req, res, next) {
        try {
            const { id } = req.user;
            const { title } = req.params;
            const page = req.params.page || 1;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags(id);
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories(id);
            const { posts, postsNumber } = await AdminPostService.readTagUserPosts(postPerPage, page, title, id);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            const pagesNumber = Math.ceil(postsNumber / postPerPage);

            res.render('admin/post/index', {
                tags,
                posts,
                messages,
                categories,
                errorMessages,
                user: req.user,
                importantPosts,
                currentPage: page,
                pageTitle: `Money-Network - ${title} tag posts`,
                prevPage: page > 0 ? Number(page) - 1 : undefined,
                nextPage: page < pagesNumber ? Number(page) + 1 : undefined
            })
        } catch (error) { next(error) };
    };

    static async getEditPost(req, res, next) {
        try {
            const { slug } = req.params;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags();
            const { post } = await PostService.readPost(slug);
            const errorMessages = req.flash('errorMessages');
            const { categories } = await IndexService.readCategories();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('admin/post/edit', {
                tags,
                post,
                messages,
                categories,
                errorMessages,
                importantPosts,
                user: req.user,
                pageTitle: `Money-Network - Your post`
            });
        } catch (error) { next(error) };
    };

    static async putEditPost(req, res, next) {
        try {
            const { slug } = req.params;
            const baner = req.files ? req.files.baner : null;
            const { id } = await AdminPostService.findPostId(slug);
            const thumbnail = req.files ? req.files.thumbnail : null;
            let { title, markedContent, description, isPublished, categories, tags } = req.body;

            categories = categories.split('-').filter(category => {
                category = category.trim();
                if (category) return category;
            });
            tags = tags.split('-').filter(tag => {
                tag = tag.trim();
                if (tag) return tag;
            });
            await AdminPostService.editPost(id, title, description, markedContent.trim(), thumbnail, baner, isPublished ? true : false, categories, tags);

            req.flash('messages', ['پست ویرایش شد']);
            res.redirect('/admin/posts');
        } catch (error) { next(error) };
    };

    // delete post
    static async deletePost(req, res, next) {
        try {
            const { slug } = req.params;
            const { id } = await AdminPostService.findPostId(slug);

            await AdminPostService.deletePost(id);

            req.flash('messages', ['پست حذف شذ']);
            res.redirect('/admin/posts');
        } catch (error) { next(error) };
    };
};

module.exports = AdminPostController;