import {Request} from 'hapi';

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
                const newObj = await uow.configurationRepository.setManufacturerConfig(request.payload.id, request.payload.config, request.params.organization);
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
                const newObj = await uow.configurationRepository.setFamilyConfig(request.payload.id, request.payload.config, request.params.organization);
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
                const newObj = await uow.configurationRepository.setModelConfig(request.payload.id, request.payload.config, request.params.organization);
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