"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const axios_1 = require("axios");
const logger = new winston_1.Logger({
    transports: [
        new winston_1.transports.Console({
            prepend: true,
            level: 'debug',
            humanReadableUnhandledException: true,
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new winston_1.transports.DailyRotateFile({
            filename: `./logs/%DATE%.app.log`,
            createTree: true,
            prepend: true,
            level: 'debug',
            humanReadableUnhandledException: true,
            handleExceptions: true,
            json: true
        })
    ]
});
async function fetchOrganizations() {
    logger.info('Renewing API auth');
    const authResponse = await axios_1.default.put('https://crossbar.reper.io/v2/user_auth', {
        data: {
            credentials: process.env.CREDENTIALS,
            account_name: process.env.ACCOUNT_NAME
        }
    });
    logger.info('Fetching new organizations');
    const descendantsResponse = await axios_1.default.get(`https://crossbar.reper.io/v2/accounts/${process.env.ACCOUNT_ID}/descendants`, {
        headers: {
            'X-Auth-Token': authResponse.data.auth_token
        }
    });
    return descendantsResponse.data.data;
}
async function syncOrganizations() {
    const uow = new db_1.UnitOfWork(logger);
    const cachedOrganizations = await uow.organizationRepository.getOrganizations();
    const organizations = await fetchOrganizations();
    logger.info('Removing old organizations from the database');
    await uow.organizationRepository.disableOldOrganizations(cachedOrganizations
        .filter((org) => organizations.findIndex((o) => o.id == org.id) < 0)
        .map((org) => org.id));
    logger.info('Adding new organizations to the database');
    let queries = [];
    organizations.forEach((org) => {
        queries.push(uow.organizationRepository.addOrganization(org.id, org.name));
    });
    await Promise.all(queries);
    logger.info('Finished syncing organizations');
    process.exit();
}
syncOrganizations();
//# sourceMappingURL=index.js.map