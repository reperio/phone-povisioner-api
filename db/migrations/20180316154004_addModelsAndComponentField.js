exports.up = async knex => {
    const newColumns = [
        knex.schema.table('manufacturers', t => {
            t.text('component_name');
        }),
        knex.schema.table('families', t => {
            t.text('component_name');
        }),
        knex.schema.table('models', t => {
            t.text('component_name');
        })
    ];
    const newRows = [ //Can't add row until new column is added
        knex('manufacturers').insert({
            id: 'fb6c87ee-5968-45f4-bf3e-0d82d812fec7',
            name: 'Polycom',
            config: '{}',
            component_name: 'PolycomConfig'
        }),
        knex('families').insert({
            id: '188a8ddd-9a57-4f45-aac2-effd96933039',
            manufacturer: 'fb6c87ee-5968-45f4-bf3e-0d82d812fec7',
            name: 'Soundpoint IP',
            config: '{}',
            component_name: 'SoundpointIPConfig'
        }),
        knex('models').insert({
            id: '646e4a66-823c-48fc-80e1-547cb5f67532',
            family: '188a8ddd-9a57-4f45-aac2-effd96933039',
            name: '330',
            config: '{}',
            component_name: 'SoundpointIP330Config'
        }),
        knex('models').insert({
            id: '1ceebd84-b735-4a90-ac51-854c7ac01b2c',
            family: '188a8ddd-9a57-4f45-aac2-effd96933039',
            name: '335',
            config: '{}',
            component_name: 'SoundpointIP335Config'
        })
    ];
    await Promise.all(newColumns);
    await Promise.all(newRows);
};

exports.down = async knex => {
    const deleteRows = [
        knex('manufacturers')
            .where({id: 'fb6c87ee-5968-45f4-bf3e-0d82d812fec7'})
            .del(),
        knex('families')
            .where({id: '188a8ddd-9a57-4f45-aac2-effd96933039'})
            .del(),
        knex('models')
            .where({id: '646e4a66-823c-48fc-80e1-547cb5f67532'})
            .orWhere({id: '1ceebd84-b735-4a90-ac51-854c7ac01b2c'})
            .del()
    ];
    const deleteColumns = [
        knex.schema.table('manufacturers', t => {
            t.dropColumn('component_name');
        }),
        knex.schema.table('families', t => {
            t.dropColumn('component_name');
        }),
        knex.schema.table('models', t => {
            t.dropColumn('component_name');
        })
    ]
    await Promise.all(deleteRows);
    await Promise.all(deleteColumns);
};