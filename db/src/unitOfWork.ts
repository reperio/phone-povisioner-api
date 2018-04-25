import {BaseUnitOfWork} from 'reperio-db-starter';
import {ConfigurationRepository} from "./repositories/configurationRepository";
import {OrganizationRepository} from "./repositories/organizationRepository";
import {LoggerInstance} from 'winston';
import {knex} from './connect';

export class UnitOfWork extends BaseUnitOfWork {
    configurationRepository: ConfigurationRepository;
    organizationRepository: OrganizationRepository;

    constructor(logger: LoggerInstance) {
        super(logger, knex);

        this.configurationRepository = new ConfigurationRepository(this);
        this.organizationRepository = new OrganizationRepository(this);
    }
}