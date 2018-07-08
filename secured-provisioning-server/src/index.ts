import {UnitOfWork} from '../../db';
const Server = require('hapijs-starter');
import * as path from 'path';
import * as builder from 'xmlbuilder';
import {Request} from 'hapi';
import {Config} from './config';
import {parseUserAgentHeader} from "./utils/parseUserAgentHeader";
import {firmwareVersion} from "../../config-conversion";

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

        await server.registerExtension({
            type: 'onPreAuth',
            method: async (request: Request, h: any) => {
                const logger = request.server.app.logger;

                logger.debug(`Pre-auth: ${request.path}`);

                //check if this request matches the pattern for phones asking for their config
                const match = request.path.match(/\/([0-9A-Fa-f]){12}.cfg+/g);

                if (!match) { //if it's not a match, just continue the pipeline
                    return h.continue;
                }

                const userAgent = parseUserAgentHeader(request.headers['user-agent']);
                logger.debug(`User-Agent: ${JSON.stringify(userAgent)}`);
                
                if(!userAgent.macAddress || !userAgent.firmwareVersion || !userAgent.model || !userAgent.type || !userAgent.transportType || !userAgent.applicationTag) {
                    logger.debug('Request failed: invalid user-agent header.');
                    return h.response().code(404);
                }

                const uow = await request.app.getNewUoW();
                const devices = await uow.deviceRepository.getDevicesFromPhone(request.auth.credentials.userAgent.macAddress);

                //Concurrency issues with the other route?
                if(devices.length === 0) {
                    await uow.deviceRepository.addDevice(
                        request.auth.credentials.userAgent.model, request.auth.credentials.userAgent.macAddress, request.auth.credentials.userAgent.firmwareVersion
                    );
                    logger.debug(`Added device: ${request.auth.credentials.userAgent.macAddress}`);
                    return h.response().code(404);
                }

                const device = devices[0];

                if(device.status === 'initial') {
                    logger.debug(`Request failed: device is not adopted.`);
                    return h.response().code(404);
                }

                if (device.status === 'adopted' || device.status === 'initial_credentials') {
                    let builderObj : any = {
                        APPLICATION: {
                            '@APP_FILE_PATH': 'sip.ld',
                            '@CONFIG_FILES': '',
                            '@MISC_FILES': '',
                            '@LOG_FILE_DIRECTORY': '',
                            '@OVERRIDES_DIRECTORY': '',
                            '@LICENSE_DIRECTORY': ''
                        }
                    };
                    builderObj[`APPLICATION_${request.auth.credentials.userAgent.applicationTag}`] = {};
                    builderObj[`APPLICATION_${request.auth.credentials.userAgent.applicationTag}`][`@APP_FILE_PATH_${request.auth.credentials.userAgent.applicationTag}`] = firmwareVersion(
                        await uow.configurationRepository.composeBaseConfig(request.auth.credentials.userAgent.model, '1')
                    );
                    builderObj[`APPLICATION_${request.auth.credentials.userAgent.applicationTag}`][`@CONFIG_FILES_${request.auth.credentials.userAgent.applicationTag}`] = `/temp/${device.user}.cfg`;
    
                    const xml = builder.create(builderObj,{version: '1.0', standalone: true});
    
                    return h.response(xml.end()).header('Content-Type', 'text/xml');
                }

                return h.continue;
            }
        });

        await server.registerAdditionalPlugin(require('hapi-auth-basic'));
        server.strategy('provisioningAuth', 'basic', {validate, unauthorizedAttributes: {realm: 'Restricted'}});

        await server.startServer();
        await server.registerRoutesFromDirectory(path.resolve(__dirname, './api'));
    } catch(e) {
        console.log(e);
    }
}

startServer();