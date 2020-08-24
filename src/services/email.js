const path = require('path');
const { promises: fs } = require('fs');

const nodemailer = require('nodemailer');

const { gmailPassword, gmailUsername } = require('../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailUsername,
        pass: gmailPassword
    }
});

class EmailService {
    /**
     * Sending email
     * @param {string} to Destination email
     * @param {string} subject Email title
     * @param {string} text Email content
     */
    static sendMail(to, subject, html) {
        try {
            return new Promise((resolve, reject) => {
                transporter.sendMail({
                    from: gmailUsername,
                    to,
                    subject,
                    html
                }, (error, info) => {
                    if (error) reject(error);
                    else resolve(info);
                });
            });
        } catch (error) {
            throw error;
        };
    };

    /**
     * Email activation content
     * @param {string} token Email activation token
     * @return {string} emailContent
     */
    static async emailActivationContent(token) {
        let emailContent = await fs.readFile(path.join(__dirname, '..', '..', 'public', 'html', 'email-activation.html'));

        emailContent = emailContent.toString();
        emailContent = emailContent.replace(/passwordResetToken/g, token);

        return { emailContent };
    };

    /**
     * Password reset content
     * @param {string} token New password
     */
    static async passwordResetContent(token) {
        let emailContent = await fs.readFile(path.join(__dirname, '..', '..', 'public', 'html', 'password-reset.html'));

        emailContent = emailContent.toString();
        emailContent = emailContent.replace(/token/g, token);

        return { emailContent };
    };

    static async oauthWelcomeEmailContent(password) {
        let emailContent = await fs.readFile(path.join(__dirname, '..', '..', 'public', 'html', 'oauth-welcome.html'));

        emailContent = emailContent.toString();
        emailContent = emailContent.replace(/password/g, token);

        return { emailContent };
    }
};

module.exports = EmailService;