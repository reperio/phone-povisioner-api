"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converters_1 = require("../converters");
const getModelIDFromPath_1 = require("../utils/getModelIDFromPath");
const routes = [
    {
        method: 'GET',
        path: '/{manufacturer}/{family}/{model}.cfg',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;
            logger.debug(`Fetching config. Raw params:\n${JSON.stringify(request.params)}`);
            try {
                const model = getModelIDFromPath_1.default(request.params);
                if (model === null) {
                    return h.response().code(404);
                }
                const config = await uow.configurationRepository.composeConfig(model, '1');
                logger.debug(`Composed config: ${JSON.stringify(config)}`);
                const template = converters_1.polycomConverter(config);
                return h.response(template).header('Content-Type', 'text/xml');
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
//# sourceMappingURL=provisioningRoutes.js.map