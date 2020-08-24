const TagModel = require('../models/tag');

class AdminTagService {
    /**
     * create tag
     * @param {string} title tag title
     * @param {string} description tag description
     */
    static async createTag(title, description) {
        try {
            return await TagModel.create({ title, description });
        } catch (error) { throw error };
    };

    /**
     * read tag by title
     * @param {string} title tag title
     * @retun tag id
     */
    static async readTag(title) {
        try {
            const tag = await TagModel.findOne({ where: { title } });

            return { tag };
        } catch (error) { throw error };
    };

    /**
     * remove tag record from database
     * @param {UUID} id tag id
     */
    static async deleteTag(id) {
        try {
            const tag = await TagModel.findByPk(id);

            return await tag.destroy();
        } catch (error) { throw error };
    };

    /**
     * update tag
     * @param {UUID} id tag ID
     * @param {string} newTitle new title
     * @param {string} description tag description
     */
    static async editTag(id, newTitle, description) {
        try {
            const tag = await TagModel.findByPk(id);

            tag.title = newTitle;
            tag.description = description;
            return await tag.save();
        } catch (error) { throw error };
    };
};

module.exports = AdminTagService;