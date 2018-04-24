"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes = [
    {
        method: 'GET',
        path: '/config/manufacturers',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;
            logger.debug(`Running /config/manufacturers. Raw params:\n${JSON.stringify(request.params)}`);
            try {
                const manufacturers = await uow.configurationRepository.getManufacturers();
                logger.debug('Fetching all manufacturers');
                return manufacturers;
            }
            catch (e) {
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
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;
            logger.debug(`Running /config/families. Raw params:\n${JSON.stringify(request.params)}`);
            try {
                const families = await uow.configurationRepository.getFamilies(request.params.manufacturer);
                logger.debug(`Fetching all families from manufacturer ${request.params.manufacturer}`);
                return families;
            }
            catch (e) {
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
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;
            logger.debug(`Running /config/models. Raw params:\n${JSON.stringify(request.params)}`);
            try {
                const models = await uow.configurationRepository.getModels(request.params.family);
                logger.debug(`Fetching all phone models from family ${request.params.family}`);
                return models;
            }
            catch (e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/config/update-manufacturer-config',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;
            logger.debug(`Running /config/update-manufacturer-config. Raw payload:\n${JSON.stringify(request.payload)}`);
            try {
                const newObj = await uow.configurationRepository.setManufacturerConfig(request.payload.id, request.payload.config);
                logger.debug(`Manufacturer ${request.payload.id} updated with properties ${JSON.stringify(request.payload.config)}`);
                return newObj;
            }
            catch (e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/config/update-family-config',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;
            logger.debug(`Running /config/update-family-config. Raw payload:\n${JSON.stringify(request.payload)}`);
            try {
                const newObj = await uow.configurationRepository.setFamilyConfig(request.payload.id, request.payload.config);
                logger.debug(`Family ${request.payload.id} updated with properties ${JSON.stringify(request.payload.config)}`);
                return newObj;
            }
            catch (e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/config/update-model-config',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;
            logger.debug(`Running /config/update-model-config. Raw payload:\n${JSON.stringify(request.payload)}`);
            try {
                const newObj = await uow.configurationRepository.setModelConfig(request.payload.id, request.payload.config);
                logger.debug(`Model ${request.payload.id} updated with properties ${JSON.stringify(request.payload.config)}`);
                return newObj;
            }
            catch (e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    }
];
exports.default = routes;
//# sourceMappingURL=configurationRoutes.js.map