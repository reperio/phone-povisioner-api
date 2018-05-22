import {UnitOfWork} from '../unitOfWork';
import {Manufacturer} from "../models/manufacturer";
import {Family} from "../models/family";
import {PhoneModel} from "../models/phoneModel";
import {Config} from "../models/config";

export class ConfigurationRepository {
    uow: UnitOfWork;

    constructor(uow: UnitOfWork) {
        this.uow = uow;
    }

    async getManufacturers(organization: string) {
        const raw = this.uow.knex.raw;
        try {
            const manufacturers = await Manufacturer
                .query(this.uow.transaction)
                .select('c.properties as config', 'manufacturers.*', 'default_conf.properties as default_config')
                .innerJoin('configs as c', function() {
                    this.on('manufacturers.id', 'c.manufacturer')
                        .andOn(raw('c.organization = ?', organization));
                }).innerJoin('configs as default_conf', function() {
                    this.on('manufacturers.id', 'default_conf.manufacturer')
                        .andOn(raw("(SELECT type from organizations where id = default_conf.organization) = 'global'"));
                }).orderBy('name', 'ASC');
            return manufacturers;
        } catch (err) {
            this.uow.logger.error('Failed to fetch manufacturers from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getFamilies(manufacturer: string, organization: string) {
        const raw = this.uow.knex.raw;
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
                        .andOn(raw("(SELECT type from organizations where id = default_conf.organization) = 'global'"));
                }).orderBy('name', 'ASC');
            return families;
        } catch (err) {
            this.uow.logger.error('Failed to fetch families from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getModels(family: string, organization: string) {
        const raw = this.uow.knex.raw;
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
                        .andOn(raw("(SELECT type from organizations where id = default_conf.organization) = 'global'"));
                }).orderBy('name', 'ASC');
            return models;
        } catch (err) {
            this.uow.logger.error('Failed to fetch models from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getManufacturerInfo(manufacturer: string, organization: string) {
        try {
            const info = await Manufacturer
                .query(this.uow.transaction)
                .select('component_name as manufacturer_name')
                .where('id', manufacturer);
            return info[0];
        } catch (err) {
            this.uow.logger.error('Failed to fetch manufacturer info from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getFamilyInfo(family: string, organization: string) {
        try {
            const info = await Family
                .query(this.uow.transaction)
                .select('families.component_name as family_name', 'manufacturers.component_name as manufacturer_name')
                .where('families.id', family)
                .innerJoin('manufacturers', function() {
                    this.on('families.manufacturer', 'manufacturers.id');
                });
            return info[0];
        } catch (err) {
            this.uow.logger.error('Failed to fetch family info from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getModelInfo(model: string, organization: string) {
        try {
            const info = await Family
                .query(this.uow.transaction)
                .select('models.component_name as model_name', 'families.component_name as family_name', 'manufacturers.component_name as manufacturer_name')
                .where('models.id', model)
                .innerJoin('families', function() {
                    this.on('models.family', 'families.id');
                })
                .innerJoin('manufacturers', function() {
                    this.on('families.manufacturer', 'manufacturers.id');
                });
            return info[0];
        } catch (err) {
            this.uow.logger.error('Failed to fetch model info from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async setManufacturerConfig(manufacturer: string, config: string, organization: string) {
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

    async setFamilyConfig(family: string, config: string, organization: string) {
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

    async setModelConfig(model: string, config: string, organization: string) {
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

    async composeConfig(model: string, organization: string) {
        const raw = this.uow.knex.raw;
        try {
            const query: any = await PhoneModel
                .query(this.uow.transaction)
                .select(
                    'model_conf.properties as model_config',
                    'family_conf.properties as family_config',
                    'manufacturer_conf.properties as manufacturer_config'
                ).where('models.id', model)
                .innerJoin('configs as model_conf', function() {
                    this.on('models.id', 'model_conf.model')
                        .andOn(raw('model_conf.organization = ?', organization));
                }).innerJoin('families', function() {
                    this.on('models.family', 'families.id');
                }).innerJoin('configs as family_conf', function() {
                    this.on('families.id', 'family_conf.family')
                        .andOn(raw('family_conf.organization = ?', organization));
                }).innerJoin('manufacturers', function() {
                    this.on('families.manufacturer', 'manufacturers.id');
                }).innerJoin('configs as manufacturer_conf', function() {
                    this.on('manufacturers.id', 'manufacturer_conf.manufacturer')
                        .andOn(raw('manufacturer_conf.organization = ?', organization));
                });

            return Object.assign(
                {},
                JSON.parse(query[0].manufacturer_config),
                JSON.parse(query[0].family_config),
                JSON.parse(query[0].model_config)
            );
        } catch (err) {
            this.uow.logger.error('Failed to fetch composed config');
            this.uow.logger.error(err);
            throw err;
        }
    }
}