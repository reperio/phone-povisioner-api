const MACRegex = /(?<=\(SN:)[0-9a-f]{12}(?=\))/;

export function parseUserAgentHeader(userAgent: string) : UserAgentData {
    let [transportType, deviceInfo, macAddress, type] = userAgent.split(' ');
    let [model, firmwareVersion] = deviceInfo.split('/');

    const applicationTag = modelNameToApplicationTag(model);
    model = modelNameToID(model);
    macAddress = parseMacAddress(macAddress);

    return {
        transportType,
        model,
        firmwareVersion,
        macAddress,
        type,
        applicationTag
    }
}

export class UserAgentData {
    transportType: string;
    model: string;
    firmwareVersion: string;
    macAddress: string;
    type: string;
    applicationTag: string;
}

function modelNameToID(model: string) {
    switch(model) {
        case 'PolycomSoundPointIP-SPIP_335-UA':
            return '1ceebd84-b735-4a90-ac51-854c7ac01b2c';
        default:
            return undefined;
    }
}

function modelNameToApplicationTag(model: string) {
    switch(model) {
        case 'PolycomSoundPointIP-SPIP_335-UA':
            return 'SPIP335';
        default:
            return undefined;
    }
}

function parseMacAddress(macAddress: string) {
    const address = MACRegex.exec(macAddress);
    if(address.length === 0) {
        return undefined;
    }
    const a = address[0];
    return `${a[0]}${a[1]}:${a[2]}${a[3]}:${a[4]}${a[5]}:${a[6]}${a[7]}:${a[8]}${a[9]}:${a[10]}${a[11]}`;
}