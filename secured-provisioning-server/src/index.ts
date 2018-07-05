import {UnitOfWork} from '../../db';
const Server = require('hapijs-starter');
import * as path from 'path';
import {Request} from 'hapi';
import {Config} from './config';
import {parseUserAgentHeader} from "./utils/parseUserAgentHeader";

async function validate(request: Request, username: string, password: string, h: any) {
    const uow = await request.app.getNewUoW();
    const logger = request.server.app.logger;

    logger.debug(`Received user-agent: ${request.headers['user-agent']}`);
    const userAgent = parseUserAgentHeader(request.headers['user-agent']);
    if(!userAgent.macAddress || !userAgent.firmwareVersion || !userAgent.model || !userAgent.type || !userAgent.transportType || !userAgent.applicationTag) {
        logger.debug('Request failed: invalid user-agent header.');
        logger.debug(JSON.stringify((userAgent)));
        return {
            response: h.response().code(404)
        };
    }

    return {
        isValid: true,
        credentials: {username, password, userAgent}
    };
}

async function startServer() : Promise<void> {
    try {
        const server = new Server({authEnabled: false, port: Config.port});

        await server.registerExtension({
            type: 'onRequest',
            method: async (request: Request, h: any) => {
                request.app.uows = [];

                request.app.getNewUoW = async () => {
                    const uow = new UnitOfWork(server.app.logger);
                    request.app.uows.push(uow);
                    return uow;
                };

                return h.continue;
            }
        });

        await server.registerAdditionalPlugin(require('hapi-auth-basic'));
        server.strategy('provisioningAuth', 'basic', {validate});

        await server.startServer();
        await server.registerRoutesFromDirectory(path.resolve(__dirname, './api'));
    } catch(e) {
        console.log(e);
    }
}

startServer();