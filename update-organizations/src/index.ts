import {UnitOfWork} from '../../db';
import axios from 'axios';
import {Logger, transports} from 'winston';
import 'winston-daily-rotate-file';

async function fetchOrganizations() : Promise<any[]> {
    return [{id: '1', name: 'Test'}, {id: '2', name: 'Test3'}];
}

async function syncOrganizations() : Promise<void> {
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
    const uow = new UnitOfWork(logger);

    logger.info('Fetching new organizations');
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