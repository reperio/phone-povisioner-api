import {ObjectSchema, SchemaMap, object, string, bool, array, number} from 'joi';
import {possibleCodecPrefValues, possibleCallBackModeValues} from "./possibleListValues";

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
    codecPref: array().items(string().allow('').valid(possibleCodecPrefValues)),
    mwi1_callBackMode: string().allow('').valid(possibleCallBackModeValues),
    mwi1_callBack: string().allow(''),
    mwi2_callBackMode: string().allow('').valid(possibleCallBackModeValues),
    mwi2_callBack: string().allow(''),
    mwi3_callBackMode: string().allow('').valid(possibleCallBackModeValues),
    mwi3_callBack: string().allow(''),
    mwi4_callBackMode: string().allow('').valid(possibleCallBackModeValues),
    mwi4_callBack: string().allow(''),
    mwi5_callBackMode: string().allow('').valid(possibleCallBackModeValues),
    mwi5_callBack: string().allow(''),
    mwi6_callBackMode: string().allow('').valid(possibleCallBackModeValues),
    mwi6_callBack: string().allow(''),
    pollingEnabled: bool(),
    pollingMode: string().allow('').valid(['abs', 'rel', 'random']),
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
    reg1Address: string(),
    reg2Address: string(),
    reg1Transport: string(),
    reg2Transport: string(),
    reg1Port: number(),
    reg2Port: number(),
    reg1Expires: number(),
    reg2Expires: number(),
    reg1Overlap: number(),
    reg2Overlap: number()
}

export const soundpointIP331Config: SchemaMap = {
    urlModeDialing: bool(),
    reg1Address: string(),
    reg2Address: string(),
    reg1Transport: string(),
    reg2Transport: string(),
    reg1Port: number(),
    reg2Port: number(),
    reg1Expires: number(),
    reg2Expires: number(),
    reg1Overlap: number(),
    reg2Overlap: number()
}

export const soundpointIP335Config: SchemaMap = {
    urlModeDialing: bool(),
    reg1Address: string(),
    reg2Address: string(),
    reg1Transport: string(),
    reg2Transport: string(),
    reg1Port: number(),
    reg2Port: number(),
    reg1Expires: number(),
    reg2Expires: number(),
    reg1Overlap: number(),
    reg2Overlap: number()
}

let spip670: SchemaMap = {
    bypassInstantMessage: bool()
}
for(let i = 1; i <= 34; i++) {
    spip670[`reg${i}Address`] = string();
    spip670[`reg${i}Transport`] = string();
    spip670[`reg${i}Port`] = number();
    spip670[`reg${i}Expires`] = number();
    spip670[`reg${i}Overlap`] = number();
}
export const soundpointIP670Config: SchemaMap = spip670;

export const soundpointIP6000Config: SchemaMap = {
    bypassInstantMessage: bool()
}