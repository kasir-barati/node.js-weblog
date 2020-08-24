const UserRoleModel = require("../../models/user-role");

class Auth {
    static async isAdmin(req, res, next) {
        try {
            const errorMessages = [];

            if (!req.user) {
                errorMessages.push('لاگین نکردیو');
            } else {
                const { userRoleId } = req.user;
                const userRole = await UserRoleModel.findByPk(userRoleId);

                if (!userRole) {
                    errorMessages.push('همچی سطح دسترسی تعریف نشدس');
                } else if (userRole.accessLevel < 3) {
                    errorMessages.push('تو اجازه‌ی دسترسی به این بخشو نداری');
                };
            };

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('/login');
            } else {                
                next();
            };
        } catch (error) { next(error) };
    };

    static async isLoggedIn(req, res, next) {
        try {
            const errorMessages = [];

            if (req.user) {
                if (req.originalUrl.match(/(email-verification)|(password-reset)|(login)|(register)|(\/auth\/github)|(\/auth\/github\/callback)|(\/auth\/google)|(\/auth\/google\/callback)/)) {
                    res.redirect('/');
                } else {
                    next();
                };
            } else {
                if (req.originalUrl.match(/(email-verification)|(password-reset)|(login)|(register)|(\/auth\/github)|(\/auth\/github\/callback)|(\/auth\/google)|(\/auth\/google\/callback)/)) {
                    next();
                } else {
                    errorMessages.push('لاگین نکردیو');
                    req.flash('errorMessages', errorMessages);
                    res.redirect('/login');
                };
            };
        } catch (error) { next(error) };
    };
};

module.exports = Auth;