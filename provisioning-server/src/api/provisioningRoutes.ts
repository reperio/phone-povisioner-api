import {Request} from "hapi";
import {polycomConverter} from "../converters";

const routes: any[] = [
    {
        method: 'GET',
        path: '/polycom/soundpointip/330.cfg',
        handler: async (request: Request, h: any) => {
            const template = polycomConverter({
                digitMap: '*97|*0xxxx|911|9911|0T|011xxx.T|[0-1][2-9]xxxxxxxxx|[2-9]xxxxxxxxx|[2-9]xxxT|**x.T'
            });

            return h.response(template).header('Content-Type', 'text/xml');
        },
        config: {
            auth: false
        }
    }
];

export default routes;