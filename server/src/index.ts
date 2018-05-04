import {UnitOfWork} from '../../db';
import {Server} from 'hapijs-starter';
import * as path from 'path';
import {Request} from 'hapi';
import {Config} from './config';

async function startServer() : Promise<void> {
    try {
        const server = new Server({authEnabled: false, port: Config.port});
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
    } catch(e) {
        console.log(e);
    }
}

startServer();