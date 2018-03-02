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

    async createManufacturer(name: string, config: object) {
        try {
            const manufacturer = await Manufacturer
                .query(this.uow.transaction)
                .insert({name: name, config: JSON.stringify(config)});
            return manufacturer;
        } catch (err) {
            this.uow.logger.error('Failed to add a manufacturer to the database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async createFamily(name: string, manufacturer: string, config: object) {
        try {
            const family = await Family
                .query(this.uow.transaction)
                .insert({name: name, config: JSON.stringify(config), manufacturer: manufacturer});
            return family;
        } catch (err) {
            this.uow.logger.error('Failed to add a family to the database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async createModel(name: string, family: string, config: object) {
        try {
            const model = PhoneModel
                .query(this.uow.transaction)
                .insert({name: name, config: JSON.stringify(config), family: family});
            return model;
        } catch (err) {
            this.uow.logger.error('Failed to add a phone model to the database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async composeConfigFromModel(modelId: string) {
        try {
            const model = await PhoneModel
                .query(this.uow.transaction)
                .where('id', modelId);
            const family = await Family
                .query(this.uow.transaction)
                .where('id', model[0].family);
            const manufacturer = await Manufacturer
                .query(this.uow.transaction)
                .where('id', family[0].manufacturer);

            return Object.assign(
                {},
                JSON.parse(manufacturer[0].config),
                JSON.parse(family[0].config),
                JSON.parse(model[0].config)
            );
        } catch (err) {
            this.uow.logger.error('Failed to fetch config from database');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async composeConfigFromFamily(familyId: string) {
        try {
            const family = await Family
                .query(this.uow.transaction)
                .where('id', familyId);
            const manufacturer = await Manufacturer
                .query(this.uow.transaction)
                .where('id', family[0].manufacturer);

            return Object.assign(
                {},
                JSON.parse(manufacturer[0].config),
                JSON.parse(family[0].config)
            );
        } catch (err) {
            this.uow.logger.error('Failed to fetch config from database');
            this.uow.logger.error(err);
            throw err;
        }
    }
}