import {UnitOfWork} from '../unitOfWork';
import {Manufacturer} from "../models/manufacturer";
import {Family} from "../models/family";
import {PhoneModel} from "../models/phoneModel";
import {Config} from "../models/config";
import {Organization} from "../models/organization";
import {raw, transaction} from 'objection';

export class ConfigurationRepository {
    uow: UnitOfWork;

    constructor(uow: UnitOfWork) {
        this.uow = uow;
    }

    async getManufacturers(organization: string) {
        try {
            const manufacturers = await Manufacturer
                .query(this.uow.transaction)
                .select('c.properties as config', 'manufacturers.*', 'default_conf.properties as default_config')
                .innerJoin('configs as c', function() {
                    this.on('manufacturers.id', 'c.manufacturer')
                        .andOn(raw('c.organization = ?', organization));
                }).innerJoin('configs as default_conf', function() {
                    this.on('manufacturers.id', 'default_conf.manufacturer')
                        .andOn(raw('(SELECT is_global_organization from organizations where id = default_conf.organization) = TRUE'));
                }).orderBy('name', 'ASC');
            return manufacturers;
        } catch (err) {
            this.uow.logger.error('Failed to fetch manufacturers from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getFamilies(manufacturer: string, organization: string) {
        try {
            const families = await Family
                .query(this.uow.transaction)
                .select('c.properties as config', 'families.*', 'default_conf.properties as default_config')
                .where('families.manufacturer', manufacturer)
                .innerJoin('configs as c', function() {
                    this.on('families.id', 'c.family')
                        .andOn(raw('c.organization = ?', organization));
                }).innerJoin('configs as default_conf', function() {
                    this.on('families.id', 'default_conf.family')
                        .andOn(raw('(SELECT is_global_organization from organizations where id = default_conf.organization) = TRUE'));
                }).orderBy('name', 'ASC');
            return families;
        } catch (err) {
            this.uow.logger.error('Failed to fetch families from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getModels(family: string, organization: string) {
        try {
            const models = await PhoneModel
                .query(this.uow.transaction)
                .select('c.properties as config', 'models.*', 'default_conf.properties as default_config')
                .where('models.family', family)
                .innerJoin('configs as c', function() {
                    this.on('models.id', 'c.model')
                        .andOn(raw('c.organization = ?', organization));
                }).innerJoin('configs as default_conf', function() {
                    this.on('models.id', 'default_conf.model')
                        .andOn(raw('(SELECT is_global_organization from organizations where id = default_conf.organization) = TRUE'));
                }).orderBy('name', 'ASC');
            return models;
        } catch (err) {
            this.uow.logger.error('Failed to fetch families from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async setManufacturerConfig(manufacturer: string, config: any, organization: string) {
        try {
            const updatedObj = await Config
                .query(this.uow.transaction)
                .update({properties: JSON.stringify(config)})
                .where('manufacturer', manufacturer)
                .andWhere('organization', organization);
            return updatedObj;
        } catch (err) {
            this.uow.logger.error('Failed to set config of manufacturer');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async setFamilyConfig(family: string, config: any, organization: string) {
        try {
            const updatedObj = await Config
                .query(this.uow.transaction)
                .update({properties: JSON.stringify(config)})
                .where('family', family)
                .andWhere('organization', organization);
            return updatedObj;
        } catch (err) {
            this.uow.logger.error('Failed to set config of family');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async setModelConfig(model: string, config: any, organization: string) {
        try {
            const updatedObj = await Config
                .query(this.uow.transaction)
                .update({properties: JSON.stringify(config)})
                .where('model', model)
                .andWhere('organization', organization);
            return updatedObj;
        } catch (err) {
            this.uow.logger.error('Failed to set config of model');
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