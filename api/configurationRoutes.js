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

            return await uow.configurationRepository.geetModels(request.params.family);
        },
        config: {
            auth: false
        }
    }
];

