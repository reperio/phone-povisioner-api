import {UnitOfWork} from '../unitOfWork';
import {Device} from "../models/device";
import * as randomstring from 'randomstring';

export class DeviceRepository {
    uow: UnitOfWork;

    constructor(uow: UnitOfWork) {
        this.uow = uow;
    }

    async addDevice(model: string, mac_address: string, firmware_version: string) {
        try {
            await Device
                .query(this.uow.transaction)
                .insert({
                    organization: null,
                    model,
                    mac_address,
                    firmware_version,
                    name: null,
                    status: 'initial',
                    kazoo_id: null,
                    user: randomstring.generate(10),
                    password: randomstring.generate(10)
                }).returning('kazoo_id');
        } catch (err) {
            this.uow.logger.error('Failed to add device');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getDevice(mac_address: string) : Promise<Device> {
        try {
            const device = await Device
                .query(this.uow.transaction)
                .where('mac_address', mac_address);

            return device.length > 0 ? device[0] : null;
        } catch (err) {
            this.uow.logger.error('Failed to fetch device');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async updateDevice(mac_address: string, update: Partial<Device>) {
        try {
            await Device
                .query(this.uow.transaction)
                .update(update)
                .where('mac_address', mac_address);
        } catch (err) {
            this.uow.logger.error('Failed to update device');
            this.uow.logger.error(err);
            throw err;
        }
    }
}