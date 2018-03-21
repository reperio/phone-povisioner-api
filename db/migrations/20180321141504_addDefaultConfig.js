exports.up = async knex => {
    const newColumns = [
        knex.schema.table('manufacturers', t => {
            t.text('default_config');
        }),
        knex.schema.table('families', t => {
            t.text('default_config');
        }),
        knex.schema.table('models', t => {
            t.text('default_config');
        })
    ];
    await Promise.all(newColumns);
};

exports.down = async knex => {
    const deleteColumns = [
        knex.schema.table('manufacturers', t => {
            t.dropColumn('default_config');
        }),
        knex.schema.table('families', t => {
            t.dropColumn('default_config');
        }),
        knex.schema.table('models', t => {
            t.dropColumn('default_config');
        })
    ]
    await Promise.all(deleteColumns);
};