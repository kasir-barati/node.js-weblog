const TagModel = require('../models/tag');
const { Op, Sequelize } = require('sequelize');
const CommentModel = require('../models/comment');
const UserModel = require('../models/user');
const CommentModel = require('../models/comment');
const CategoryModel = require('../models/category');

class CommentService {
    /**
     * read comment
     * @param {UUID} id comment id
     * @return {Object} comment
     */
    static async readComment(id) {
        try {
            const Comment = await CommentModel.findOne({
                where: { 
                    id,
                    isPublished: true 
                },
                include: [
                    { model: CategoryModel, attributes: ['title'] },
                    { model: TagModel },
                    { model: CommentModel, include: { model: UserModel } },
                    { model: CommentViewModel },
                    { model: UserModel, attributes: ['fullname', 'id', 'avatar'] }
                ],
            });

            return { Comment };
        } catch (error) { throw error };
    };

    /**
     * return next Comment
     * @param {Date} createdAt date time
     */
    static async nextComment(createdAt) {
        try {
            const Comment = await CommentModel.findOne({
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

            return { Comment }
        } catch (error) { throw error };
    };

    /**
     * return previuos Comment
     * @param {Date} createdAt date time
     */
    static async prevComment(createdAt) {
        try {
            const Comment = await CommentModel.findOne({
                where: { createdAt: {
                    [Op.lt]: createdAt,
                    isPublished: true
                }},
                attributes: [
                    'id', 'title'
                ]
            });

            return { Comment }
        } catch (error) { throw error };
    };

    /**
     * read all tag's Comments
     * @param {number} limit how many Comment
     * @param {number} page which page
     * @param {string} tagTitle tag title
     */
    static async readTagComments(limit, page, tagTitle) {
        try {
            let Comments;

            if (tagTitle !== 'latest') {
                Comments = await CommentModel.findAll({
                    group: ['Comments.id'],
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
                        { model: CommentViewModel },
                        { 
                            model: TagModel ,
                            attributes: ['id'],
                            where: { title: tagTitle }
                        },
                        { model: UserModel, attributes: ['fullname', 'id'] }
                    ],
                    attributes: [
                        'id', 'title', 'content', 'description', 'thumbnail', 'baner', 'createdAt', 'updatedAt',
                        [Sequelize.fn('COUNT', 'comment.id'), 'commentsCounter'],
                        [Sequelize.fn('COUNT', 'Comment_views.id'), 'viewsCounter'],
                    ]
                });
            } else {
                Comments = await CommentModel.findAll({
                    group: ['Comments.id'],
                    limit,
                    where: { isPublished: true },
                    offset: (page - 1) * limit,
                    order: [['createdAt', 'DESC']],
                    include: [
                        { model: CategoryModel, attributes: ['title'] },
                        { model: CommentModel },
                        { model: CommentViewModel },
                        { model: UserModel, attributes: ['fullname', 'id'] }
                    ],
                    attributes: [
                        'id', 'title', 'content', 'description', 'thumbnail', 'baner', 'createdAt', 'updatedAt',
                        [Sequelize.fn('COUNT', 'comment.id'), 'commentsCounter'],
                        [Sequelize.fn('COUNT', 'Comment_views.id'), 'viewsCounter'],
                    ]
                });
            };

            return { Comments };
        } catch (error) { throw error };
    };

    /**
     * read all users's Comments
     * @param {number} limit how many Comment
     * @param {number} page which page
     * @param {UUID} userId user id
     */
    static async readUserComments(limit, page, userId) {
        try {
            const Comments = await CommentModel.findAll({
                group: ['Comments.id', 'user.id'],
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
                    { model: CommentViewModel },
                    { 
                        model: TagModel ,
                        attributes: ['id'],
                    },
                    { 
                        model: UserModel,
                        where: { id: userId }
                    }
                ],
                attributes: [
                    'id', 'title', 'content', 'description', 'thumbnail', 'baner', 'createdAt', 'updatedAt',
                    [Sequelize.fn('COUNT', 'comment.id'), 'commentsCounter'],
                    [Sequelize.fn('COUNT', 'Comment_views.id'), 'viewsCounter'],
                ]
            });

            return { Comments };
        } catch (error) { throw error };
    };
};

module.exports = CommentService;