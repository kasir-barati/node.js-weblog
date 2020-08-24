const CommentService = require('../../services/comment');

class PostController {
    static async getCreatePost (req, res, next) {
        try {
            const { tags } = await IndexService.readTags();
            const { categories } = await IndexService.readCategories();
            
            res.render('blog/create-post', {
                tags,
                categories,
                pageTitle: 'Money-Network - create post'
            });
        } catch (error) { next(error) };
    };

    static async postCreatePost (req, res, next) {
        try {
            const { id } = req.session.user;
            const { title, content, description, thumbnail, baner, isPublished , categories, tags } = req.body;
        } catch (error) { next(error) };
    };

    static async getPost(req, res, next) {
        try {
            const { id } = req.params;
            const { tags } = await IndexService.readTags();
            const { post } = await CommentService.readPost(id);
            const { categories } = await IndexService.readCategories();
            const { post: nextPost } = await CommentService.nextPost(post.createdAt);
            const { post: prevPost } = await CommentService.prevPost(post.createdAt);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('blog/post', {
                post,
                tags,
                nextPost,
                prevPost,
                categories,
                importantPosts,
                pageTitle: 'Money-Network - Read post'
            });
        } catch (error) { next(error) };
    };

    static async getCategoryPosts(req, res, next) {
        try {
            const { title } = req.params;
            const page = req.params.page || 1;
            const { tags } = await IndexService.readTags();
            const { categories } = await IndexService.readCategories();
            const { posts } = await IndexService.readCategoryPosts(5, page, title);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('blog/index', {
                tags,
                posts,
                categories,
                importantPosts,
                pageTitle: `Money-Network - ${title} Category`
            })
        } catch (error) { next(error) };
    };

    static async getUserPosts(req, res, next) {
        try {
            const { id } = req.params;
            const page = req.params.page || 1;
            const { tags } = await IndexService.readTags();
            const { categories } = await IndexService.readCategories();
            const { posts } = await CommentService.readUserPosts(5, page, id);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('blog/index', {
                tags,
                posts,
                categories,
                importantPosts,
                pageTitle: `Money-Network - User posts`
            });
        } catch (error) { next(error) };
    };

    static async getTagPosts(req, res, next) {
        try {
            const { title } = req.params;
            const page = req.params.page || 1;
            const { tags } = await IndexService.readTags();
            const { categories } = await IndexService.readCategories();
            const { posts } = await CommentService.readTagPosts(5, page, title);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('blog/index', {
                tags,
                posts,
                categories,
                importantPosts,
                pageTitle: `Money-Network - ${title} Category`
            })
        } catch (error) { next(error) };
    };
};

module.exports = PostController;