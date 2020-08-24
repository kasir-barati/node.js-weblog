const CategoryModel = require('../models/category');

class AdminCategoryService {
    /**
     * create category
     * @param {string} title category title
     * @param {string} description category description
     */
    static async createCategory(title, description) {
        try {
            return await CategoryModel.create({ title, description });
        } catch (error) { throw error };
    };

    /**
     * read category by title
     * @param {string} title category title
     * @retun category id
     */
    static async readCategory(title) {
        try {
            const category = await CategoryModel.findOne({ where: { title } });

            return { category };
        } catch (error) { throw error };
    };

    /**
     * remove category record from database
     * @param {UUID} id category id
     */
    static async deleteCategory(id) {
        try {
            const category = await CategoryModel.findByPk(id);

            await category.destroy();

            return;
        } catch (error) { throw error };
    };
    
    /**
     * update category
     * @param {UUID} id category ID
     * @param {string} newTitle new title
     * @param {string} description category description
     */
    static async editCategory(id, newTitle, description) {
        try {
            const category = await CategoryModel.findByPk(id);

            category.title = newTitle;
            category.description = description;
            return await category.save();
        } catch (error) { throw error };
    };
};

module.exports = AdminCategoryService;