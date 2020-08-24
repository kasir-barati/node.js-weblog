const bcrypt = require('bcrypt');

const IndexService = require('../../services/index');
const AdminUserService = require('../../services/admin-user');
const { passwordHashSalt } = require('../../config');

class AdminUserController {
    static async getUsers(req, res, next) {
        try {
            const { id } = req.user;
            const messages = req.flash('messages');
            const { tags } = await IndexService.readTags(id);
            const errorMessages = req.flash('errorMessages');
            const { users } = await IndexService.readUsers();
            const { categories } = await IndexService.readCategories(id);
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');
            // fetch latest relative comments
            
            res.render('admin/user/index', {
                tags,
                users,
                messages,
                categories,
                errorMessages,
                importantPosts,
                user: req.user,
                pageTitle: `Money-Network - Users`
            });
        } catch (error) { next(error) };
    };

    static async getCreateUser(req, res, next) {
        try {
            // const user = req.flash('user')[0] ? req.flash('user')[0] : { email: '', fullname: '', phone: '' };
            const user = { email: '', fullname: '', phone: '' };
            const messages = req.flash('messages');
            const errorMessages = req.flash('errorMessages');
            const { userRoles } = await IndexService.readUserRoles();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('admin/user/create', {
                user,
                messages,
                userRoles,
                errorMessages,
                importantPosts,
                pageTitle: `Money-Network - Create your user`
            });
        } catch (error) { next(error) };
    };

    static async postCreateUser(req, res, next) {
        try {
            const avatar = req.files ? req.files.avatar : null;
            const { email, fullname, password, phone, userRoleId } = req.body;
            
            await IndexService.createUser(fullname, email, password, avatar, phone, userRoleId);
            await IndexService.sendEmailActivation(email);

            req.flash('messages', ['کاربر ساخته رف. حالا ایمیلتو تائید باس بکنی']);
            res.redirect('/admin/users');
        } catch (error) { next(error) };
    };

    static async getEditUser(req, res, next) {
        try {
            const { id } = req.params;
            const messages = req.flash('messages');
            const errorMessages = req.flash('errorMessages');
            const { user } = await AdminUserService.readUser(id);
            const { userRoles } = await IndexService.readUserRoles();
            const { posts: importantPosts } = await IndexService.readCategoryPosts(3, 1, 'important');

            res.render('admin/user/edit', {
                user,
                messages,
                userRoles,
                errorMessages,
                importantPosts,
                user: req.user,
                pageTitle: `Money-Network - User informations`
            });
        } catch (error) { next(error) };
    };

    static async putUser(req, res, next) {
        try {
            const { id } = req.params;
            const avatar = req.files ? req.files.avatar : null;
            const { email, fullname, phone } = req.body;

            await AdminUserService.editUser(id, email, fullname, phone, avatar);

            req.flash('messages', ['اطلاعات کاربرو ویرایش شد']);
            res.redirect('/admin/users');
        } catch (error) { next(error) };
    };

    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;

            await AdminUserService.deleteUser(id);
            if (res.locals.isAdmin) {
                req.flash('messages', ['حذف شد']);
                res.redirect('/admin/users');
            } else {
                req.flash('messages', ['حذف شد']);
                res.redirect('/logout');
            };
            return;
        } catch (error) { next(error) };
    };

    static async putPasswordReset(req, res, next) {
        try {
            const { newPassword } = req.body;
            const user = await UserModel.findByPk(req.user.id);
            const salt = await bcrypt.genSalt(passwordHashSalt);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            
            user.password = hashedPassword;
            return await user.save();
        } catch (error) { next(error) };
    };
};

module.exports = AdminUserController;