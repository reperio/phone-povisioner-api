exports.up = async knex => {
    const soundpointIPConfig = {
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
        mwi1: {callBackMode: 'contact', callBack: '*97'},
        mwi2: {callBackMode: 'contact', callBack: '*97'},
        mwi3: {callBackMode: 'contact', callBack: '*97'},
        mwi4: {callBackMode: 'contact', callBack: '*97'},
        mwi5: {callBackMode: 'contact', callBack: '*97'},
        mwi6: {callBackMode: 'contact', callBack: '*97'},
        pollingEnabled: true,
        pollingMode: 'random',
        pollingPeriod: 86400,
        pollingTime: '1:00',
        pollingTimeRandomEnd: '5:00',
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

    const setConfigs = [
        knex('manufacturers')
            .where('id', 'fb6c87ee-5968-45f4-bf3e-0d82d812fec7')
            .update({default_config: '{}'}),
        knex('families')
            .where('id', '188a8ddd-9a57-4f45-aac2-effd96933039')
            .update({default_config: JSON.stringify(soundpointIPConfig)}),
        knex('models')
            .where('id', '646e4a66-823c-48fc-80e1-547cb5f67532')
            .orWhere('id', '1ceebd84-b735-4a90-ac51-854c7ac01b2c')
            .update({default_config: '{}'}),
    ];
    await Promise.all(setConfigs);
};

exports.down = async knex => {
    const unsetConfigs = [
        knex('manufacturers')
            .where('id', 'fb6c87ee-5968-45f4-bf3e-0d82d812fec7')
            .update({default_config: null}),
        knex('families')
            .where('id', '188a8ddd-9a57-4f45-aac2-effd96933039')
            .update({default_config: null}),
        knex('models')
            .where('id', '646e4a66-823c-48fc-80e1-547cb5f67532')
            .orWhere('id', '1ceebd84-b735-4a90-ac51-854c7ac01b2c')
            .update({default_config: null}),
    ];
    await Promise.all(unsetConfigs);
};