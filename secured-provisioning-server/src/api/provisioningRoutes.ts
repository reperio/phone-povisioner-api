import {Request} from "hapi";
import {soundpointIPConverter, getModelIDFromPath} from "../../../config-conversion";
import {parseUserAgentHeader, UserAgentData} from "../utils/parseUserAgentHeader";

const routes: any[] = [
    {
        method: 'GET',
        path: '/{address}.cfg',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching ${request.params.address}.cfg. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                const userAgent = parseUserAgentHeader(request.headers['user-agent']);
                if(!userAgent.macAddress || !userAgent.firmwareVersion || !userAgent.model || !userAgent.type || !userAgent.transportType) {
                    return h.response().code(404);
                }

                try {
                    uow.deviceRepository.addDevice(
                        userAgent.model, userAgent.macAddress, userAgent.firmwareVersion
                    );
                    logger.debug(`Added device: ${userAgent.macAddress}`);
                } catch {}

                const model = getModelIDFromPath(request.params);
                if(model === null) {
                    return h.response().code(404);
                }

                const config = await uow.configurationRepository.composeConfig(model, '1');
                logger.debug(`Composed config: ${JSON.stringify(config)}`);

                const template = soundpointIPConverter(config);

                return h.response(template).header('Content-Type', 'text/xml');
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
        path: '/000000000000.cfg',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching 000000000000.cfg. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                const userAgent = parseUserAgentHeader(request.headers['user-agent']);
                if(!userAgent.macAddress || !userAgent.firmwareVersion || !userAgent.model || !userAgent.type || !userAgent.transportType) {
                    return h.response().code(404);
                }
                uow.deviceRepository.addDevice(
                    userAgent.model, userAgent.macAddress, userAgent.firmwareVersion
                );
                logger.debug(`Added device: ${userAgent.macAddress}`);

                const model = getModelIDFromPath(request.params);
                if(model === null) {
                    return h.response().code(404);
                }

                const config = await uow.configurationRepository.composeConfig(model, '1');
                logger.debug(`Composed config: ${JSON.stringify(config)}`);

                const template = soundpointIPConverter(config);

                return h.response(template).header('Content-Type', 'text/xml');
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
        path: '/temp/assign-device/',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching 000000000000.cfg. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                const userAgent = parseUserAgentHeader(request.headers['user-agent']);
                if(!userAgent.macAddress || !userAgent.firmwareVersion || !userAgent.model || !userAgent.type || !userAgent.transportType) {
                    return h.response().code(404);
                }
                uow.deviceRepository.addDevice(
                    userAgent.model, userAgent.macAddress, userAgent.firmwareVersion
                );
                logger.debug(`Added device: ${userAgent.macAddress}`);

                const model = getModelIDFromPath(request.params);
                if(model === null) {
                    return h.response().code(404);
                }

                const config = await uow.configurationRepository.composeConfig(model, '1');
                logger.debug(`Composed config: ${JSON.stringify(config)}`);

                const template = soundpointIPConverter(config);

                return h.response(template).header('Content-Type', 'text/xml');
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