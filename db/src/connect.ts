import * as Knex from 'knex';
import {Model} from 'objection';
import * as path from "path";
import {BaseModel} from 'reperio-db-starter';

const KnexConfig = require('../knexfile');
const env = process.env.NODE_ENV;

const knex = Knex(KnexConfig[env]);
BaseModel.knex(knex);

export {knex};
export {Model};