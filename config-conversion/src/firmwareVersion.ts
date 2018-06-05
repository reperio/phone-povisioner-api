export function firmwareVersion(config: any) {
    if(config.firmwareVersion === undefined || config.firmwareVersion === '') {
        return 'sip.ld';
    }
    return `${config.firmwareVersion}.sip.ld`
}
