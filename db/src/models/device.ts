import {BaseModel} from 'reperio-db-starter';

export class Device extends BaseModel {
    organization: string;
    model: string;
    mac_address: string;
    firmware_version: string;
    name: string;
    status: string;

    static get tableName() {
        return 'devices';
    }
}