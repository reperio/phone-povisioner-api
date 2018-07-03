import {Request} from "hapi";
import {soundpointIPConverter, getModelIDFromPath, firmwareVersion, RegistrationInfo} from "../../../config-conversion";
import {parseUserAgentHeader} from "../utils/parseUserAgentHeader";
import * as builder from 'xmlbuilder';
import KazooService from '../../../kazoo';

const routes: any[] = [
    {
        method: 'GET',
        path: '/{address}.cfg',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching ${request.params.address}.cfg. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                logger.debug(`Received user-agent: ${request.headers['user-agent']}`);
                const userAgent = parseUserAgentHeader(request.headers['user-agent']);
                if(!userAgent.macAddress || !userAgent.firmwareVersion || !userAgent.model || !userAgent.type || !userAgent.transportType || !userAgent.applicationTag) {
                    logger.debug('Request failed: invalid user-agent header.');
                    logger.debug(JSON.stringify((userAgent)));
                    return h.response().code(404);
                }

                const devices = await uow.deviceRepository.getDevicesFromPhone(userAgent.macAddress);

                if(devices.length === 0) {
                    await uow.deviceRepository.addDevice(
                        userAgent.model, userAgent.macAddress, userAgent.firmwareVersion
                    );
                    logger.debug(`Added device: ${userAgent.macAddress}`);
                    return h.response().code(404);
                }

                //TODO: determine which device to choose
                const device = devices[0];

                if(device.status === 'initial') {
                    logger.debug(`Request failed: device is not adopted.`);
                    return h.response().code(404);
                }

                const a = request.params.address;
                logger.debug(`\n\n\n\n\n${request.params.address}\n${userAgent.macAddress.replace(/:/g, '')}\n\n\n\n\n`);
                if((request.params.address !== device.user || device.status !== 'given_credentials') && request.params.address !== userAgent.macAddress.replace(/:/g, '')) {
                    logger.debug(`Request failed: URL doesn't match username in db or mac address in user agent.`);
                    return h.response().code(404);
                }

                if(device.status === 'given_credentials' || device.status === 'provisioned') {
                    if(!request.auth.isAuthenticated || request.auth.credentials.username !== device.user || request.auth.credentials.password !== device.password) {
                        logger.debug(`Request failed: failed authentication.`);
                        return h.response().code(401).header('WWW-Authenticate', 'Basic realm="Restricted Content"');
                    }
                }

                const config = await uow.configurationRepository.composeConfig(device.model, device.organization);
                logger.debug(`Composed config: ${JSON.stringify(config)}`);

                let template;
                if (device.status === 'adopted' || device.status === 'initial_credentials') {
                    template = soundpointIPConverter(config, device.user, device.password);
                    const status = device.status === 'adopted' ? 'initial_credentials' : 'given_credentials';
                    await uow.deviceRepository.updateDevice(userAgent.macAddress, {status});
                } else if (request.params.address === device.user) {
                    const kazooService = new KazooService();
                    kazooService.authenticate(process.env.CREDENTIALS, process.env.ACCOUNT_NAME);
                    template = soundpointIPConverter(config, undefined, undefined, devices.map(async (d:any) => {
                        const kazooDevice = await kazooService.getDevice(d.organization, d.kazoo_id);
                        return {
                            username: kazooDevice.sip.username,
                            password: kazooDevice.sip.password,
                            realm: d.realm
                        };
                    }));
                    if(device.status === 'given_credentials') {
                        await uow.deviceRepository.updateDevice(userAgent.macAddress, {status: 'provisioned'});
                    }
                } else {
                    template = soundpointIPConverter(config);
                }

                logger.debug('Sent config');
                logger.debug(template);

                return h.response(template).header('Content-Type', 'text/xml');
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: 'conditionalAuth'
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
                logger.debug(`Received user-agent: ${request.headers['user-agent']}`);
                const userAgent = parseUserAgentHeader(request.headers['user-agent']);
                if(!userAgent.macAddress || !userAgent.firmwareVersion || !userAgent.model || !userAgent.type || !userAgent.transportType || !userAgent.applicationTag) {
                    logger.debug('Request failed: invalid user-agent header.');
                    return h.response().code(404);
                }

                const devices = await uow.deviceRepository.getDevicesFromPhone(userAgent.macAddress);

                //Concurrency issues with the other route?
                if(devices.length === 0) {
                    await uow.deviceRepository.addDevice(
                        userAgent.model, userAgent.macAddress, userAgent.firmwareVersion
                    );
                    logger.debug(`Added device: ${userAgent.macAddress}`);
                    return h.response().code(404);
                }

                //TODO: determine which device to choose
                const device = devices[0];

                if(device.status === 'initial') {
                    logger.debug(`Request failed: device is not adopted.`);
                    return h.response().code(404);
                }

                if(device.status === 'given_credentials' || device.status === 'provisioned') {
                    if(!request.auth.isAuthenticated || request.auth.credentials.username !== device.user || request.auth.credentials.password !== device.password) {
                        logger.debug(`Request failed: failed authentication.`);
                        return h.response().code(401).header('WWW-Authenticate', 'Basic realm="Restricted Content"');
                    }
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
                builderObj[`APPLICATION_${userAgent.applicationTag}`][`@CONFIG_FILES_${userAgent.applicationTag}`]
                    = device.status === 'given_credentials' ? `/${device.user}.cfg` : `/${userAgent.macAddress.replace(/:/g, '')}.cfg`;

                const xml = builder.create(builderObj,{version: '1.0', standalone: true});

                return h.response(xml.end()).header('Content-Type', 'text/xml');
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: 'conditionalAuth'
        }
    }
];

export default routes;