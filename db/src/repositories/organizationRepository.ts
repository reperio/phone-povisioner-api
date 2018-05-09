import {UnitOfWork} from '../unitOfWork';
import {Config} from "../models/config";
import {Organization} from "../models/organization";

export class OrganizationRepository {
    uow: UnitOfWork;

    constructor(uow: UnitOfWork) {
        this.uow = uow;
    }

    async getOrganizations() {
        try {
            const organizations = await Organization
                .query(this.uow.transaction)
                .where('enabled', true);
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
            //TODO: could this be made into a subquery?
            const defaultConfigs = await Config
                .query(this.uow.transaction)
                .where('o.is_global_organization', true)
                .join('organizations as o', 'o.id', 'configs.organization');

            //ON CONFLICT is not supported in Objection, so we have to use raw queries
            //Add organization row
            await this.uow.transaction.raw(`
                insert into "organizations"
                    ("enabled", "id", "is_global_organization", "name")
                    values (true, ?, false, ?)
                on conflict ("id") do update
                    set "name" = ?, enabled = true where "organizations"."id" = ?
                returning "id"
            `, [id, name, name, id]);

            //Adds the config options for the organization
            let values = '(?, ?, ?, ?, ?), '.repeat(defaultConfigs.length);
            values = values.substring(0, values.length - 2);
            let parameters: any[] = [];
            defaultConfigs.forEach((c: Config) => {
                parameters.push(id);
                parameters.push(c.manufacturer);
                parameters.push(c.family);
                parameters.push(c.model);
                parameters.push('{}');
            });
            await this.uow.transaction.raw(`
                insert into "configs" ("organization", "manufacturer", "family", "model", "properties")
                    values ${values}
                on conflict do nothing
                returning "organization";
            `, parameters);
        } catch (err) {
            this.uow.logger.error('Failed to add organization');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async disableOldOrganizations(ids: string[]) {
        try {
            const organizations = await Organization
                .query(this.uow.transaction)
                .update({enabled: false})
                .whereIn('id', ids)
                .andWhere('is_global_organization', false);
            return organizations;
        } catch (err) {
            this.uow.logger.error('Failed to disable organizations');
            this.uow.logger.error(err);
            throw err;
        }
    }
}