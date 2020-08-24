const Validator = require("../../services/validator");
const TicketModel = require('../../models/ticket');

class AdminContactUsValidator {
    static async postResponse(req, res, next) {
        try {
            const errorMessages = [];
            const { id } = req.params;
            const {  userEmail, adminEmail, subject, message } = req.body;

            if (await TicketModel.findByPk(id)) {
                !Validator.isEmail(userEmail) ? errorMessages.push('ایمیل کاربر مجاز نی') : '';
                !Validator.isEmail(adminEmail) ? errorMessages.push('ایمیل ادمین مجاز نی') : '';
                !Validator.isAlphanumeric(subject) ? errorMessages.push('عنوان انتخاب شده مجاز نی') : '';
                !Validator.isAlphanumeric(message) ? errorMessages.push('پیغوم وارد شده مجاز نی') : '';
            } else {
                errorMessages.push('همچین تیکتی نداشتیمو');
            };

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else { next() };
        } catch (error) { next(error) };
    };

    static async checkContactUsId(req, res, next) {
        try {
            const errorMessages = [];
            const { id } = req.params;

            !await TicketModel.findByPk(id) ? errorMessages.push('همچین تیکتی نداشتیمو') : '';

            if (errorMessages.length > 0) {
                req.flash('errorMessages', errorMessages);
                res.redirect('back');
            } else { next() };
        } catch (error) { next(error) };
    };
};

module.exports = AdminContactUsValidator;