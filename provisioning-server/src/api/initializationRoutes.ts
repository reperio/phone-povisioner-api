import {Request} from 'hapi';
import {readFileSync} from 'fs';

const routes : any[] = [
    {
        method: 'GET',
        path: '/000000000000.cfg',
        handler: async (request: Request, h: any) => {
            return readFileSync(`./static/000000000000.cfg`);
        },
        config: {
            auth: false
        }
    }
];

export default routes;