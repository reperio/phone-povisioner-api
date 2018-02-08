const BaseModel = require('./baseModel');

class PhoneModel extends BaseModel {
    static get tableName() {
        return 'models';
    }

    auto_generated_id() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'Object',
            properties: {
                id: { type: 'string' },
                family: { type: 'string' },
                name: { type: 'string' },
                config: { type: 'string' }
            }
        };
    }
}

module.exports = PhoneModel;
