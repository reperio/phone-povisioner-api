import {BaseModel} from 'reperio-db-starter';

export class Config extends BaseModel {
    organization: string;
    manufacturer: string;
    family: string;
    model: string;
    properties: string;

    static get tableName() {
        return 'configs';
    }
}