"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converters_1 = require("../converters");
const routes = [
    {
        method: 'GET',
        path: '/polycom/soundpointip/330.cfg',
        handler: async (request, h) => {
            const template = converters_1.polycomConverter({
                digitMap: '*97|*0xxxx|911|9911|0T|011xxx.T|[0-1][2-9]xxxxxxxxx|[2-9]xxxxxxxxx|[2-9]xxxT|**x.T'
            });
            return h.response(template).header('Content-Type', 'text/xml');
        },
        config: {
            auth: false
        }
    }
];
exports.default = routes;
//# sourceMappingURL=provisioningRoutes.js.map