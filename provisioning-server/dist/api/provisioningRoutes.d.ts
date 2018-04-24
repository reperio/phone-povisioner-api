/// <reference types="node" />
import { Request } from 'hapi';
declare const routes: {
    method: string;
    path: string;
    handler: (request: Request, h: any) => Promise<Buffer>;
    config: {
        auth: boolean;
    };
}[];
export default routes;
