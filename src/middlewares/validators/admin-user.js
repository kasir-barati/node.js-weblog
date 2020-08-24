const bcrypt = require('bcrypt');

const UserModel = require("../../models/user");
const Validator = require('../../services/validator');

class AdminUserValidator {
    static async postCreateUser(req, res, next) {
        try {
            const errorMessages = [];
            const avatar = req.files ? req.files.avatar : null;
            const { email, fullname, password, confirmPassword, phone } = req.body;

            if (!email || !fullname || !password || !confirmPassword || !phone || !avatar) {
                errorMessages.push('همه‌ی فیلدا رو باس پر کنی')
            } else {
                if (!Validator.isEmail(email)) {
                    errorMessages.push('ایمیلی که وارد کردی درس نی')
                } else if (await UserModel.findOne({ where: { email } })) {
                    errorMessages.push(`این ایمیل قبلا ثبت شده`);
                };
                password !== confirmPassword ? errorMessages.push('رمز عبور وارد شده با تکرارش یکی نی') : '';
                !Validator.isAlphanumeric(fullname) ? errorMessages.push('اسم کاربر فقط عدد یا حروف باید باشه') : '';
                if (!Validator.isPhone(phone)) {
                    errorMessages.push('شماره تلفنت مجاز نی');
                } else if (await UserModel.findOne({ where: { phone } })) {
                    errorMessages.push('شماره تلفن قبلا ثبت شدس');
                };
                !Validator.isPassword(password) ? errorMessages.push('رمز عبور باس شامل حرف و عدد باشه و حدقل طولش ۸ کاراکتره') : '';
                if (avatar) {
                    !Validator.isPicture(avatar.name) ? errorMessages.push('یه عکس بده که فرمتش jpg، png یا jpeg باشه.') : '';
                };
            };

            if (errorMessages.length > 0) {
                req.flash('user', req.body);
                req.flash('errorMessages', errorMessages);
                res.redirect('/admin/users/create');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async checkUserId(req, res, next) {
        try {
            const { id } = req.params;
            const errorMessages = [];

            !await UserModel.findByPk(id) ? errorMessages.push('همچین کاربری نداشتیمو') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async putUser(req, res, next) {
        try {
            const errorMessages = [];
            const { id } = req.params;
            const user = await UserModel.findByPk(id);
            const { email, fullname, phone } = req.body;
            const avatar = req.files ? req.files.avatar : null;

            if (!email || !fullname || !phone) {
                errorMessages.push('همه‌ی فیلدا رو باس پر کنی')
            } else {
                if (!Validator.isEmail(email)) {
                    errorMessages.push('ایمیلی که وارد کردی درس نی')
                } else if (user.email !== email) {
                    await UserModel.findOne({ where: { email } }) ? errorMessages.push(`این ایمیل قبلا ثبت شده`) : '';
                };
                if (avatar) {
                    !Validator.isPicture(avatar.name) ? errorMessages.push('یه عکس بده که فرمتش jpg، png یا jpeg باشه.') : '';
                };
                !Validator.isAlphanumeric(fullname) ? errorMessages.push('اسم کاربر فقط عدد یا حروف باید باشه') : '';
                !Validator.isPhone(phone) ? errorMessages.push('شماره تلفنت مجاز نی') : '';
            };

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect(`/admin/users/edit/${id}`);
            } else {
                next();
            };
        } catch (error) { next(error) };
    };

    static async putPasswordReset(req, res, next) {
        try {
            const { oldPassword, newPassword, confirmNewPassword } = req.body;
            const user = await UserModel.findByPk(req.user.id);
            
            if (await bcrypt.compare(oldPassword, user.password)) {
                newPassword !== confirmNewPassword ? errorMessages.push('رمز عبور وارد شده با تکرارش یکی نی') : '';
            };
            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else {
                next();
            };
        } catch (error) { next(error) };
    };
};

module.exports = AdminUserValidator;