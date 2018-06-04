import {BaseModel} from 'reperio-db-starter';

export class Device extends BaseModel {
    organization: string;
    model: string;
    mac_address: string;
    firmware_version: string;
    name: string;
    status: string;
    kazoo_id: string;
    user: string;
    password: string;

    static get tableName() {
        return 'devices';
    }
}