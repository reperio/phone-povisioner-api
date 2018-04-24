import {Request} from 'hapi';
import {readFileSync} from 'fs';

const routes = [
    {
        method: 'GET',
        path: '/00000000.cfg',
        handler: async (request: Request, h: any) => {
            return readFileSync('./static/00000000.cfg');
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/phone1.cfg',
        handler: async (request: Request, h: any) => {
            return readFileSync('./static/phone1.cfg');
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/{model}.sip.ld',
        handler: async (request: Request, h: any) => {
            return readFileSync('./static/2345-12375-001.sip.ld');
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/{model}.bootrom.ld',
        handler: async (request: Request, h: any) => {
            return readFileSync('./static/2345-12375-001.bootrom.ld'); //Add actual file
        },
        config: {
            auth: false
        }
    }
];

export default routes;