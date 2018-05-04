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
    pollingMode: 'random',
    pollingPeriod: 86400,
    pollingTime: '01:00',
    pollingTimeRandomEnd: '05:00',
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

exports.up = async knex => {
    await knex.schema.createTable('organizations', t => {
        t.text('id')
            .notNullable()
            .unique()
            .primary();
        t.boolean('is_global_organization')
            .defaultTo(false)
            .notNullable();
        t.text('name');
    });

    await knex('organizations').insert({
        id: '0',
        is_global_organization: true,
        name: 'Global'
    });

    await knex.schema.createTable('configs', t => {
        t.text('organization')
            .notNullable();
        t.foreign('organization')
            .references('organizations.id');
        t.uuid('manufacturer');
        t.foreign('manufacturer')
            .references('manufacturers.id');
        t.uuid('family');
        t.foreign('family')
            .references('families.id');
        t.uuid('model');
        t.foreign('model')
            .references('models.id');
        t.text('properties')
            .notNullable();
        t.unique(['organization', 'manufacturer']);
        t.unique(['organization', 'family']);
        t.unique(['organization', 'model']);
    });

    const newColumnsAndConfigs = [
        knex.schema.table('manufacturers', t => {
            t.dropColumn('default_config');
            t.dropColumn('config');
        }),
        knex.schema.table('families', t => {
            t.dropColumn('default_config');
            t.dropColumn('config');
            t.foreign('manufacturer')
                .references('manufacturers.id');
        }),
        knex.schema.table('models', t => {
            t.dropColumn('default_config');
            t.dropColumn('config');
            t.foreign('family')
                .references('families.id');
        }),
        knex('configs').insert([
            {
                organization: 0,
                manufacturer: 'fb6c87ee-5968-45f4-bf3e-0d82d812fec7',
                properties: '{}'
            },
            {
                organization: 0,
                family: '188a8ddd-9a57-4f45-aac2-effd96933039',
                properties: JSON.stringify(soundpointIPConfig)
            },
            {
                organization: 0,
                model: '646e4a66-823c-48fc-80e1-547cb5f67532',
                properties: '{}'
            },
            {
                organization: 0,
                model: '1ceebd84-b735-4a90-ac51-854c7ac01b2c',
                properties: JSON.stringify(soundpointIP335Config)
            }
        ]),
        knex('manufacturers')
            .where('id', 'fb6c87ee-5968-45f4-bf3e-0d82d812fec7')
            .update({component_name: 'polycomConfig'}),
        knex('families')
            .where('id', '188a8ddd-9a57-4f45-aac2-effd96933039')
            .update({component_name: 'soundpointIPConfig'}),
        knex('models')
            .where('id', '1ceebd84-b735-4a90-ac51-854c7ac01b2c')
            .update({component_name: 'soundpointIP335Config'}),
        knex('models')
            .where('id', '646e4a66-823c-48fc-80e1-547cb5f67532')
            .update({component_name: 'soundpointIP330Config'})
    ];

    await Promise.all(newColumnsAndConfigs);
};

exports.down = async knex => {
    const restoreColumns = [
        knex.schema.table('manufacturers', t => {
            t.text('default_config');
            t.text('config');
        }),
        knex.schema.table('families', t => {
            t.text('default_config');
            t.text('config');
            t.dropForeign('manufacturer');
        }),
        knex.schema.table('models', t => {
            t.text('default_config');
            t.text('config');
            t.dropForeign('family');
        })
    ];

    const setDefaultConfigs = [
        knex('manufacturers')
            .where('id', 'fb6c87ee-5968-45f4-bf3e-0d82d812fec7')
            .update({default_config: '{}', config: '{}'}),
        knex('families')
            .where('id', '188a8ddd-9a57-4f45-aac2-effd96933039')
            .update({default_config: JSON.stringify(soundpointIPConfig), config: '{}'}),
        knex('models')
            .where('id', '1ceebd84-b735-4a90-ac51-854c7ac01b2c')
            .update({default_config: JSON.stringify(soundpointIP335Config), config: '{}'}),
        knex('models')
            .where('id', '646e4a66-823c-48fc-80e1-547cb5f67532')
            .update({default_config: '{}', config: '{}'})
    ];

    await Promise.all(restoreColumns);
    await knex.schema.dropTable('configs');
    await knex.schema.dropTable('organizations');
    await Promise.all(setDefaultConfigs);
};