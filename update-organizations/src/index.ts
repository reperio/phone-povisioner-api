import {UnitOfWork} from '../../db';
import axios from 'axios';
import {Logger} from 'winston';

async function fetchOrganizations() : Promise<any[]> {
    return [{id: '1', name: 'Test'}, {id: '2', name: 'Test2'}];
}

async function syncOrganizations() : Promise<void> {
    const logger = new Logger();
    const uow = new UnitOfWork(logger);

    logger.info('Fetching new organizations');
    const organizations = await fetchOrganizations();

    logger.info('Adding new organizations to the database');
    organizations.forEach((org: any) => {
        uow.organizationRepository.addOrganization(org.id, org.name);
    });
}

syncOrganizations();