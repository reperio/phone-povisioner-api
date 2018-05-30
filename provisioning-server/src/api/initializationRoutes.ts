import {Request} from 'hapi';
import * as builder from 'xmlbuilder';

function firmwareVersion(config: any) {
    if(config.firmwareVersion === undefined || config.firmwareVersion === '') {
        return 'sip.ld';
    }
    return `${config.firmwareVersion}.sip.ld`
}

const routes : any[] = [
    {
        method: 'GET',
        path: '/000000000000.cfg',
        handler: async (request: Request, h: any) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug('Fetching 000000000000.cfg')

            let xml = builder.create({
                APPLICATION: {
                    '@APP_FILE_PATH': 'sip.ld',
                    '@CONFIG_FILES': '',
                    '@MISC_FILES': '',
                    '@LOG_FILE_DIRECTORY': '',
                    '@OVERRIDES_DIRECTORY': '',
                    '@LICENSE_DIRECTORY': '',
                    APPLICATION_SPIP330: {
                        '@APP_FILE_PATH_SPIP330': firmwareVersion(
                            await uow.configurationRepository.composeBaseConfig('646e4a66-823c-48fc-80e1-547cb5f67532', '1')
                        ),
                        '@CONFIG_FILES_SPIP330': '/polycom/soundpointip/330.cfg'
                    },
                    APPLICATION_SPIP331: {
                        '@APP_FILE_PATH_SPIP331': firmwareVersion(
                            await uow.configurationRepository.composeBaseConfig('2a84e406-83c3-427f-95ef-4f19261e05c0', '1')
                        ),
                        '@CONFIG_FILES_SPIP331': '/polycom/soundpointip/331.cfg'
                    },
                    APPLICATION_SPIP335: {
                        '@APP_FILE_PATH_SPIP335': firmwareVersion(
                            await uow.configurationRepository.composeBaseConfig('1ceebd84-b735-4a90-ac51-854c7ac01b2c', '1')
                        ),
                        '@CONFIG_FILES_SPIP335': '/polycom/soundpointip/335.cfg'
                    },
                    APPLICATION_SPIP670: {
                        '@APP_FILE_PATH_SPIP670': firmwareVersion(
                            await uow.configurationRepository.composeBaseConfig('bf3195ab-b348-474d-9dc6-6a6eee2d8e77', '1')
                        ),
                        '@CONFIG_FILES_SPIP670': '/polycom/soundpointip/670.cfg'
                    },
                    APPLICATION_SPIP6000: {
                        '@APP_FILE_PATH_SPIP6000': firmwareVersion(
                            await uow.configurationRepository.composeBaseConfig('480408af-57cb-4c74-b86f-9bf1a6ce82e9', '1')
                        ),
                        '@CONFIG_FILES_SPIP6000': '/polycom/soundpointip/6000.cfg'
                    }
                }
            },{version: '1.0', standalone: true});

            return h.response(xml.end()).header('Content-Type', 'text/xml');
        },
        config: {
            auth: false
        }
    }
];

export default routes;