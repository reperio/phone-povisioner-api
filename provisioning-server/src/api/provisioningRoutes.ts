import {Request} from "hapi";
import {soundpointIPConverter, getModelIDFromPath} from "../../../config-conversion";

const routes: any[] = [
    {
        method: 'GET',
        path: '/{manufacturer}/{family}/{model}.cfg',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching config. Raw params:\n${JSON.stringify(request.params)}`);

            try {
                const model = getModelIDFromPath(request.params);
                if(model === null) {
                    return h.response().code(404);
                }

                const config = await uow.configurationRepository.composeBaseConfig(model, '1');
                logger.debug(`Composed config: ${JSON.stringify(config)}`);

                const template = soundpointIPConverter(config);

                return h.response(template).header('Content-Type', 'text/xml');
            } catch(e) {
                return h.response().code(500);
            }
        },
        config: {
            auth: false
        }
    }
];

export default routes;