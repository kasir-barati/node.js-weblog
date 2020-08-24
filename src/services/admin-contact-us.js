const TicketModel = require('../models/ticket');
const EmailService = require('./email');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const marked = require('marked');
const dompurify = createDomPurify(new JSDOM().window);

class AdminContactUsService {
    static async readContactUs() {
        try {
            const tickets = await TicketModel.findAll({ 
                where: { status: false }
            });

            return { tickets };
        } catch (error) { throw error };
    };

    /**
     * send response to the userEmail
     * @param {UUID} id ticket id
     * @param {string} userEmail user email
     * @param {string} adminEmail admin email
     * @param {string} subject email subject
     * @param {string} message email content
     */
    static async createTicket(id, userEmail, adminEmail, subject, message) {
        try {
            const ticket = await TicketModel.findByPk(id);

            message = `${adminEmail} <br><br> ${message}`;
            const emailContent = dompurify.sanitize(marked(message));
            await EmailService.sendMail(userEmail, subject, emailContent);
            ticket.status = true;

            return await ticket.save();
        } catch (error) { throw error };
    };

    /**
     * delete ticket
     * @param {UUID} id ticket id
     */
    static async deleteContactUs(id) {
        try {
            const ticket = await TicketModel.findByPk(id);
            return await ticket.destroy();
        } catch (error) { throw error };
    };
};

module.exports = AdminContactUsService;