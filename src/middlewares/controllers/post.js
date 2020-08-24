const IndexService = require('../../services/index');
const PostService = require('../../services/post');
const { postPerPage } = require('../../config');

class PostController {
    static async getPost(req, res, next) {
        try {
            const { slug } = req.params;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags();
            const errorMessages = req.flash('errorMessages');
            const { post } = await PostService.readPost(slug, true);
            const { categories } = await IndexService.readCategories();
            const { post: nextPost } = await PostService.nextPost(post.createdAt);
            const { post: prevPost } = await PostService.prevPost(post.createdAt);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('blog/post', {
                post,
                tags,
                messages,
                nextPost,
                prevPost,
                categories,
                errorMessages,
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
            const { posts } = await IndexService.readCategoryPosts(postPerPage, page, title);
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
            const { posts, postsNumber } = await PostService.readUserPosts(postPerPage, page, id);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            const pagesNumber = Math.ceil(postsNumber / postPerPage);

            res.render('blog/index', {
                tags,
                posts,
                categories,
                importantPosts,
                currentPage: page,
                pageTitle: `Money-Network - User posts`,
                prevPage: page > 0 ? Number(page) - 1 : undefined,
                nextPage: page < pagesNumber ? Number(page) + 1 : undefined
            });
        } catch (error) { next(error) };
    };

    static async getTagPosts(req, res, next) {
        try {
            const { title } = req.params;
            const page = req.params.page || 1;
            const { tags } = await IndexService.readTags();
            const { categories } = await IndexService.readCategories();
            const { posts } = await PostService.readTagPosts(postPerPage, page, title);
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