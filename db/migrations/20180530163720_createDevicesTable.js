exports.up = async knex => {
    await knex.schema.createTable('devices', t => {
        t.string('mac_address')
            .notNullable()
            .unique();
        t.string('organization')
            .references('organizations.id');
        t.uuid('model')
            .references('models.id')
            .notNullable();
        t.string('firmware_version')
            .notNullable();
        t.string('name');
        t.enum('status', ['initial', 'adopted', 'given_credentials', 'provisioned'])
            .notNullable();
        t.uuid('kazoo_id')
            .unique();
        t.string('user')
            .unique();
        t.string('password');
        t.dateTime('activated_temp_url');
    });
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists('devices');
};
