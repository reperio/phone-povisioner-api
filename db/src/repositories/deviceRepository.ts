import {UnitOfWork} from '../unitOfWork';
import {PhoneModel} from "../models/phoneModel";
import {Organization} from "../models/organization";
import {Device} from "../models/device";

export class DeviceRepository {
    uow: UnitOfWork;

    constructor(uow: UnitOfWork) {
        this.uow = uow;
    }

    async addDevice(organization: string, model: string, mac_address: string, firmware_version: string, name: string) {
        await Device
            .query(this.uow.transaction)
            .insert({
                organization,
                model,
                mac_address,
                firmware_version,
                name,
                status: 'initial'
            }).returning('mac_address');
    }
}