const bcrypt = require("bcrypt");

const UserModel = require("../../models/user");
const Validator = require("../../services/validator");

class PostValidator {
    static async postEmailVerification(req, res, next) {
        try {
            const errorMessages = [];
            const { email } = req.body;
            const user = await UserModel.findOne({ where: { email } });
            
            if (!user) {
                errorMessages.push('همچین ایمیلی نداریم یا اشتب تایپیدی');
            } else if (user.emailVerified) {
                errorMessages.push('این ایمیله قبلا تائید شده');
            };

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect(`/login`);
            } else { next() };
        } catch (error) { next(error) };
    };

    static async getEmailVerification(req, res, next) {
        try {
            const { token } = req.params;
            const errorMessages = [];

            !await UserModel.findOne({ where: { token } }) ? errorMessages.push('همچین توکنی نداریم یا منقضی شده') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect(`/login`);
            } else { next() };
        } catch (error) { next(error) };
    };

    static async putPasswordResetToken(req, res, next) {
        try {
            const { password, confirmPassword } = req.body;
            const { token } = req.params;
            const errorMessages = [];
            const user = await UserModel.findOne({ where: { token } });
            
            if (!user) {
                errorMessages.push('همچین توکنی تولید نکرده بودم یا تاریخ انقضاش گذشته');
            } else if (!user.emailVerified) {
                errorMessages.push('اول باس ایمیلتو تائید بکنی بعد رمزتو عوض کنی');
            };
            password !== confirmPassword ? errorMessages.push('رمز عبورت با تکرارش یکی نی') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect(`/password-reset/${token}`);
            } else { next() };
        } catch (error) { next(error) };
    };

    static async getPasswordResetToken(req, res, next) {
        try {
            const { token } = req.params;
            const errorMessages = [];
            const user = await UserModel.findOne({ where: { token } });

            if (!user) {
                errorMessages.push('همچین توکنی تولید نکرده بودم یا تاریخ انقضاش گذشته');
            } else if (!user.emailVerified) {
                errorMessages.push('اول باس ایمیلتو تائید بکنی بعد رمزتو عوض کنی');
            };

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('/login');
            } else { next() };
        } catch (error) { next(error) };
    };

    static async postLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            const errorMessages = [];

            if (Validator.isEmail(email)) {
                const user = await UserModel.findOne({ where: { email } });

                if (!user) {
                    errorMessages.push('رمز عبورت یا ایمیلت اشتبه');
                } else {
                    !await bcrypt.compare(password, user.password) ? errorMessages.push('رمز عبورت یا ایمیلت اشتبه') : '';;
                }
            } else {
                errorMessages.push('ایمیلت مثله یه ایمیل نی');
            };

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('/login');
            } else { next() };
        } catch (error) { next(error) };
    };

    static async postPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            const errorMessages = [];
            const user = await UserModel.findOne({ where: { email } });
            
            if (!user) { 
                errorMessages.push('همچین ایمیلی ثبت نکردیمو');
            } else if (!user.emailVerified) {
                errorMessages.push('قبل لاگین یا هر کار دیگه ای باس ایمیلتو تائید کنی');
            };

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('/register');
            } else { next() };
        } catch (error) { next(error) };
    };

    static async postRegister(req, res, next) {
        try {
            const avatar = req.files ? req.files.avatar : null;
            const { fullname, email, password, confirmPassword, phone } = req.body;
            const errorMessages = [];

            password !== confirmPassword ? errorMessages.push('رمز عبورت با تکرارش یکی نی') : '';
            if (Validator.isEmail(email)) {
                const user = await UserModel.findOne({ where: { email } });
                if (user && user.isDeleted === false) {
                    !Validator.isPhone(phone) ? errorMessages.push('شماره تلفنت درست نیس.') : '';
                    errorMessages.push('این ایمیل قبلا ثبت شده یه ایمیل جدید بده');
                }
            } else {
                errorMessages.push('این ایمیلی که تایپیدی مجاز نی، یه ایمیل جدید بده');
            };
            !Validator.isAlphanumeric(fullname) ? errorMessages.push('یه اسم که نمیتونه کاراکترای خاص توش باشه.') : '';
            !Validator.isPicture(avatar.name) ? errorMessages.push('یه عکس بده که فرمتش jpg، png یا jpeg باشه.') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else { next() };
        } catch (error) { next(error) };
    };

    static async postContactUs(req, res, next) {
        try {
            const errorMessages = [];
            const { fullname, email, subject, message } = req.body;
            
            !Validator.isAlphanumeric(fullname) ? errorMessages.push('اسمی که وارد کردی مجاز نیس') : '';
            !Validator.isAlphanumeric(subject) ? errorMessages.push('عنوانی که وارد کردی مجاز نیس') : '';
            !Validator.isEmail(email) ? errorMessages.push('ایمیلی که وارد کردی مجاز نیس') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else { next() };
        } catch (error) { next(error) };
    };
};

module.exports = PostValidator;