
exports.up = async knex => {
    const tables = [
        knex.schema.createTable('manufacturers', t => {
            t.uuid('id')
            .notNullable()
            .primary();
    t.text('name');
    t.text('config');
}),
    knex.schema.createTable('families', t => {
        t.uuid('id')
        .notNullable()
        .primary();
    t.uuid('manufacturer')
        .notNullable();
    t.text('name');
    t.text('config');
}),
    knex.schema.createTable('models', t => {
        t.uuid('id')
        .notNullable()
        .primary();
    t.uuid('family')
        .notNullable();
    t.text('name');
    t.text('config');
})
];
    await Promise.all(tables);
};

exports.down = async knex => {
    const tables = [
        knex.schema.dropTableIfExists('manufacturers'),
        knex.schema.dropTableIfExists('families'),
        knex.schema.dropTableIfExists('models'),
    ];
    await Promise.all(tables);
};