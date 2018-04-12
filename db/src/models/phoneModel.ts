import {BaseModel} from 'reperio-db-starter';
import {Relation} from 'objection';
import {Family} from './family';

export class PhoneModel extends BaseModel {
    id: string;
    family: string;
    name: string;
    config: string;
    default_config: string;
    component_name: string;

    static get tableName() {
        return 'models';
    }

    autoGeneratedId() {
        return 'id';
    }
}