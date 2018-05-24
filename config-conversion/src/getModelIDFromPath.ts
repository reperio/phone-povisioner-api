const modelIDs: any = {
    polycom: {
        soundpointip: {
            '330': '646e4a66-823c-48fc-80e1-547cb5f67532',
            '335': '1ceebd84-b735-4a90-ac51-854c7ac01b2c',
            '331': '2a84e406-83c3-427f-95ef-4f19261e05c0',
            '670': 'bf3195ab-b348-474d-9dc6-6a6eee2d8e77',
            '6000': '480408af-57cb-4c74-b86f-9bf1a6ce82e9'
        }
    }
}

export function getModelIDFromPath(params: any) {
    const manufacturer = modelIDs[params.manufacturer];
    if(manufacturer === undefined) {
        return null;
    }
    const family = manufacturer[params.family];
    if(family === undefined) {
        return null;
    }
    const model = family[params.model];
    if(model === undefined) {
        return null;
    }
    return model;
}