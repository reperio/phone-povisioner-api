import {Request} from 'hapi';
import KazooService from '../../../kazoo';

const routes = [
    {
        method: 'GET',
        path: '/devices/devices/{organization}',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /devices/devices. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                const devices = await uow.deviceRepository.getDevicesFromOrganization(request.params.organization);
                return devices;
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
        path: '/devices/kazoo-devices/{organization}',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /devices/kazoo-devices. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                const kazooService = new KazooService(logger);
                await kazooService.authenticate(process.env.CREDENTIALS, process.env.ACCOUNT_NAME);
                const devices = await kazooService.getDevices(request.params.organization);
                return devices;
            } catch(e) {
                logger.error('Failed to fetch Kazoo devices');
                logger.error(e.toString());
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/devices/adopt-device',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /devices/adopt. Raw payload:\n${JSON.stringify(request.payload)}`);

            try {
                const kazooService = new KazooService(logger);
                await kazooService.authenticate(process.env.CREDENTIALS, process.env.ACCOUNT_NAME);
                const device = await kazooService.getDevice(request.payload.organization, request.payload.id);
                await uow.deviceRepository.updateDevice(request.payload.address, {
                    organization: request.payload.organization,
                    name: device.name,
                    kazoo_id: device.id,
                    status: 'adopted'
                });

                return h.response().code(200);
            } catch(e) {
                logger.error('Failed to adopt device');
                logger.error(e.toString());
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    }
];

export default routes;