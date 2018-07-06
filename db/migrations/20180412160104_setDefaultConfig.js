exports.up = async knex => {
    const soundpointIPConfig = {
        digitMap: '*97|*0xxxx|911|9911|0T|011xxx.T|[0-1][2-9]xxxxxxxxx|[2-9]xxxxxxxxx|[2-9]xxxT|**x.T',
        tagSerialNo: true,
        oneTouchVoiceMail: true,
        ztpEnabled: false,
        presence: false,
        messaging: false,
        callWaiting: true,
        urlDialing: false,
        codecPref: ['G729_AB', 'G711_Mu'],
        mwi1_callBackMode: 'contact',
        mwi1_callBack: '*97',
        mwi2_callBackMode: 'contact',
        mwi2_callBack: '*97',
        mwi3_callBackMode: 'contact',
        mwi3_callBack: '*97',
        mwi4_callBackMode: 'contact',
        mwi4_callBack: '*97',
        mwi5_callBackMode: 'contact',
        mwi5_callBack: '*97',
        mwi6_callBackMode: 'contact',
        mwi6_callBack: '*97',
        pollingEnabled: true,
        pollingMode: 'rel',
        pollingPeriod: 3600,
        sntpAddress: '0.pool.ntp.org',
        sntpGmtOffset: -18000,
        sntpResyncPeriod: 3600,
        vadEnable: false,
        vadSignalAnnexB: true,
        vadThresh: 0,
        volumePersistHandset: true,
        volumePersistHeadset: true,
        volumePersistHandsFree: true,
    };

    const soundpointIP335Config = {
        urlModeDialing: false
    }

    const setConfigs = [
        knex('families')
            .where('id', '188a8ddd-9a57-4f45-aac2-effd96933039')
            .update({default_config: JSON.stringify(soundpointIPConfig)}),
        knex('models')
            .where('id', '1ceebd84-b735-4a90-ac51-854c7ac01b2c')
            .update({default_config: JSON.stringify(soundpointIP335Config)}),
    ];
    await Promise.all(setConfigs);
};

exports.down = async knex => {
    const oldConfig = {
        digitMap: '*97|*0xxxx|911|9911|0T|011xxx.T|[0-1][2-9]xxxxxxxxx|[2-9]xxxxxxxxx|[2-9]xxxT|**x.T',
        tagSerialNo: true,
        oneTouchVoiceMail: true,
        ztpEnabled: false,
        presence: false,
        messaging: false,
        callWaiting: true,
        urlModeDialing: false,
        urlDialing: false,
        codecPref: ['G729_AB', 'G711_Mu'],
        bypassInstantMessage: true,
        mwi1_callBackMode: 'contact',
        mwi1_callBack: '*97',
        mwi2_callBackMode: 'contact',
        mwi2_callBack: '*97',
        mwi3_callBackMode: 'contact',
        mwi3_callBack: '*97',
        mwi4_callBackMode: 'contact',
        mwi4_callBack: '*97',
        mwi5_callBackMode: 'contact',
        mwi5_callBack: '*97',
        mwi6_callBackMode: 'contact',
        mwi6_callBack: '*97',
        pollingEnabled: true,
        pollingMode: 'rel',
        pollingPeriod: 3600,
        sntpAddress: '0.pool.ntp.org',
        sntpGmtOffset: -18000,
        sntpResyncPeriod: 3600,
        vadEnable: false,
        vadSignalAnnexB: true,
        vadThresh: 0,
        volumePersistHandset: true,
        volumePersistHeadset: true,
        volumePersistHandsFree: true
    };

    const unsetConfigs = [
        knex('families')
            .where('id', '188a8ddd-9a57-4f45-aac2-effd96933039')
            .update({default_config: JSON.stringify(oldConfig)}),
        knex('models')
            .where('id', '1ceebd84-b735-4a90-ac51-854c7ac01b2c')
            .update({default_config: '{}'}),
    ];
    await Promise.all(unsetConfigs);
};