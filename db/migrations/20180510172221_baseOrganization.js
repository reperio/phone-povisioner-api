const soundpointIPConfig = {
    tagSerialNo: true,
    ztpEnabled: false,
    pollingEnabled: true,
    pollingMode: 'rel',
    pollingPeriod: 3600,
    sntpAddress: '0.pool.ntp.org',
    sntpGmtOffset: -18000,
    sntpResyncPeriod: 3600,
};

const soundpointIP335Config = {
    urlModeDialing: false
}

exports.up = async knex => {
    await knex.schema.table('organizations', t => {
        t.dropColumn('is_global_organization');
        t.enum('type', ['normal', 'global', 'base'])
            .notNullable()
            .defaultTo('normal');
    });
    await knex('organizations').insert({
        id: '1',
        type: 'base',
        enabled: true,
        name: 'Base'
    });
    await knex('organizations')
        .where('id', '0')
        .update({type: 'global'});
    await knex('configs').insert([
        {
            organization: '1',
            manufacturer: 'fb6c87ee-5968-45f4-bf3e-0d82d812fec7',
            properties: '{}'
        },
        {
            organization: '1',
            family: '188a8ddd-9a57-4f45-aac2-effd96933039',
            properties: JSON.stringify(soundpointIPConfig)
        },
        {
            organization: '1',
            model: '646e4a66-823c-48fc-80e1-547cb5f67532',
            properties: '{}'
        },
        {
            organization: '1',
            model: '1ceebd84-b735-4a90-ac51-854c7ac01b2c',
            properties: JSON.stringify(soundpointIP335Config)
        }
    ]);
};

exports.down = async knex => {
    await knex.schema.table('organizations', t => {
        t.dropColumn('type');
        t.boolean('is_global_organization')
            .defaultTo(false)
            .notNullable();
    });
    await knex('configs')
        .where('organization', '1')
        .del();
    await knex('organizations')
        .where('id', '1')
        .del();
    await knex('organizations')
        .where('id', '0')
        .update({is_global_organization: true});
};