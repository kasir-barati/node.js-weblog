const { Op, Sequelize } = require('sequelize');

const TagModel = require('../models/tag');
const PostModel = require('../models/post');
const UserModel = require('../models/user');
const CommentModel = require('../models/comment');
const CategoryModel = require('../models/category');
const PostViewModel = require('../models/post-view');

class PostService {
    /**
     * read post
     * @param {string} slug post slug
     * @param {boolean?} isPublished post is published
     * @return {Object} post
     */
    static async readPost(slug, isPublished) {
        try {
            let post;
            
            // another way: hierarchical and recursive query
            if (isPublished !== undefined) {
                post = await PostModel.findOne({
                    where: { slug, isPublished },
                    include: [
                        { model: CommentModel },
                        { model: CategoryModel, attributes: ['title'] },
                        { model: TagModel },
                        { model: CommentModel, include: { model: UserModel } },
                        { model: PostViewModel },
                        { model: UserModel, attributes: ['fullname', 'id', 'avatar'] }
                    ],
                });
            } else {
                post = await PostModel.findOne({
                    where: { slug },
                    include: [
                        { model: CommentModel },
                        { model: CategoryModel, attributes: ['title'] },
                        { model: TagModel },
                        { model: CommentModel, include: { model: UserModel } },
                        { model: PostViewModel },
                        { model: UserModel, attributes: ['fullname', 'id', 'avatar'] }
                    ],
                });
            };

            return { post };
        } catch (error) { throw error };
    };

    /**
     * return next post
     * @param {Date} createdAt date time
     */
    static async nextPost(createdAt) {
        try {
            const post = await PostModel.findOne({
                where: {
                    createdAt: {
                        [Op.gt]: createdAt
                    },
                    isPublished: true
                },
                attributes: [
                    'id', 'title'
                ]
            });

            return { post }
        } catch (error) { throw error };
    };

    /**
     * return previuos post
     * @param {Date} createdAt date time
     */
    static async prevPost(createdAt) {
        try {
            const post = await PostModel.findOne({
                where: {
                    createdAt: {
                        [Op.lt]: createdAt,
                        isPublished: true
                    }
                },
                attributes: [
                    'id', 'title'
                ]
            });

            return { post }
        } catch (error) { throw error };
    };

    /**
     * read all tag's posts
     * @param {number} limit how many post
     * @param {number} page which page
     * @param {string} tagTitle tag title
     */
    static async readTagPosts(limit, page, tagTitle) {
        try {
            let posts;

            if (tagTitle !== 'latest') {
                posts = await PostModel.findAll({
                    group: ['posts.id'],
                    where: { isPublished: true },
                    limit,
                    offset: (page - 1) * limit,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: CategoryModel,
                            attributes: ['title']
                        },
                        { model: CommentModel },
                        { model: PostViewModel },
                        {
                            model: TagModel,
                            attributes: ['id'],
                            where: { title: tagTitle }
                        },
                        { model: UserModel, attributes: ['fullname', 'id'] }
                    ],
                    attributes: [
                        'id', 'title', 'slug', 'sanitizedContent', 'description', 'thumbnail', 'baner', 'createdAt', 'updatedAt',
                        [Sequelize.fn('COUNT', 'comment.id'), 'commentsCounter'],
                        [Sequelize.fn('COUNT', 'post_views.id'), 'viewsCounter'],
                    ]
                });
            } else {
                posts = await PostModel.findAll({
                    group: ['posts.id'],
                    limit,
                    where: { isPublished: true },
                    offset: (page - 1) * limit,
                    order: [['createdAt', 'DESC']],
                    include: [
                        { model: CategoryModel, attributes: ['title'] },
                        { model: CommentModel },
                        { model: PostViewModel },
                        { model: UserModel, attributes: ['fullname', 'id'] }
                    ],
                    attributes: [
                        'id', 'title', 'slug', 'sanitizedContent', 'description', 'thumbnail', 'baner', 'createdAt', 'updatedAt',
                        [Sequelize.fn('COUNT', 'comment.id'), 'commentsCounter'],
                        [Sequelize.fn('COUNT', 'post_views.id'), 'viewsCounter'],
                    ]
                });
            };

            return { posts };
        } catch (error) { throw error };
    };

    /**
     * read all users's posts
     * @param {number} limit how many post
     * @param {number} page which page
     * @param {UUID} id user id
     */
    static async readUserPosts(limit, page, id) {
        try {
            const posts = await PostModel.findAll({
                group: ['posts.id', 'user.id'],
                where: { isPublished: true },
                limit,
                offset: (page - 1) * limit,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: CategoryModel,
                        attributes: ['title']
                    },
                    { model: CommentModel },
                    { model: PostViewModel },
                    {
                        model: TagModel,
                        attributes: ['id'],
                    },
                    {
                        model: UserModel,
                        where: { id }
                    }
                ],
                attributes: [
                    'id', 'title', 'slug', 'sanitizedContent', 'description', 'thumbnail', 'baner', 'createdAt', 'updatedAt',
                    [Sequelize.fn('COUNT', 'comment.id'), 'commentsCounter'],
                    [Sequelize.fn('COUNT', 'post_views.id'), 'viewsCounter'],
                ]
            });
            const postsNumber = await PostModel.count({
                group: ['posts.id', 'user.id'],
                include: [
                    {
                        model: UserModel,
                        where: { id }
                    }
                ]
            });

            return { posts, postsNumber };
        } catch (error) { throw error };
    };
};

module.exports = PostService;