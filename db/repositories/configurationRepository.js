class ConfigurationRepository {
    constructor(uow) {
        this.uow = uow;
    }

    async getManufacturers() {
        try {
            const manufacturers = await this.uow._models.Manufacturer
                .query(this.uow._transaction)
                .orderBy('name', 'ASC');
            return manufacturers;
        } catch (err) {
            this.uow._logger.error('Failed to fetch manufacturers from database');
            this.uow._logger.error(err);
            throw err;
        }
    }

    async getFamilies(manufacturer) {
        try {
            const families = await this.uow._models.Family
                .query(this.uow._transaction)
                .where('manufacturer', manufacturer)
                .orderBy('name', 'ASC');
            return families;
        } catch (err) {
            this.uow._logger.error('Failed to fetch families from database');
            this.uow._logger.error(err);
            throw err;
        }
    }

    async getModels(family) {
        try {
            const models = await this.uow._models.PhoneModel
                .query(this.uow._transaction)
                .where('family', family)
                .orderBy('name', 'ASC');
            return models;
        } catch (err) {
            this.uow._logger.error('Failed to fetch families from database');
            this.uow._logger.error(err);
            throw err;
        }
    }

    async createManufacturer(name, config) {
        try {
            const manufacturer = await this.uow._models.Manufacturer
                .query(this.uow._transaction)
                .insert({name: name, config: JSON.stringify(config)});
            return manufacturer;
        } catch (err) {
            this.uow._logger.error('Failed to add a manufacturer to the database');
            this.uow._logger.error(err);
            throw err;
        }
    }

    async createFamily(name, manufacturer, config) {
        try {
            const family = await this.uow._models.Family
                .query(this.uow._transaction)
                .insert({name: name, config: JSON.stringify(config), manufacturer: manufacturer});
            return family;
        } catch (err) {
            this.uow._logger.error('Failed to add a family to the database');
            this.uow._logger.error(err);
            throw err;
        }
    }

    async createModel(name, family, config) {
        try {
            const model = await this.uow._models.PhoneModel
                .query(this.uow._transaction)
                .insert({name: name, config: JSON.stringify(config), family: family});
            return model;
        } catch (err) {
            this.uow._logger.error('Failed to add a phone model to the database');
            this.uow._logger.error(err);
            throw err;
        }
    }

    async composeConfig(modelId) {
        try {
            const model = await this.uow._models.PhoneModel
                .query(this.uow._transaction)
                .where('id', modelId);
            const family = await this.uow._models.Family
                .query(this.uow._transaction)
                .where('id', model[0].family);
            const manufacturer = await this.uow._models.Manufacturer
                .query(this.uow._transaction)
                .where('id', family[0].manufacturer);

            return Object.assign(
                {},
                JSON.parse(manufacturer[0].config),
                JSON.parse(family[0].config),
                JSON.parse(model[0].config)
            );
        } catch (err) {
            this.uow._logger.error('Failed to fetch config from database');
            this.uow._logger.error(err);
            throw err;
        }
    }
}

module.exports = ConfigurationRepository;
