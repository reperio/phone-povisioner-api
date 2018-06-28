exports.up = async knex => {
    await knex.schema.table('organizations', t => {
        t.text('realm');
    });
};

exports.down = async knex => {
    await knex.schema.table('organizations', t => {
        t.dropColumn('realm');
    });
};
