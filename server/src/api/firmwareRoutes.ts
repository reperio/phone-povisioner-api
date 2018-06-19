import {Request} from 'hapi';
import * as fs from 'fs';
import * as path from 'path';
import {object, validate} from "joi";

const firmwareFilePath = path.resolve(__dirname, '../../../provisioning-server/static/firmware');
const bootromFilePath = path.resolve(__dirname, '../../../provisioning-server/static/bootrom');

const routes = [
    {
        method: 'GET',
        path: '/firmware/files',
        handler: async (request: Request, h: any) => {
            const logger = request.server.app.logger;

            logger.debug(`Running /firmware/files.`);

            try {
                let files = fs.readdirSync(firmwareFilePath).concat(fs.readdirSync(bootromFilePath));
                files = files.filter(f => f !== '.placeholder');
                logger.debug(`Fetching all firmware files.`);
                return files;
            } catch(e) {
                logger.error(e);
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/firmware/remove-file',
        handler: async (request: Request, h: any) => {
            const logger = request.server.app.logger;

            logger.debug(`Running /firmware/remove-file. Raw payload:\n${JSON.stringify(request.payload)}`);

            try {
                const firmwareFile = path.resolve(firmwareFilePath, request.payload.filename);
                const bootromFile = path.resolve(bootromFilePath, request.payload.filename);

                if(fs.existsSync(firmwareFile)) {
                    fs.unlinkSync(firmwareFile);
                } else if(fs.existsSync(bootromFile)) {
                    fs.unlinkSync(bootromFile);
                } else {
                    return h.response().code(500);
                }

                return h.response().code(200);
            } catch(e) {
                logger.error(e);
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    }
];

export default routes;