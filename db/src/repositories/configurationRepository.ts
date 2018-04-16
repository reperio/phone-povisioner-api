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

    async getManufacturers() {
        try {
            const manufacturers = await Manufacturer
                .query(this.uow.transaction)
                .select('c.properites as config', 'manufacturers.*')
                .join('configs as c', 'manufacturers.id', 'configs.manufacturer')
                .orderBy('name', 'ASC');
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
                .select('c.properites as config', 'families.*')
                .where('manufacturer', manufacturer)
                .join('configs as c', 'families.id', 'configs.family')
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
                .select('c.properites as config', 'models.*')
                .where('family', family)
                .join('configs as c', 'models.id', 'configs.model')
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