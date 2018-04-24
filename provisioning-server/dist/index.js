"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const hapijs_starter_1 = require("hapijs-starter");
const path = require("path");
async function startServer() {
    try {
        const server = new hapijs_starter_1.Server({ authEnabled: false });
        await server.registerRoutesFromDirectory(path.resolve(__dirname, './api'));
        await server.registerExtension({
            type: 'onRequest',
            method: async (request, h) => {
                request.app.uows = [];
                request.app.getNewUoW = async () => {
                    const uow = new db_1.UnitOfWork(server.app.logger);
                    request.app.uows.push(uow);
                    return uow;
                };
                return h.continue;
            }
        });
        await server.startServer();
    }
    catch (e) {
        console.log(e);
    }
}
startServer();
//# sourceMappingURL=index.js.map