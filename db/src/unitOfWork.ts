import {BaseUnitOfWork} from 'db-starter';
import {ConfigurationRepository} from "./repositories/configurationRepository";
import {Winston} from 'winston';
import {knex} from './connect';

export class UnitOfWork extends BaseUnitOfWork {
    configurationRepository: ConfigurationRepository;

    constructor(logger: Winston) {
        super(logger, knex);

        this.configurationRepository = new ConfigurationRepository(this);
    }
}