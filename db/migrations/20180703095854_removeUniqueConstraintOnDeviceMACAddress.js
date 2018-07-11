exports.up = async knex => {
    await knex.schema.table('devices', t => {
        t.dropUnique('mac_address');
    });
};

exports.down = async knex => {
    await knex.schema.table('devices', t => {
        t.unique('mac_address');
    });
};
