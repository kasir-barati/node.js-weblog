const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    port: process.env.PORT,
    host: process.env.HOST,
    dbHost: process.env.PGHOST,
    dbPort: process.env.PGPORT,
    dbName: process.env.PGDATABASE,
    dbUser: process.env.PGUSER,
    dbPassword: process.env.PGPASSWORD,
    gmailUsername: process.env.GMAIL_USERNAME,
    gmailPassword: process.env.GMAIL_PASSWORD,
    passwordHashSalt: process.env.PASSWORD_HASH_SALT,
    coockieSecret: process.env.COOCKIE_SECRET,
    postPerPage: process.env.POST_PER_PAGE,
    github: {
        clientID: '2cf93f04de8d942100e7',
        clientSecret: '4702fd19f720cfe7f2f16e6fbd82f2f24c956372',
        callbackURL: `${process.env.HOST}:${process.env.PORT}/auth/github/callback`
    },
    google: {
        clientID: '820578166073-cki0s5u5ar5drtbdst2a7abpnkvvasbt.apps.googleusercontent.com',
        clientSecret: 'hWs-rNjFJI9MqiFRUVlUyirY',
        callbackURL: `${process.env.HOST}:${process.env.PORT}/auth/google/callback`
    },
    baseUrl: `http://${process.env.HOST}:${process.env.PORT}`
};