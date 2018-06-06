import * as assert from 'assert';
import {parseUserAgentHeader, UserAgentData} from "../src/utils/parseUserAgentHeader";

describe('parseUserAgentHeader', () => {
    it('parses a user agent header from a Polycom Soundpoint IP 335 phone.', () => {
        const userAgent = 'FileTransport PolycomSoundPointIP-SPIP_335-UA/4.0.13.1445 (SN:0004f249d83f) Type/Application';
        const info = parseUserAgentHeader(userAgent);

        assert.equal(info.transportType, 'FileTransport');
        assert.equal(info.model, '1ceebd84-b735-4a90-ac51-854c7ac01b2c');
        assert.equal(info.firmwareVersion, '4.0.13.1445');
        assert.equal(info.macAddress, '00:04:f2:49:d8:3f');
        assert.equal(info.type, 'Type/Application');
    });
});