const BaseModel = require('./baseModel');

class Manufacturer extends BaseModel {
    static get tableName() {
        return 'manufacturers';
    }

    auto_generated_id() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'Object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                config: { type: 'string' }
            }
        };
    }
}

module.exports = Manufacturer;
