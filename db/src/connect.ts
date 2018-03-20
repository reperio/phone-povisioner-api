import * as Knex from 'knex';
import {Model} from 'objection';
import * as nconf from "nconf";
import * as path from "path";
import {BaseModel} from 'db-starter';

nconf.argv().env().file('development', path.resolve(__dirname, 'config', 'development.json'));
const knex = Knex(nconf.get('knex'));
BaseModel.knex(knex);

export {knex};
export {Model};