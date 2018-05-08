import {UnitOfWork} from '../../db';
import {Logger, transports} from 'winston';
import 'winston-daily-rotate-file';
import axios from 'axios';

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

async function fetchOrganizations() : Promise<any[]> {
    logger.info('Renewing API auth');
    const authResponse = await axios.put('https://crossbar.reper.io/v2/user_auth', {
        data: {
            credentials: process.env.CREDENTIALS,
            account_name: process.env.ACCOUNT_NAME
        }
    });

    logger.info('Fetching new organizations');
    const descendantsResponse = await axios.get(
        `https://crossbar.reper.io/v2/accounts/${process.env.ACCOUNT_ID}/descendants`,
        {
            headers: {
                'X-Auth-Token': authResponse.data.auth_token
            }
        }
    );
    return descendantsResponse.data.data;
}

async function syncOrganizations() : Promise<void> {
    const uow = new UnitOfWork(logger);

    const cachedOrganizations = await uow.organizationRepository.getOrganizations();
    const organizations = await fetchOrganizations();

    logger.info('Removing old organizations from the database');
    await uow.organizationRepository.disableOldOrganizations(
        cachedOrganizations
            .filter((org: any) => organizations.findIndex((o: any) => o.id == org.id) < 0)
            .map((org: any) => org.id)
    );

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