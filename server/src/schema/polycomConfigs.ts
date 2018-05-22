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

}

export const soundpointIP331Config: SchemaMap = {
    urlModeDialing: bool()
}

export const soundpointIP335Config: SchemaMap = {
    urlModeDialing: bool()
}

export const soundpointIP670Config: SchemaMap = {
    bypassInstantMessage: bool()
}

export const soundpointIP6000Config: SchemaMap = {
    bypassInstantMessage: bool()
}