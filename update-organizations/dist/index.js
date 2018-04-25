"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const winston_1 = require("winston");
async function fetchOrganizations() {
    return [{ id: '1', name: 'Test' }, { id: '2', name: 'Test2' }];
}
async function syncOrganizations() {
    const logger = new winston_1.Logger();
    const uow = new db_1.UnitOfWork(logger);
    logger.info('Fetching new organizations');
    const organizations = await fetchOrganizations();
    logger.info('Adding new organizations to the database');
    organizations.forEach((org) => {
        uow.organizationRepository.addOrganization(org.id, org.name);
    });
}
syncOrganizations();
//# sourceMappingURL=index.js.map