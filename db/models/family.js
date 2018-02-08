const BaseModel = require('./baseModel');

class Family extends BaseModel {
    static get tableName() {
        return 'families';
    }

    auto_generated_id() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'Object',
            properties: {
                id: { type: 'string' },
                manufacturer: { type: 'string' },
                name: { type: 'string' },
                config: { type: 'string' }
            }
        };
    }
}

module.exports = Family;
