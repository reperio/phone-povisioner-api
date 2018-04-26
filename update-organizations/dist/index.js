"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const winston_1 = require("winston");
require("winston-daily-rotate-file");
async function fetchOrganizations() {
    return [{ id: '1', name: 'Test' }, { id: '2', name: 'Test3' }];
}
async function syncOrganizations() {
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
                filename: `./logs/app.log`,
                datePattern: 'yyyy-MM-dd.',
                createTree: true,
                prepend: true,
                level: 'debug',
                humanReadableUnhandledException: true,
                handleExceptions: true,
                json: true
            })
        ]
    });
    const uow = new db_1.UnitOfWork(logger);
    logger.info('Fetching new organizations');
    const organizations = await fetchOrganizations();
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