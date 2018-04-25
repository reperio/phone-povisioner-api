import {UnitOfWork} from '../unitOfWork';
import {Manufacturer} from "../models/manufacturer";
import {Family} from "../models/family";
import {PhoneModel} from "../models/phoneModel";
import {Config} from "../models/config";
import {Organization} from "../models/organization";
import {raw, transaction} from 'objection';

export class OrganizationRepository {
    uow: UnitOfWork;

    constructor(uow: UnitOfWork) {
        this.uow = uow;
    }

    async getOrganizations() {
        try {
            const organizations = await Organization
                .query(this.uow.transaction);
            return organizations;
        } catch (err) {
            this.uow.logger.error('Failed to fetch organizations from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async addOrganization(id: string, name: string) {
        try {
            //Add all configs from the default config
            const defaultConfigs = await Config
                .query(this.uow.transaction)
                .where('o.is_global_organization', true)
                .join('organizations as o', 'o.id', 'configs.organization');

            //TODO: have these two queries in a single transaction
            //await this.uow.beginTransaction();
            //Add organization row
            await Organization
                .query(this.uow.transaction)
                .insert({id, name, is_global_organization: false});
            await Config
                .query(this.uow.transaction)
                .insert(defaultConfigs.map((c:Config) => ({
                    organization: id,
                    manufacturer: c.manufacturer,
                    family: c.family,
                    model: c.model,
                    properties: '{}'
                })))
                .returning('organization');
            //await this.uow.commitTransaction();
        } catch (err) {
            this.uow.logger.error('Failed to add organization');
            this.uow.logger.error(err);
            throw err;
        }
    }
}