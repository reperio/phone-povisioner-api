import {Request} from 'hapi';

const routes = [
    {
        method: 'GET',
        path: '/config/manufacturers',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            try {
                const manufacturers = await uow.configurationRepository.getManufacturers();
                logger.debug('Fetching all manufacturers');
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
        path: '/config/families/{manufacturer}',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            try {
                const families = await uow.configurationRepository.getFamilies(request.params.manufacturer);
                logger.debug(`Fetching all families from manufacturer ${request.params.manufacturer}`);
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
        path: '/config/models/{family}',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            try {
                const models = await uow.configurationRepository.getModels(request.params.family);
                logger.debug(`Fetching all phone models from family ${request.params.family}`);
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
        path: '/config/create-manufacturer',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            try {
                const manufacturer = await uow.configurationRepository.createManufacturer(request.payload.name, request.payload.config);
                logger.debug(`Manufacturer ${request.payload.name} created with properties ${JSON.stringify(request.payload.config)}`);
                return manufacturer;
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
        path: '/config/create-family',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            try {
                const family = await uow.configurationRepository.createFamily();
                logger.debug(`Family ${request.payload.name} created with properties ${request.payload.config} for manufacturer ${JSON.stringify(request.payload.manufacturer)}`);
                return family;
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
        path: '/config/create-model',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            try {
                const model = await uow.configurationRepository.createModel(request.payload.name, request.payload.family, request.payload.config);
                logger.debug(`Model ${request.payload.name} created with properties ${request.payload.config} for family ${JSON.stringify(request.payload.family)}`);
                return model;
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
        path: '/config/compose-family/{family}',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            try {
                const config = await uow.configurationRepository.composeConfigFromFamily(request.params.family);
                logger.debug(`Fetching composed config from ${request.params.model}`);
                return config;
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
        path: '/config/compose-model/{model}',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            try {
                const config = await uow.configurationRepository.composeConfigFromModel(request.params.model);
                logger.debug(`Fetching composed config from ${request.params.model}`);
                return config;
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