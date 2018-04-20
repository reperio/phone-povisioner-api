import {UnitOfWork} from '../unitOfWork';
import {Manufacturer} from "../models/manufacturer";
import {Family} from "../models/family";
import {PhoneModel} from "../models/phoneModel";
import {Config} from "../models/config";
import {raw} from 'objection';

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
                        .andOn('c.organization', organization);
                }).innerJoin('configs as default_conf', function() {
                    this.on('manufacturers.id', 'default_conf.manufacturer')
                        .andOn('(SELECT is_global_organization from organizations where id = default_conf.organization)', 'TRUE');//These are both recognized as strings
                }).orderBy('name', 'ASC');
            return manufacturers;
        } catch (err) {
            this.uow.logger.error('Failed to fetch manufacturers from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getFamilies(manufacturer: string) {
        try {
            const families = await Family
                .query(this.uow.transaction)
                .select('c.properties as config', 'families.*')
                .where('families.manufacturer', manufacturer)
                .join('configs as c', 'families.id', 'c.family')
                .orderBy('name', 'ASC');
            return families;
        } catch (err) {
            this.uow.logger.error('Failed to fetch families from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getModels(family: string) {
        try {
            const models = await PhoneModel
                .query(this.uow.transaction)
                .select('c.properties as config', 'models.*')
                .where('models.family', family)
                .join('configs as c', 'models.id', 'c.model')
                .orderBy('name', 'ASC');
            return models;
        } catch (err) {
            this.uow.logger.error('Failed to fetch families from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async setManufacturerConfig(manufacturer: string, config: any) {
        try {
            const updatedObj = await Config
                .query(this.uow.transaction)
                .update({properties: JSON.stringify(config)})
                .where('manufacturer', manufacturer); //Check organization too
            return updatedObj;
        } catch (err) {
            this.uow.logger.error('Failed to set config of manufacturer');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async setFamilyConfig(family: string, config: any) {
        try {
            const updatedObj = await Config
                .query(this.uow.transaction)
                .update({properties: JSON.stringify(config)})
                .where('family', family); //Check organization too
            return updatedObj;
        } catch (err) {
            this.uow.logger.error('Failed to set config of family');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async setModelConfig(model: string, config: any) {
        try {
            const updatedObj = await Config
                .query(this.uow.transaction)
                .update({properties: JSON.stringify(config)})
                .where('model', model); //Check organization too
            return updatedObj;
        } catch (err) {
            this.uow.logger.error('Failed to set config of model');
            this.uow.logger.error(err);
            throw err;
        }
    }
}