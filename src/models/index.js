const Sequelize = require('sequelize');

const { dbName, dbUser, dbPassword, dbHost, dbPort } = require('../config');
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    dialect: 'postgres',
    host: dbHost,
    port: dbPort,
    pool: {
        max: 9,
        min: 0,
        idle: 10000
    },
    logging: false
});

module.exports = { sequelize, sync };

async function sync () {
    try {
        await sequelize.sync();
        // await sequelize.sync({ force: true }); await require('../services/insert-fake')();
        return true;
    } catch (error) {
        throw error;
    };
};