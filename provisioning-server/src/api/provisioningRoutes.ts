import {Request} from 'hapi';
import {readFileSync} from 'fs';

const routes : Array<any> = [
    {
        method: 'GET',
        path: '/00000000.cfg',
        handler: async (request: Request, h: any) => {
            const template = `<?xml version="1.0" standalone="yes"?>
            <!-- Default Master SIP Configuration File-->
            <!-- For information on configuring Polycom VoIP phones please refer to the -->
            <!-- Configuration File Management white paper available from: -->
            <!-- http://www.polycom.com/common/documents/whitepapers/configuration_file_management_on_soundpoint_ip_phones.pdf -->
            <!-- $RCSfile$  $Revision: 155255 $ -->
            <APPLICATION APP_FILE_PATH="sip.ld" CONFIG_FILES="" MISC_FILES="" LOG_FILE_DIRECTORY="" OVERRIDES_DIRECTORY="" CONTACTS_DIRECTORY="" LICENSE_DIRECTORY="" USER_PROFILES_DIRECTORY="" CALL_LISTS_DIRECTORY="">
               <APPLICATION_SPIP300 APP_FILE_PATH_SPIP300="sip_213.ld" CONFIG_FILES_SPIP300="phone1.cfg"/>
               <APPLICATION_SPIP500 APP_FILE_PATH_SPIP500="sip_213.ld" CONFIG_FILES_SPIP500="phone1.cfg"/>
               <APPLICATION_SPIP301 APP_FILE_PATH_SPIP301="sip_318.ld" CONFIG_FILES_SPIP301="phone1.cfg"/>
               <APPLICATION_SPIP320 APP_FILE_PATH_SPIP320="sip_335.ld" CONFIG_FILES_SPIP320="phone1.cfg"/>
               <APPLICATION_SPIP330 APP_FILE_PATH_SPIP330="sip_335.ld" CONFIG_FILES_SPIP330="phone1.cfg"/>
               <APPLICATION_SPIP331 APP_FILE_PATH_SPIP331="2345-12365-001.sip.ld" CONFIG_FILES_SPIP331="phone1.cfg"/>
               <APPLICATION_SPIP335 APP_FILE_PATH_SPIP335="2345-12375-001.sip.ld" CONFIG_FILES_SPIP335="phone1.cfg"/>
               <APPLICATION_SPIP430 APP_FILE_PATH_SPIP430="sip_327.ld" CONFIG_FILES_SPIP430="phone1.cfg"/>
               <APPLICATION_SPIP501 APP_FILE_PATH_SPIP501="sip_318.ld" CONFIG_FILES_SPIP501="phone1.cfg"/>
               <APPLICATION_SPIP600 APP_FILE_PATH_SPIP600="sip_318.ld" CONFIG_FILES_SPIP600="phone1.cfg"/>
               <APPLICATION_SPIP601 APP_FILE_PATH_SPIP601="sip_318.ld" CONFIG_FILES_SPIP601="phone1.cfg"/>
               <APPLICATION_SSIP4000 APP_FILE_PATH_SSIP4000="sip_318.ld" CONFIG_FILES_SSIP4000="phone1.cfg"/>
               <APPLICATION_SSIP6000 APP_FILE_PATH_SSIP6000="3111-15600-001.sip.ld" CONFIG_FILES_SSIP6000="phone1.cfg"/>
            </APPLICATION> `;

            return h.response(template).header('Content-Type', 'text/xml');
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/phone1.cfg',
        handler: async (request: Request, h: any) => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <PHONE_CONFIG>
                    <ALL
                            prov.polling.enabled = "1"
                            prov.polling.mode = "random"
                            prov.polling.period = "86400"
                            prov.polling.time = "01:00"
                            prov.polling.timeRandomEnd = "05:00"
                    device.prov.tagSerialNo = "1"
                            device.prov.ztpEnabled="0"
                            dialplan.digitmap="*97|*0xxxx|911|9911|0T|011xxx.T|[0-1][2-9]xxxxxxxxx|[2-9]xxxxxxxxx|[2-9]xxxT|**x.T"
                            msg.mwi.1.callBackMode="contact"
                            msg.mwi.2.callBackMode="contact"
                            msg.mwi.3.callBackMode="contact"
                            msg.mwi.4.callBackMode="contact"
                            msg.mwi.5.callBackMode="contact"
                            msg.mwi.6.callBackMode="contact"
                            msg.bypassInstantMessage="1"
                            msg.mwi.1.callBack="*97"
                            msg.mwi.2.callBack="*97"
                            msg.mwi.3.callBack="*97"
                            msg.mwi.4.callBack="*97"
                            msg.mwi.5.callBack="*97"
                            msg.mwi.6.callBack="*97"
                            call.callWaiting.enable="1"
                            call.urlModeDialing="0"
                            feature.messaging.enabled="0"
                            feature.presence.enabled="0"
                            feature.urlDialing.enabled="0"
                            voice.vadEnable="0"
                            voice.vad.signalAnnexB="1"
                            voice.vadThresh="0"
                            voice.volume.persist.handset="1"
                            voice.volume.persist.headset="1"
                            voice.volume.persist.handsfree="1"
                            voice.codecPref.G711_A="0"
                            voice.codecPref.G711_Mu="2"
                            voice.codecPref.G722="0"
                            voice.codecPref.G7221.32kbps="0"
                            voice.codecPref.G7221_C.48kbps="0"
                            voice.codecPref.G729_AB="1"
                            voice.codecPref.Siren14.48kbps="0"
                            voice.codecPref.Siren22.64kbps="0"
                            up.oneTouchVoiceMail="1"
                            tcpIpApp.sntp.address="0.pool.ntp.org"
                            tcpIpApp.sntp.gmtOffset="-18000"
                            tcpIpApp.sntp.resyncPeriod="3600"
                    />
            </PHONE_CONFIG>
            `;

            return h.response(template).header('Content-Type', 'text/xml');
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/{model}.sip.ld',
        handler: async (request: Request, h: any) => {
            return readFileSync(`./static/${request.params.model}.sip.ld`);
        },
        config: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/{model}.bootrom.ld',
        handler: async (request: Request, h: any) => {
            return readFileSync(`./static/${request.params.model}.bootrom.ld`); //Add actual file
        },
        config: {
            auth: false
        }
    }
];

export default routes;