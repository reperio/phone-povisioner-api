import {Request} from 'hapi';
import * as fs from 'fs';
import * as path from 'path';

const routes = [
    {
        method: 'GET',
        path: '/firmware/files',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Running /firmware/files.`);

            try {
                const files = fs.readdirSync(path.resolve(__dirname, '../../../provisioning-server/static/firmware'));
                files.splice(files.indexOf('.placeholder'), 1);
                logger.debug(`Fetching all firmware files.`);
                return files;
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