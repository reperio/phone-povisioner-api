exports.addManufacturer = async (knex, id, name, componentName, defaultConfig) => {
    //Add manufacturer
    await knex('manufacturers').insert({
        id,
        name,
        component_name: componentName
    });
    //Add config page for each organization
    const orgs = await knex.select().table('organizations');
    await knex('configs').insert(orgs.map(o => ({
        organization: o.id,
        manufacturer: id,
        family: null,
        model: null,
        properties: o.type === 'normal' ? '{}' : defaultConfig
    })));
}

exports.addFamily = async (knex, id, name, componentName, defaultConfig, manufacturer) => {
    //Add family
    await knex('families').insert({
        id,
        name,
        manufacturer,
        component_name: componentName
    });
    //Add config page for each organization
    const orgs = await knex.select().table('organizations');
    await knex('configs').insert(orgs.map(o => ({
        organization: o.id,
        manufacturer: null,
        family: id,
        model: null,
        properties: o.type === 'normal' ? '{}' : defaultConfig
    })));
}

exports.addModel = async (knex, id, name, componentName, defaultConfig, family) => {
    //Add model
    await knex('models').insert({
        id,
        name,
        family,
        component_name: componentName
    });
    //Add config page for each organization
    const orgs = await knex.select().table('organizations');
    await knex('configs').insert(orgs.map(o => ({
        organization: o.id,
        manufacturer: null,
        family: null,
        model: id,
        properties: o.type === 'normal' ? '{}' : defaultConfig
    })));
}

exports.removeManufacturer = async (knex, id) => {
    await knex('configs')
        .where('manufacturer', 'id')
        .del();
    await knex('manufacturers')
        .where('id', id)
        .del();
}

exports.removeFamily = async (knex, id) => {
    await knex('configs')
        .where('family', 'id')
        .del();
    await knex('families')
        .where('id', id)
        .del();
}

exports.removeModel = async (knex, id) => {
    await knex('configs')
        .where('model',  id)
        .del();
    await knex('models')
        .where('id', id)
        .del();
}