const crypto = require('crypto');
const path = require('path');

const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const marked = require('marked');
const dompurify = createDomPurify(new JSDOM().window);
const { Sequelize, Op } = require('sequelize');
const bcrypt = require('bcrypt');

const { baseUrl, passwordHashSalt } = require('../config');
const PostViewModel = require('../models/post-view');
const UserRoleModel = require('../models/user-role');
const CategoryModel = require('../models/category');
const CommentModel = require('../models/comment');
const TicketModel = require('../models/ticket');
const PostModel = require('../models/post');
const UserModel = require('../models/user');
const TagModel = require('../models/tag');
const EmailService = require('./email');

class IndexService {
    /**
     * read all users with access level
     * @param {Number[]} accessLevel user access level
     */
    static async readUsers(accessLevel) {
        try {
            let users
            if (accessLevel) {
                users = await UserModel.findAll({
                    include: {
                        model: UserRoleModel,
                        where: {
                            accessLevel
                        }
                    }
                });
            } else {
                users = await UserModel.findAll({
                    include: [{ model: UserRoleModel }]
                });
            };

            return { users };
        } catch (error) { throw error };
    };

    /**
     * update user password
     * @param {string} token generated token
     * @param {string} password entered password
     */
    static async updatePassword(token, password) {
        try {
            const user = await UserModel.findOne({ where: { token } });
            const salt = await bcrypt.genSalt(Number(passwordHashSalt));
            const hashedPassword = await bcrypt.hash(password, salt);

            user.password = hashedPassword;
            user.token = null;
            await user.save();
            return;
        } catch (error) { throw error };
    };

    static async sendRecoveryPasswordLink(email) {
        try {
            const user = await UserModel.findOne({ where: { email } });
            const token = crypto.randomBytes(10).toString('hex');
            // const emailContent = await EmailService.passwordResetContent(token);

            user.token = token;
            await user.save();
            // EmailService.sendMail(email, 'MoNey-NetWork - password recovery', emailContent);
            return;
        } catch (error) { throw error };
    };

    /**
     * send an email contains a link to activate user account
     * @param {string} email user email
     */
    static async sendEmailActivation(email) {
        try {
            const token = crypto.randomBytes(10).toString('hex');
            const user = await UserModel.findOne({ where: { email } });
            // const emailContent = await EmailService.emailActivationContent(token);

            user.token = token;
            await user.save();
            // return await EmailService.sendMail(email, 'MoNey-NetWork - Account activation', emailContent);
        } catch (error) { throw error };
    };

    /**
     * active user account
     * @param {string} token generated token
     */
    static async activateUserAccount(token) {
        try {
            const user = await UserModel.findOne({ where: { token } });

            user.emailVerified = true;
            user.token = null;
            return await user.save();
        } catch (error) { throw error };
    };

    /**
     * read posts
     * @param {Number} limit how many post should returned
     * @param {Number} page nuumber
     * @param {String} categoryTitle posts should have this categoryTitle
     * @return {Object[]} posts
     */
    static async readCategoryPosts(limit, page, categoryTitle) {
        try {
            let posts, postsNumber;

            if (categoryTitle !== 'latest') {
                posts = await PostModel.findAll({
                    group: ['posts.id'],
                    where: { isPublished: true },
                    limit,
                    offset: (page - 1) * limit,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: CategoryModel,
                            attributes: ['title'],
                            where: { title: categoryTitle }
                        },
                        { model: CommentModel },
                        { model: PostViewModel },
                        { model: UserModel, attributes: ['fullname', 'id'] }
                    ],
                    attributes: [
                        'id', 'slug', 'title', 'sanitizedContent', 'description', 'thumbnail', 'baner', 'createdAt', 'updatedAt',
                        [Sequelize.fn('COUNT', 'comment.id'), 'commentsCounter'],
                        [Sequelize.fn('COUNT', 'post_views.id'), 'viewsCounter'],
                    ]
                });
            } else {
                posts = await PostModel.findAll({
                    group: ['posts.id'],
                    where: { isPublished: true },
                    limit,
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
            if (limit !== 3, page !== 1) {
                postsNumber = await PostModel.count({ where: { isPublished: true } });
            } else {
                postsNumber = 3;
            };

            return { posts, postsNumber };
        } catch (error) { throw error };
    };

    /**
     * read all categories
     * @param {string?} id user id
     * @return {Object[]} categories
     */
    static async readCategories(id = null) {
        try {
            let categories
            if (id) {
                categories = await CategoryModel.findAll({
                    group: ["categories.id"],
                    includeIgnoreAttributes: false,
                    include: [
                        {
                            model: PostModel,
                            include: [
                                {
                                    model: UserModel,
                                    where: { id }
                                }
                            ]
                        }
                    ],
                    attributes: [
                        'id',
                        'title',
                        [Sequelize.fn("COUNT", Sequelize.col("posts.id")), "postNumber"]
                    ]
                });
            } else {
                categories = await CategoryModel.findAll({
                    group: ["categories.id"],
                    includeIgnoreAttributes: false,
                    include: [
                        {
                            model: PostModel,
                            attributes: ['id']
                        }
                    ],
                    attributes: [
                        'id', 'title', 'description', 'createdAt', 'updatedAt',
                        [Sequelize.fn("COUNT", Sequelize.col("posts.id")), "postNumber"]
                    ]
                });
            }

            return { categories };
        } catch (error) { throw error };
    };

    /**
     * read all tags
     * @param {string?} id user id
     * @return {object[]} tags
     */
    static async readTags(id = null) {
        try {
            let tags;

            if (id) {
                tags = await TagModel.findAll({
                    group: ["tags.id"],
                    includeIgnoreAttributes: false,
                    include: [
                        {
                            model: PostModel,
                            include: [
                                {
                                    model: UserModel,
                                    where: { id }
                                }
                            ]
                        }
                    ],
                    attributes: [
                        'id', 'title', 'description', 'createdAt', 'updatedAt',
                        [Sequelize.fn("COUNT", Sequelize.col("posts.id")), "postNumber"]
                    ]
                });
            } else {
                tags = await TagModel.findAll({
                    group: ["tags.id"],
                    includeIgnoreAttributes: false,
                    include: [{ model: PostModel }],
                    attributes: [
                        'id', 'title', 'description', 'createdAt', 'updatedAt',
                        [Sequelize.fn("COUNT", Sequelize.col("posts.id")), "postNumber"]
                    ]
                });
            };

            return { tags };
        } catch (error) { throw error };
    };

    /**
     * read all posts & count them
     * @param {UUID} id post id
     */
    static async readComments(id) {
        try {
            const comments = await CommentModel.findAndCountAll({
                where: { postId: id }
            });

            return { comments };
        } catch (error) { throw error };
    };

    /**
     * read posts
     * @param {Number} limit how many post should returned
     * @param {Number} page nuumber
     * @param {String} search
     * @return {Object[]} posts
     */
    static async searchInPosts(limit, page, search) {
        try {
            const posts = await PostModel.findAll({
                group: ['posts.id'],
                limit,
                where: {
                    sanitizedContent: { [Op.substring]: search },
                    isPublished: true
                },
                offset: (page - 1) * limit,
                order: [['createdAt', 'DESC']],
                include: [
                    { model: CategoryModel, attributes: ['title'] },
                    { model: CommentModel },
                    { model: PostViewModel },
                    { model: UserModel, attributes: ['fullname', 'id'] }
                ],
                attributes: [
                    'id', 'title', 'sanitizedContent', 'description', 'thumbnail', 'baner', 'createdAt', 'updatedAt',
                    [Sequelize.fn('COUNT', 'comment.id'), 'commentsCounter'],
                    [Sequelize.fn('COUNT', 'post_views.id'), 'viewsCounter'],
                ]
            });
            const postsNumber = await PostModel.count({
                where: {
                    sanitizedContent: { [Op.substring]: search },
                    isPublished: true
                }
            });

            return { posts, postsNumber };
        } catch (error) { throw error };
    };

    /**
     * @return all defined roles
     */
    static async readUserRoles() {
        try {
            const userRoles = await UserRoleModel.findAll();

            return { userRoles };
        } catch (error) { throw error };
    };

    /**
     * create user
     * @param {string} fullname user fullname
     * @param {string} email user email
     * @param {string} password user password
     * @param {url} avatar user avatar
     * @param {string} phone user phone
     */
    static async createUser(fullname, email, password, avatar, phone, userRoleId) {
        try {
            const avatarFilename = `${Math.ceil(Math.random() * 1000)}${avatar.name}`;
            let user = await UserModel.findOne({ where: { email } });

            await avatar.mv(path.join(__dirname, '..', '..', 'public', 'img', 'avatars', avatarFilename));
            if (!userRoleId) {
                userRoleId = (await UserRoleModel.findOne({
                    where: { accessLevel: 1 }
                })).id;
            };
            if (!user) {
                user = await UserModel.create({
                    email,
                    userRoleId,
                    avatar: `${baseUrl}/img/avatars/${avatarFilename}`,
                    password,
                    fullname,
                    phone,
                    isDeleted: false
                });
            } else {
                const salt = await bcrypt.genSalt(Number(passwordHashSalt));
                const hashedPassword = await bcrypt.hash(password, salt);

                user.userRoleId = userRoleId;
                user.avatar = `${baseUrl}/img/avatars/${avatarFilename}`,
                user.password = hashedPassword;
                user.fullname = fullname;
                user.phone = phone;
                user.isDeleted = false;
                await user.save();
            };
            return;
        } catch (error) { throw error };
    };

    static async createTicket(fullname, email, subject, message) {
        try {
            message = dompurify.sanitize(marked(message));
            return await TicketModel.create({ fullname, email, subject, message });
        } catch (error) { throw error };
    };
};

module.exports = IndexService;