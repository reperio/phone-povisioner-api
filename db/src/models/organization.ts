import {BaseModel} from 'reperio-db-starter';

export class Organization extends BaseModel {
    id: string;
    is_global_organization: boolean;
    enabled: boolean;
    name: string;

    static get tableName() {
        return 'organizations';
    }
}