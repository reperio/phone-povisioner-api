import {Request} from 'hapi';
import {SchemaMap, object, validate} from 'joi';
import * as polycomConfigs from '../schema/polycomConfigs';

const allSchemas: {[schema: string]: SchemaMap; } = Object.assign(
    {},
    polycomConfigs
    //Add more schema modules here
);

const routes = [
    {
        method: 'GET',
        path: '/config/{organization}/manufacturers',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /config/manufacturers. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                const manufacturers = await uow.configurationRepository.getManufacturers(request.params.organization);
                if(manufacturers.length === 0) {
                    return h.response().code(404);
                }
                logger.debug(`Fetching all manufacturers from organization ${request.params.organization}`);
                return manufacturers;
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/config/{organization}/families/{manufacturer}',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /config/families. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                const families = await uow.configurationRepository.getFamilies(request.params.manufacturer, request.params.organization);
                if(families.length === 0) {
                    return h.response().code(404);
                }
                logger.debug(`Fetching all families from manufacturer ${request.params.manufacturer} in organization ${request.params.organization}`);
                return families;
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/config/{organization}/models/{family}',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /config/models. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                const models = await uow.configurationRepository.getModels(request.params.family, request.params.organization);
                if(models.length === 0) {
                    return h.response().code(404);
                }
                logger.debug(`Fetching all phone models from family ${request.params.family} in organization ${request.params.organization}`);
                return models;
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/config/{organization}/update-manufacturer-config',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /config/update-manufacturer-config. Raw payload:\n${JSON.stringify(request.payload)}`);

            try {
                const info = await uow.configurationRepository.getManufacturerInfo(request.payload.id, request.params.organization);
                logger.debug(info);
                const schema = object().keys(allSchemas[info.manufacturer_name]);
                const validation = validate(request.payload.config, schema);
                if(validation.error) {
                    logger.error(`Failed to update manufacturer ${request.payload.id} due to invalid config syntax`);
                    logger.error(validation.error);
                    return h.response().code(400);
                }

                const newObj = await uow.configurationRepository.setManufacturerConfig(request.payload.id, request.payload.config, request.params.organization);
                if(newObj === 0) {
                    return h.response().code(404);
                }
                logger.debug(`Manufacturer ${request.payload.id} updated with properties ${JSON.stringify(request.payload.config)} in organization ${request.params.organization}`);
                return newObj;
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/config/{organization}/update-family-config',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /config/update-family-config. Raw payload:\n${JSON.stringify(request.payload)}`);

            try {
                const info = await uow.configurationRepository.getFamilyInfo(request.payload.id, request.params.organization);
                const schema = object().keys(
                    Object.assign({}, allSchemas[info.manufacturer_name], allSchemas[info.family_name])
                );
                const validation = validate(request.payload.config, schema);
                if(validation.error) {
                    logger.error(`Failed to update family ${request.payload.id} due to invalid config syntax`);
                    logger.error(validation.error);
                    return h.response().code(400);
                }

                const newObj = await uow.configurationRepository.setFamilyConfig(request.payload.id, request.payload.config, request.params.organization);
                if(newObj === 0) {
                    return h.response().code(404);
                }
                logger.debug(`Family ${request.payload.id} updated with properties ${JSON.stringify(request.payload.config)} in organization ${request.params.organization}`);
                return newObj;
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/config/{organization}/update-model-config',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /config/update-model-config. Raw payload:\n${JSON.stringify(request.payload)}`);

            try {
                const info = await uow.configurationRepository.getModelInfo(request.payload.id, request.params.organization);
                const schema = object().keys(
                    Object.assign({}, allSchemas[info.manufacturer_name], allSchemas[info.family_name], allSchemas[info.model_name])
                );
                const validation = validate(request.payload.config, schema);
                if(validation.error) {
                    logger.error(`Failed to update model ${request.payload.id} due to invalid config syntax`);
                    logger.error(validation.error);
                    return h.response().code(400);
                }

                const newObj = await uow.configurationRepository.setModelConfig(request.payload.id, request.payload.config, request.params.organization);
                if(newObj === 0) {
                    return h.response().code(404);
                }
                logger.debug(`Model ${request.payload.id} updated with properties ${JSON.stringify(request.payload.config)} in organization ${request.params.organization}`);
                return newObj;
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/config/organizations',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /config/organizations.`);

            try {
                const models = await uow.organizationRepository.getOrganizations();
                logger.debug(`Fetching all organizations.`);
                return models;
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    }
];

export default routes;