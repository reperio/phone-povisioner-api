import {BaseModel} from 'reperio-db-starter';

export class Organization extends BaseModel {
    id: string;
    type: string;
    enabled: boolean;
    name: string;

    static get tableName() {
        return 'organizations';
    }
}