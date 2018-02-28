import {UnitOfWork} from 'reperio-example-db/lib/unitOfWork';
import {Server} from 'hapijs-starter';
import * as path from 'path';
import {Request} from 'hapi';

async function startServer() : Promise<void> {
    const server = new Server({authEnabled: false});
    await server.registerRoutesFromDirectory(path.resolve(__dirname, './api'));

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

    await server.startServer();
}

startServer();