"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const hapijs_starter_1 = require("hapijs-starter");
const provisioningRoutes_1 = require("./api/provisioningRoutes");
async function startServer() {
    try {
        const server = new hapijs_starter_1.Server({ authEnabled: false });
        await server.registerAdditionalRoutes(provisioningRoutes_1.default);
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