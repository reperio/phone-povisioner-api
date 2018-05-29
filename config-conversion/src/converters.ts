import * as builder from 'xmlbuilder';
import {PropertyBuilder} from './propertyBuilder';

export function soundpointIPConverter(config: any) : string {
    let xml = builder.create({
        polycomConfig: {
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@xsi:noNamespaceSchemaLocation': 'polycomConfig.xsd',
            device: new PropertyBuilder()
                .tryAddProperty('device.prov', new PropertyBuilder()
                    .tryAddProperty('@device.prov.serverType', process.env.SERVER_TYPE)
                    .tryAddProperty('@device.prov.serverName', process.env.SERVER_NAME)
                    .tryAddBoolean('@device.prov.tagSerialNo', config.tagSerialNo)
                    .tryAddBoolean('@device.prov.ztpEnabled', config.ztpEnabled)
                    .tryAddProperty('device.prov.serverType', new PropertyBuilder()
                        .tryAddBoolean('@device.prov.serverType.set', process.env.SERVER_TYPE !== undefined)
                        .val()
                    )
                    .tryAddProperty('device.prov.serverName', new PropertyBuilder()
                        .tryAddBoolean('@device.prov.serverName.set', process.env.SERVER_NAME !== undefined)
                        .val()
                    )
                    .tryAddProperty('device.prov.tagSerialNo', new PropertyBuilder()
                        .tryAddBoolean('@device.prov.tagSerialNo.set', config.tagSerialNo !== undefined)
                        .val()
                    )
                    .tryAddProperty('device.prov.ztpEnabled', new PropertyBuilder()
                        .tryAddBoolean('@device.prov.ztpEnabled.set', config.ztpEnabled !== undefined)
                        .val()
                    )
                    .val()
                )
                .tryAddSetParameter()
                .val(),
            tcpIpApp: new PropertyBuilder()
                .tryAddProperty('@tcpIpApp.sntp.address', config.sntpAddress)
                .tryAddProperty('@tcpIpApp.sntp.gmtOffset', config.sntpGmtOffset)
                .tryAddProperty('@tcpIpApp.sntp.resyncPeriod', config.sntpResyncPeriod)
                .val(),
            dialplan: new PropertyBuilder()
                .tryAddProperty('@dialplan.digitmap', config.digitMap)
                .val(),
            feature: new PropertyBuilder()
                .tryAddBoolean('@feature.presence.enabled', config.presence)
                .tryAddBoolean('@feature.messaging.enabled', config.messaging)
                .tryAddBoolean('@feature.urlDialing.enabled', config.urlDialing)
                .val(),
            voice: new PropertyBuilder()
                .tryAddRank('@voice.codecPref.G711_A', config.codecPref, 'G711_A')
                .tryAddRank('@voice.codecPref.G711_Mu', config.codecPref, 'G711_Mu')
                .tryAddRank('@voice.codecPref.G722', config.codecPref, 'G722')
                .tryAddRank('@voice.codecPref.G7221.32kbps', config.codecPref, 'G7221.32kbps')
                .tryAddRank('@voice.codecPref.G7221_C.48kbps', config.codecPref, 'G7221_C.48kbps')
                .tryAddRank('@voice.codecPref.G729_AB', config.codecPref, 'G729_AB')
                .tryAddRank('@voice.codecPref.Siren14.48kbps', config.codecPref, 'Siren14.48kbps')
                .tryAddRank('@voice.codecPref.Siren22.64kbps', config.codecPref, 'Siren22.64kbps')
                .tryAddBoolean('@voice.vadEnable', config.vadEnable)
                .tryAddBoolean('@voice.vad.signalAnnexB', config.vadSignalAnnexB)
                .tryAddProperty('@voice.vadThresh', config.vadThresh)
                .tryAddBoolean('@voice.volume.persist.handset', config.volumePersistHandset)
                .tryAddBoolean('@voice.volume.persist.headset', config.volumePersistHeadset)
                .tryAddBoolean('@voice.volume.persist.handsfree', config.volumePersistHandsFree)
                .val(),
            msg: new PropertyBuilder()
                .tryAddProperty('@msg.mwi.1.callBackMode', config.mwi1_callBackMode)
                .tryAddProperty('@msg.mwi.1.callBack', config.mwi1_callBack)
                .tryAddProperty('@msg.mwi.2.callBackMode', config.mwi2_callBackMode)
                .tryAddProperty('@msg.mwi.2.callBack', config.mwi2_callBack)
                .tryAddProperty('@msg.mwi.3.callBackMode', config.mwi3_callBackMode)
                .tryAddProperty('@msg.mwi.3.callBack', config.mwi3_callBack)
                .tryAddProperty('@msg.mwi.4.callBackMode', config.mwi4_callBackMode)
                .tryAddProperty('@msg.mwi.4.callBack', config.mwi4_callBack)
                .tryAddProperty('@msg.mwi.5.callBackMode', config.mwi5_callBackMode)
                .tryAddProperty('@msg.mwi.5.callBack', config.mwi5_callBack)
                .tryAddProperty('@msg.mwi.6.callBackMode', config.mwi6_callBackMode)
                .tryAddProperty('@msg.mwi.6.callBack', config.mwi6_callBack)
                .tryAddBoolean('@msg.bypassInstantMessage', config.bypassInstantMessage)
                .val(),
            up: new PropertyBuilder()
                .tryAddBoolean('@up.oneTouchVoiceMail', config.oneTouchVoiceMail)
                .val(),
            call: new PropertyBuilder()
                .tryAddBoolean('@call.callWaiting.enable', config.callWaiting)
                .tryAddBoolean('@call.urlModeDialing', config.urlModeDialing)
                .val(),
            prov: new PropertyBuilder()
                .tryAddBoolean('@prov.polling.enabled', config.pollingEnabled)
                .tryAddProperty('@prov.polling.mode', config.pollingMode)
                .tryAddProperty('@prov.polling.period', config.pollingPeriod)
                .tryAddProperty('@prov.polling.time', config.pollingTime)
                .tryAddProperty('@prov.polling.timeRandomEnd', config.pollingTimeRandomEnd)
                .val()
        }
    }, {version: '1.0', encoding: 'UTF-8', standalone: true});

    return xml.end();
}