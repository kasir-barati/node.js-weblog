const CommentModel = require('../models/comment');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const marked = require('marked');
const dompurify = createDomPurify(new JSDOM().window);

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
};

module.exports = AdminCategoryService;