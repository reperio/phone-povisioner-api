import {UnitOfWork} from '../../db';
import axios from 'axios';
import {Logger, transports} from 'winston';
import 'winston-daily-rotate-file';

const logger = new Logger({
    transports: [
        new transports.Console({
            prepend: true,
            level: 'debug',
            humanReadableUnhandledException: true,
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new transports.DailyRotateFile({
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

async function fetchOrganizations() : Promise<any[]> {
    logger.info('Renewing API auth');
    await axios.put('https://crossbar.reper.io/v2/user_auth', {
        credentials: process.env.CREDENTIALS,
        account_name: process.env.ACCOUNT_NAME
    });

    logger.info('Fetching new organizations');
    const descendants = await axios.get(`https://crossbar.reper.io/v2/accounts/${process.env.account_id}/descendants`);
    return descendants.data;
}

async function syncOrganizations() : Promise<void> {
    const uow = new UnitOfWork(logger);

    const organizations = await fetchOrganizations();

    logger.info('Adding new organizations to the database');
    let queries: Promise<any>[] = [];
    organizations.forEach( (org: any) => {
        queries.push(uow.organizationRepository.addOrganization(org.id, org.name));
    });
    await Promise.all(queries);

    logger.info('Finished syncing organizations');
    process.exit();
}

syncOrganizations();