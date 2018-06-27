import {Request} from "hapi";
import {soundpointIPConverter, getModelIDFromPath} from "../../../config-conversion";
import {parseUserAgentHeader} from "../utils/parseUserAgentHeader";
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
                logger.debug(`Received user-agent: ${request.headers['user-agent']}`);
                const userAgent = parseUserAgentHeader(request.headers['user-agent']);
                if(!userAgent.macAddress || !userAgent.firmwareVersion || !userAgent.model || !userAgent.type || !userAgent.transportType || !userAgent.applicationTag) {
                    logger.debug('Request failed: invalid user-agent header.');
                    logger.debug(JSON.stringify((userAgent)));
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

                if(device.status === 'initial') {
                    logger.debug(`Request failed: device is not adopted.`);
                    return h.response().code(404);
                }

                const a = request.params.address;
                const address = `${a[0]}${a[1]}:${a[2]}${a[3]}:${a[4]}${a[5]}:${a[6]}${a[7]}:${a[8]}${a[9]}:${a[10]}${a[11]}`;
                if(address !== device.user && address !== userAgent.macAddress) {
                    logger.debug(`Request failed: URL doesn't match mac address in user agent.`);
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
                } else {
                    template = soundpointIPConverter(config);
                }

                //if address === device.user, add other props and set status to provisioned

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

                const device = await uow.deviceRepository.getDevice(userAgent.macAddress);

                //Concurrency issues with the other route?
                if(device === null) {
                    await uow.deviceRepository.addDevice(
                        userAgent.model, userAgent.macAddress, userAgent.firmwareVersion
                    );
                    logger.debug(`Added device: ${userAgent.macAddress}`);
                    return h.response().code(404);
                }

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
                builderObj[`APPLICATION_${userAgent.applicationTag}`][`@CONFIG_FILES_${userAgent.applicationTag}`] = `/${device.user}.cfg`;

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