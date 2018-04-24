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
    }
];

export default routes;