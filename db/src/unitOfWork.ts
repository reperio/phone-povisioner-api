import {BaseUnitOfWork} from 'reperio-db-starter';
import {ConfigurationRepository} from "./repositories/configurationRepository";
import {OrganizationRepository} from "./repositories/organizationRepository";
import {LoggerInstance} from 'winston';
import {knex} from './connect';
import {DeviceRepository} from "./repositories/deviceRepository";

export class UnitOfWork extends BaseUnitOfWork {
    configurationRepository: ConfigurationRepository;
    organizationRepository: OrganizationRepository;
    deviceRepository: DeviceRepository;

    constructor(logger: LoggerInstance) {
        super(logger, knex);

        this.configurationRepository = new ConfigurationRepository(this);
        this.organizationRepository = new OrganizationRepository(this);
        this.deviceRepository = new DeviceRepository(this);
    }
}