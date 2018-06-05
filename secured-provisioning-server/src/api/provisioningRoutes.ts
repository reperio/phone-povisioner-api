import {Request} from "hapi";
import {soundpointIPConverter, getModelIDFromPath} from "../../../config-conversion";
import {parseUserAgentHeader, UserAgentData} from "../utils/parseUserAgentHeader";
import * as builder from 'xmlbuilder';
import {firmwareVersion} from '../../../config-conversion';

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

                const device = await uow.deviceRepository.getDevice(userAgent.macAddress);

                const a = request.params.address;
                const address = `${a[0]}${a[1]}:${a[2]}${a[3]}:${a[4]}${a[5]}:${a[6]}${a[7]}:${a[8]}${a[9]}:${a[10]}${a[11]}`;
                if(address !== device.user && address !== userAgent.macAddress) {
                    return h.response().code(404);
                }

                if(device === null) {
                    await uow.deviceRepository.addDevice(
                        userAgent.model, userAgent.macAddress, userAgent.firmwareVersion
                    );
                    logger.debug(`Added device: ${userAgent.macAddress}`);
                    return h.response().code(404);
                }

                if(device.status === 'given_credentials' || device.status === 'provisioned') {
                    //TODO: authenticate
                    return h.response().code(401);
                }

                const config = await uow.configurationRepository.composeConfig(device.model, device.organization);
                logger.debug(`Composed config: ${JSON.stringify(config)}`);

                const template = device.status === 'adopted' ?
                    soundpointIPConverter(config, device.user, device.password) : soundpointIPConverter(config);

                //if address === device.user, add other props

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

                const device = await uow.deviceRepository.getDevice(userAgent.macAddress);

                if(device === null) {
                    await uow.deviceRepository.addDevice(
                        userAgent.model, userAgent.macAddress, userAgent.firmwareVersion
                    );
                    logger.debug(`Added device: ${userAgent.macAddress}`);
                    return h.response().code(404);
                }

                if(device.status === 'given_credentials' || device.status === 'provisioned') {
                    //TODO: authenticate
                    return h.response().code(401);
                }

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
                builderObj[`APPLICATION_${userAgent.applicationTag}`] = {};
                builderObj[`APPLICATION_${userAgent.applicationTag}`][`@APP_FILE_PATH_${userAgent.applicationTag}`] = firmwareVersion(
                    await uow.configurationRepository.composeBaseConfig(userAgent.model, '1')
                );
                builderObj[`APPLICATION_${userAgent.applicationTag}`][`@CONFIG_FILES_${userAgent.applicationTag}`] = `/${device.user}.cfg`;

                const xml = builder.create(builderObj,{version: '1.0', standalone: true});

                return h.response(xml.end()).header('Content-Type', 'text/xml');
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
        path: '/temp/assign-device/{address}',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Assigning device ${request.params.address}. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                await uow.deviceRepository.updateDevice(request.params.address, {
                    organization: 'd38abe802090d3216dff4993fd5ee186',
                    name: 'Test Phone',
                    kazoo_id: '0000',
                    status: 'adopted'
                });

                return h.response().code(200);
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