import {Request} from 'hapi';

const routes = [
    {
        method: 'GET',
        path: '/test3',
        handler: async (req: Request, h: any) => {
            return {test: 'This is in a different file.'};
        }
    }
];

export default routes;