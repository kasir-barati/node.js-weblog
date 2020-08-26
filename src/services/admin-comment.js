const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const marked = require('marked');

const dompurify = createDomPurify(new JSDOM().window);

const CommentModel = require('../models/comment');
const UserModel = require('../models/user');
const PostModel = require('../models/post');

class AdminCategoryService {
    /**
     * create comment
     * @param {UUID} id user id that write this comment
     * @param {string} markedContent comment content
     * @param {UUID} commentId reply to which comment
     * @param {UUID} postId post id
     */
    static async createComment(id, markedContent, commentId, postId) {
        try {
            return await CommentModel.create({
                markedContent, 'commentId': commentId ? commentId : null, postId, 'userId': id
            });
        } catch (error) { throw error };
    };

    /**
     * remove comment record from database
     * @param {UUID} id comment id
     */
    static async deleteComment(id) {
        try {
            const comment = await CommentModel.findByPk(id);

            return await comment.destroy();
        } catch (error) { throw error };
    };
    
    /**
     * update comment
     * @param {UUID} id comment id
     * @param {string} markedContent comment content
     */
    static async editComment(id, markedContent) {
        try {
            const comment = await CommentModel.findByPk(id);

            comment.markedContent = markedContent;
            comment.sanitizedContent = dompurify.sanitize(marked(markedContent));
            return await comment.save();
        } catch (error) { throw error };
    };

    /**
     * read comment
     * @param {UUID} id comment id
     * @return {Object} comment
     */
    static async readComment(id) {
        try {
            const comment = await CommentModel.findByPk(id, {
                include: [
                    { model: PostModel },
                    { model: UserModel, attributes: ['email', 'id'] }
                ]
            });

            return { comment };
        } catch (error) { throw error };
    };

    /**
     * 
     * @param {number} limit comment limitaion
     * @param {number} page page number
     * @param {UUID} userId user id
     */
    static async readUserComments(limit, page, userId) {
        try {
            const comments = await CommentModel.findAll({
                where: { adminSeened: false },
                limit,
                offset: (page - 1) * limit,
                order: [['createdAt', 'DESC']],
                include: [
                    { model: UserModel, where: { id: userId } },
                    { model: PostModel }
                ]
            });

            return { comments };
        } catch (error) { throw error };
    };
};

module.exports = AdminCategoryService;
