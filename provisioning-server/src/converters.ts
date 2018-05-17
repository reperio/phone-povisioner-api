import * as builder from 'xmlbuilder';

export function polycomConverter(config: any) : string {
    let xml = builder.create({
        PHONE_CONFIG: {
            ALL: {
                '@dialplan.digitmap': config.digitMap
            }
        }
    });
    return xml.end();
}