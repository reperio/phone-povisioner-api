module.exports = [
    {
        method: 'GET',
        path: '/config/manufacturers',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug('Fetching all manufacturers');

            return await uow.configurationRepository.getManufacturers();
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

            logger.debug(`Fetching all families from manufacturer ${request.params.manufacturer}`);

            return await uow.configurationRepository.getFamilies(request.params.manufacturer);
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

            logger.debug(`Fetching all phone models from family ${request.params.family}`);

            return await uow.configurationRepository.getModels(request.params.family);
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/config/create-manufacturer',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(request.payload);
            logger.debug(`Manufacturer ${request.payload.name} created with properties ${JSON.stringify(request.payload.config)}`);

            return await uow.configurationRepository.createManufacturer(request.payload.name, request.payload.config);
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/config/create-family',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Family ${request.payload.name} created with properties ${request.payload.config} for manufacturer ${JSON.stringify(request.payload.manufacturer)}`);

            return await uow.configurationRepository.createFamily(request.payload.name, request.payload.manufacturer, request.payload.config);
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/config/create-model',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Model ${request.payload.name} created with properties ${request.payload.config} for family ${JSON.stringify(request.payload.family)}`);

            return await uow.configurationRepository.createModel(request.payload.name, request.payload.family, request.payload.config);
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/config/compose/{model}',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching composed config from ${request.params.model}`);

            return await uow.configurationRepository.composeConfig(request.params.model);
        },
        config: {
            auth: false
        }
    }
];

