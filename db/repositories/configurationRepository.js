class AccountsRepository {
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
            await this.uow._models.Manufacturer
                .insert({name: name, config: config});
        } catch (err) {
            this.uow._logger.error('Failed to add a manufacturer to the database');
            this.uow._logger.error(err);
            throw err;
        }
    }

    async createFamily(name, manufacturer, config) {
        try {
            await this.uow._models.Family
                .insert({name: name, config: config, manufacturer: manufacturer});
        } catch (err) {
            this.uow._logger.error('Failed to add a family to the database');
            this.uow._logger.error(err);
            throw err;
        }
    }

    async createModel(name, family, config) {
        try {
            await this.uow._models.PhoneModel
                .insert({name: name, config: config, family: family});
        } catch (err) {
            this.uow._logger.error('Failed to add a phone model to the database');
            this.uow._logger.error(err);
            throw err;
        }
    }
}

module.exports = AccountsRepository;
