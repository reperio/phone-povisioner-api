const {addModel, removeModel} = require('./utils/configPages');

exports.up = async knex => {
    const modelsToAdd = [
        addModel(knex, '2a84e406-83c3-427f-95ef-4f19261e05c0', '331', 'soundpointIP331Config', '{"urlModeDialing": true}', '188a8ddd-9a57-4f45-aac2-effd96933039'),
        addModel(knex, 'bf3195ab-b348-474d-9dc6-6a6eee2d8e77', '670', 'soundpointIP670Config', '{"bypassInstantMessage": true}', '188a8ddd-9a57-4f45-aac2-effd96933039'),
        addModel(knex, '480408af-57cb-4c74-b86f-9bf1a6ce82e9', '6000', 'soundpointIP6000Config', '{"bypassInstantMessage": true}', '188a8ddd-9a57-4f45-aac2-effd96933039')
    ]
    await Promise.all(modelsToAdd);
};

exports.down = async knex => {
    const modelsToRemove = [
        removeModel(knex, '2a84e406-83c3-427f-95ef-4f19261e05c0'),
        removeModel(knex, 'bf3195ab-b348-474d-9dc6-6a6eee2d8e77'),
        removeModel(knex, '480408af-57cb-4c74-b86f-9bf1a6ce82e9')
    ]
    await Promise.all(modelsToRemove);
};
