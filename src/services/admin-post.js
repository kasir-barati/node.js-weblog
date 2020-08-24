const path = require('path');

const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const slugify = require('slugify');
const marked = require('marked');
const dompurify = createDomPurify(new JSDOM().window);
const { Sequelize } = require('sequelize');

const TagModel = require('../models/tag');
const PostModel = require('../models/post');
const UserModel = require('../models/user');
const CommentModel = require('../models/comment');
const CategoryModel = require('../models/category');
const PostViewModel = require('../models/post-view');
const { baseUrl } = require('../config');

class AdminPostService {
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
    /**
     * read post by slug
     * @param {string} slug post slug
     * @retun post id
     */
    static async findPostId(slug) {
        try {
            const post = await PostModel.findOne({
                where: { slug },
                attributes: ['id']
            });

            return { id: post.id };
        } catch (error) { throw error };
    }
    /**
     * create post
     * @param {UUID} id user id
     * @param {string} title post title
     * @param {string} description post description
     * @param {string} markedContent post markdown content
     * @param {url} thumbnail post thumbnail
     * @param {url} baner post baner
     * @param {boolean} isPublished publish post or not
     * @param {string[]} categories post categories
     * @param {string[]} tags post tags
     */
    static async createPost(id, title, description, markedContent, thumbnail, baner, isPublished, categories, tags) {
        try {
            let temp;
            const post = await PostModel.create({
                title,
                userId: id,
                description,
                markedContent,
                thumbnail: `${baseUrl}/img/thumbnails/${thumbnail.name}`,
                baner: `${baseUrl}/baners/${baner.name}`,
                isPublished
            });
            categories.forEach(async category => {
                temp = await CategoryModel.findOne({ where: { title: category } });
                temp.addPost(post);
            });
            tags.forEach(async tag => {
                temp = await TagModel.findOne({ where: { title: tag } });
                temp.addPost(post);
            });
            let filename = `${Math.ceil(Math.random() * 1000)}${thumbnail.name}`;
            await thumbnail.mv(path.join(__dirname, '..', '..', 'public', 'img', 'thumbnails', filename));
            filename = `${Math.ceil(Math.random() * 1000)}${baner.name}`;
            await baner.mv(path.join(__dirname, '..', '..', 'public', 'img', 'baners', filename));
        } catch (error) { throw error };
    };

    /**
     * update post
     * @param {UUID} id post id
     * @param {string} title post title
     * @param {string} description post description
     * @param {string} markedContent post markdown content
     * @param {url} thumbnail post thumbnail
     * @param {url} baner post baner
     * @param {boolean} isPublished publish post or not
     * @param {string[]} categories post categories
     * @param {string[]} tags post tags
     */
    static async editPost(id, title, description, markedContent, thumbnail, baner, isPublished, categories, tags) {
        try {
            let temp;
            const post = await PostModel.findByPk(id);

            post.title = title;
            post.description = description;
            post.isPublished = isPublished;
            post.markedContent = markedContent;
            post.sanitizedContent = dompurify.sanitize(marked(post.markedContent));
            post.slug = slugify(post.title, { lower: true, remove: /[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/]/gi });
            if (thumbnail) {
                const filename = `${Math.ceil(Math.random() * 1000)}${thumbnail.name}`;
                await thumbnail.mv(path.join(__dirname, '..', '..', 'public', 'img', 'thumbnails', filename));
                post.thumbnail = `${baseUrl}/img/thumbnails/${thumbnail}`;
            };
            if (baner) {
                const filename = `${Math.ceil(Math.random() * 1000)}${baner.name}`;
                await baner.mv(path.join(__dirname, '..', '..', 'public', 'img', 'baners', filename));
                post.baner = `${baseUrl}/img/baners/${baner}`;
            };
            await post.removeCategories();
            categories.forEach(async category => {
                temp = await CategoryModel.findOne({ where: { title: category.trim() } });
                temp.addPost(post);
            });
            await post.removeTags();
            tags.forEach(async tag => {
                temp = await TagModel.findOne({ where: { title: tag.trim() } });
                temp.addPost(post);
            });
            return await post.save();
        } catch (error) { throw error };
    };

    /**
     * read all user's posts with a specified category title
     * @param {number} limit post limi per page
     * @param {number} page page number
     * @param {string} title category tile
     * @param {UUID} id user id
     * @return {object[]} posts
     */
    static async readCategoryUserPosts(limit, page, title, id) {
        try {
            const posts = await PostModel.findAll({
                group: ['posts.id', 'user.id'],
                limit,
                offset: (page - 1) * limit,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: CategoryModel,
                        attributes: ['title'],
                        where: { title }
                    },
                    { model: CommentModel },
                    { model: PostViewModel },
                    {
                        model: TagModel,
                        attributes: ['id']
                    },
                    {
                        model: UserModel,
                        where: { id },
                        attributes: ['fullname', 'id']
                    }
                ],
                attributes: [
                    'id', 'title', 'sanitizedContent', 'description', 'thumbnail', 'baner', 'createdAt', 'updatedAt',
                    [Sequelize.fn('COUNT', 'comment.id'), 'commentsCounter'],
                    [Sequelize.fn('COUNT', 'post_views.id'), 'viewsCounter'],
                ]
            });
            const postsNumber = await PostModel.count({
                group: ['posts.id', 'user.id'],
                include: [
                    {
                        model: TagModel,
                        where: { title }
                    },
                    {
                        model: UserModel,
                        where: { id }
                    }
                ],
            })

            return { posts, postsNumber };
        } catch (error) { throw error };
    };

    /**
     * read all posts with post tag title and id
     * @param {number} limit post limitation per page
     * @param {number} page page number
     * @param {string} tagTitle tag title
     * @param {UUID} id user id (post owner)
     * @return {object[]} posts
     */
    static async readTagUserPosts(limit, page, title, id) {
        try {
            const posts = await PostModel.findAll({
                group: ['posts.id', 'user.id'],
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
                        where: { title }
                    },
                    {
                        model: UserModel,
                        where: { id },
                        attributes: ['fullname', 'id']
                    }
                ],
                attributes: [
                    'id', 'title', 'sanitizedContent', 'description', 'thumbnail', 'baner', 'createdAt', 'updatedAt',
                    [Sequelize.fn('COUNT', 'comment.id'), 'commentsCounter'],
                    [Sequelize.fn('COUNT', 'post_views.id'), 'viewsCounter'],
                ]
            });
            const postsNumber = await PostModel.count({
                group: ['posts.id', 'user.id'],
                include: [
                    {
                        model: TagModel,
                        where: { title }
                    },
                    {
                        model: UserModel,
                        where: { id }
                    }
                ],
            })

            return { posts, postsNumber };
        } catch (error) { throw error };
    };

    static async deletePost(id) {
        try {
            const post = await PostModel.findByPk(id);

            return await post.destroy();
        } catch (error) { throw error };
    };
};

module.exports = AdminPostService;