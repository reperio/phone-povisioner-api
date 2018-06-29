import {ObjectSchema, SchemaMap, object, string, bool, array, number} from 'joi';
import {possibleCodecPrefValues, possibleCallBackModeValues, possibleTransportValues} from "./possibleListValues";

const timeRegex = /^\d?\d:\d\d$/;

export const polycomConfig: SchemaMap = {
    firmwareVersion: string().allow('')
};

export const soundpointIPConfig: SchemaMap = {
    digitMap: string().allow(''),
    tagSerialNo: bool(),
    oneTouchVoiceMail: bool(),
    ztpEnabled: bool(),
    presence: bool(),
    messaging: bool(),
    callWaiting: bool(),
    urlDialing: bool(),
    codecPref: array().items(string().valid(possibleCodecPrefValues)),
    mwi1_callBackMode: string().valid(possibleCallBackModeValues),
    mwi1_callBack: string().allow(''),
    mwi2_callBackMode: string().valid(possibleCallBackModeValues),
    mwi2_callBack: string().allow(''),
    mwi3_callBackMode: string().valid(possibleCallBackModeValues),
    mwi3_callBack: string().allow(''),
    mwi4_callBackMode: string().valid(possibleCallBackModeValues),
    mwi4_callBack: string().allow(''),
    mwi5_callBackMode: string().valid(possibleCallBackModeValues),
    mwi5_callBack: string().allow(''),
    mwi6_callBackMode: string().valid(possibleCallBackModeValues),
    mwi6_callBack: string().allow(''),
    pollingEnabled: bool(),
    pollingMode: string().valid(['abs', 'rel', 'random']),
    pollingPeriod: number().integer().min(1),
    pollingTime: string().allow('').regex(timeRegex),
    pollingTimeRandomEnd: string().allow('').regex(timeRegex),
    sntpAddress: string().allow(''),
    sntpGmtOffset: number().integer(),
    sntpResyncPeriod: number().integer().min(1),
    vadEnable: bool(),
    vadSignalAnnexB: bool(),
    vadThresh: number().integer().min(0).max(30),
    volumePersistHandset: bool(),
    volumePersistHeadset: bool(),
    volumePersistHandsFree: bool()
}

export const soundpointIP330Config: SchemaMap = {
    reg1Address: string().allow(''),
    reg2Address: string().allow(''),
    reg1Transport: string().valid(possibleTransportValues),
    reg2Transport: string().valid(possibleTransportValues),
    reg1Port: number().integer().min(0).max(65535),
    reg2Port: number().integer().min(0).max(65535),
    reg1Expires: number().integer().min(10),
    reg2Expires: number().integer().min(10),
    reg1Overlap: number().integer().min(5).max(65535),
    reg2Overlap: number().integer().min(5).max(65535)
}

export const soundpointIP331Config: SchemaMap = {
    urlModeDialing: bool(),
    reg1Address: string().allow(''),
    reg2Address: string().allow(''),
    reg1Transport: string().valid(possibleTransportValues),
    reg2Transport: string().valid(possibleTransportValues),
    reg1Port: number().integer().min(0).max(65535),
    reg2Port: number().integer().min(0).max(65535),
    reg1Expires: number().integer().min(10),
    reg2Expires: number().integer().min(10),
    reg1Overlap: number().integer().min(5).max(65535),
    reg2Overlap: number().integer().min(5).max(65535)
}

export const soundpointIP335Config: SchemaMap = {
    urlModeDialing: bool(),
    reg1Address: string().allow(''),
    reg2Address: string().allow(''),
    reg1Transport: string().valid(possibleTransportValues),
    reg2Transport: string().valid(possibleTransportValues),
    reg1Port: number().integer().min(0).max(65535),
    reg2Port: number().integer().min(0).max(65535),
    reg1Expires: number().integer().min(10),
    reg2Expires: number().integer().min(10),
    reg1Overlap: number().integer().min(5).max(65535),
    reg2Overlap: number().integer().min(5).max(65535)
}

let spip670: SchemaMap = {
    bypassInstantMessage: bool()
}
for(let i = 1; i <= 34; i++) {
    spip670[`reg${i}Address`] = string().allow('');
    spip670[`reg${i}Transport`] = string().valid(possibleTransportValues);
    spip670[`reg${i}Port`] = number().integer().min(0).max(65535);
    spip670[`reg${i}Expires`] = number().integer().min(10);
    spip670[`reg${i}Overlap`] = number().integer().min(5).max(65535);
}
export const soundpointIP670Config: SchemaMap = spip670;

export const soundpointIP6000Config: SchemaMap = {
    bypassInstantMessage: bool()
}