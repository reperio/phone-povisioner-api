"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const routes = [
    {
        method: 'GET',
        path: '/00000000.cfg',
        handler: async (request, h) => {
            return fs_1.readFileSync('./static/00000000.cfg');
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/phone1.cfg',
        handler: async (request, h) => {
            return fs_1.readFileSync('./static/phone1.cfg');
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/{model}.sip.ld',
        handler: async (request, h) => {
            return fs_1.readFileSync('./static/2345-12375-001.sip.ld');
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/{model}.bootrom.ld',
        handler: async (request, h) => {
            return fs_1.readFileSync('./static/2345-12375-001.bootrom.ld'); //Add actual file
        },
        config: {
            auth: false
        }
    }
];
exports.default = routes;
//# sourceMappingURL=provisioningRoutes.js.map