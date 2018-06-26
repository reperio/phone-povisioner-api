import {Request} from 'hapi';
import * as fs from 'fs';
import * as path from 'path';

const routes = [
    {
        method: 'GET',
        path: '/devices/devices',
        handler: async (request: Request, h: any) => {
            const logger = request.server.app.logger;

            logger.debug(`Running /devices/devices.`);

            try {

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
        path: '/devices/adopt-device/{address}',
        handler: async (request: Request, h: any) => {
            const logger = request.server.app.logger;

            logger.debug(`Running /devices/adopt. Raw payload:\n${JSON.stringify(request.payload)}`);

            try {

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