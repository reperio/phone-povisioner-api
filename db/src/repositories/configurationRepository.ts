import {UnitOfWork} from '../unitOfWork';
import {Manufacturer} from "../models/manufacturer";
import {Family} from "../models/family";
import {PhoneModel} from "../models/phoneModel";

export class ConfigurationRepository {
    uow: UnitOfWork;

    constructor(uow: UnitOfWork) {
        this.uow = uow;
    }

    async getManufacturers() {
        try {
            const manufacturers = await Manufacturer
                .query(this.uow.transaction)
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
                .where('manufacturer', manufacturer)
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
                .where('family', family)
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
            const updatedObj = await Manufacturer
                .query(this.uow.transaction)
                .update({config: JSON.stringify(config)})
                .where('id', manufacturer);
            return updatedObj;
        } catch (err) {
            this.uow.logger.error('Failed to set config of manufacturer');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async setFamilyConfig(family: string, config: any) {
        try {
            const updatedObj = await Family
                .query(this.uow.transaction)
                .update({config: JSON.stringify(config)})
                .where('id', family);
            return updatedObj;
        } catch (err) {
            this.uow.logger.error('Failed to set config of family');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async setModelConfig(model: string, config: any) {
        try {
            const updatedObj = await PhoneModel
                .query(this.uow.transaction)
                .update({config: JSON.stringify(config)})
                .where('id', model);
            return updatedObj;
        } catch (err) {
            this.uow.logger.error('Failed to set config of model');
            this.uow.logger.error(err);
            throw err;
        }
    }
}