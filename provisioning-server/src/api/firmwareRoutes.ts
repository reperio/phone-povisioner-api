import {Request} from 'hapi';
import {readFileSync, existsSync} from 'fs';

const routes : any[] = [
    {
        method: 'GET',
        path: '/{model}.sip.ld',
        handler: async (request: Request, h: any) => {
            const file = `./static/firmware/${request.params.model}.sip.ld`;
            if(existsSync(file)) {
                return readFileSync(file);
            }
            return h.response().code(404);
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/{model}.bootrom.ld',
        handler: async (request: Request, h: any) => {
            return readFileSync(`./static/bootrom/${request.params.model}.bootrom.ld`); //Add actual file
        },
        config: {
            auth: false
        }
    }
];

export default routes;