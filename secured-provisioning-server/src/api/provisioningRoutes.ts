import {Request} from "hapi";
import {soundpointIPConverter, getModelIDFromPath, firmwareVersion, RegistrationInfo} from "../../../config-conversion";
import * as builder from 'xmlbuilder';
import KazooService from '../../../kazoo';

const routes: any[] = [
    {
        method: 'GET',
        path: '/{address}-provisioned.cfg',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching ${request.params.address}-provisioned.cfg. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                if(request.params.address !== request.auth.credentials.userAgent.rawMacAddress) {
                    logger.debug(`Request failed: URL doesn't match mac address in user agent.`);
                    return h.response().code(404);
                }

                const devices = await uow.deviceRepository.getDevicesFromPhone(request.auth.credentials.userAgent.macAddress);

                if(devices.length === 0) {
                    await uow.deviceRepository.addDevice(
                        request.auth.credentials.userAgent.model, request.auth.credentials.userAgent.macAddress, request.auth.credentials.userAgent.firmwareVersion
                    );
                    logger.debug(`Added device: ${request.auth.credentials.userAgent.macAddress}`);
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

                const config = await uow.configurationRepository.composeConfig(device.model, device.organization);
                logger.debug(`Composed config: ${JSON.stringify(config)}`);

                let template;
                if (device.status === 'given_credentials' || device.status === 'provisioned') {
                    if(device.status === 'given_credentials') {
                        await uow.deviceRepository.updateDevice(request.auth.credentials.userAgent.macAddress, {status: 'provisioned'});
                    }

                    const kazooService = new KazooService();
                    await kazooService.authenticate(process.env.CREDENTIALS, process.env.ACCOUNT_NAME);
                    template = soundpointIPConverter(config, undefined, undefined, devices.map(async (d:any) => {
                        const kazooDevice = await kazooService.getDevice(d.organization, d.kazoo_id);
                        return {
                            username: kazooDevice.sip.username,
                            password: kazooDevice.sip.password,
                            realm: d.realm
                        };
                    }));
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
            auth: 'provisioningAuth'
        }
    },
    {
        method: 'GET',
        path: '/temp/{user}.cfg',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching temp config. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                const devices = await uow.deviceRepository.getDevicesFromPhone(request.auth.credentials.userAgent.macAddress);

                if(devices.length === 0) {
                    return h.response().code(404);
                }

                //TODO: determine which device to choose
                const device = devices[0];

                if(device.status !== 'adopted' && device.status !== 'initial_credentials') {
                    logger.debug(`Request failed: url is not available.`);
                    return h.response().code(404);
                }

                if(request.params.user !== device.user) {
                    logger.debug(`Request failed: URL doesn't match username in db.`);
                    return h.response().code(404);
                }

                const config = await uow.configurationRepository.composeConfig(device.model, device.organization);
                logger.debug(`Composed config: ${JSON.stringify(config)}`);

                const template = soundpointIPConverter(config, device.user, device.password);
                const status = device.status === 'adopted' ? 'initial_credentials' : 'given_credentials';
                await uow.deviceRepository.updateDevice(request.auth.credentials.userAgent.macAddress, {status});

                logger.debug('Sent config');
                logger.debug(template);

                return h.response(template).header('Content-Type', 'text/xml');
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: 'provisioningAuth'
        }
    },
    {
        method: 'GET',
        path: '/{address}.cfg',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching ${request.params.address}.cfg. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                if(request.params.address !== request.auth.credentials.userAgent.rawMacAddress) {
                    logger.debug(`Request failed: URL doesn't match mac address in user agent.`);
                    return h.response().code(404);
                }

                const devices = await uow.deviceRepository.getDevicesFromPhone(request.auth.credentials.userAgent.macAddress);

                //Concurrency issues with the other route?
                if(devices.length === 0) {
                    await uow.deviceRepository.addDevice(
                        request.auth.credentials.userAgent.model, request.auth.credentials.userAgent.macAddress, request.auth.credentials.userAgent.firmwareVersion
                    );
                    logger.debug(`Added device: ${request.auth.credentials.userAgent.macAddress}`);
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
                builderObj[`APPLICATION_${request.auth.credentials.userAgent.applicationTag}`] = {};
                builderObj[`APPLICATION_${request.auth.credentials.userAgent.applicationTag}`][`@APP_FILE_PATH_${request.auth.credentials.userAgent.applicationTag}`] = firmwareVersion(
                    await uow.configurationRepository.composeBaseConfig(request.auth.credentials.userAgent.model, '1')
                );
                builderObj[`APPLICATION_${request.auth.credentials.userAgent.applicationTag}`][`@CONFIG_FILES_${request.auth.credentials.userAgent.applicationTag}`]
                    = device.status === 'adopted' || device.status === 'initial_credentials'
                    ? `/temp/${device.user}.cfg` : `/${request.auth.credentials.userAgent.rawMacAddress}-provisioned.cfg`;

                const xml = builder.create(builderObj,{version: '1.0', standalone: true});

                return h.response(xml.end()).header('Content-Type', 'text/xml');
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: 'provisioningAuth'
        }
    }
];

export default routes;