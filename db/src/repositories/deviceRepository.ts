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

    async getDevicesFromPhone(mac_address: string) : Promise<Device[]> {
        try {
            const devices = await Device
                .query(this.uow.transaction)
                .select('devices.*', 'organizations.realm as realm')
                .where('mac_address', mac_address)
                .join('organizations', function() {
                    this.on('devices.organization', 'organizations.id')
                });

            return devices;
        } catch (err) {
            this.uow.logger.error('Failed to fetch device');
            this.uow.logger.error(err);
            throw err;
        }
    }

    async getDevicesFromOrganization(organization: string) : Promise<Device[]> {
        try {
            const devices = await Device
                .query(this.uow.transaction)
                .select(
                    'devices.mac_address as mac_address',
                    'manufacturers.name as manufactuer',
                    'families.name as family',
                    'models.name as model',
                    'devices.firmware_version as firmware_version',
                    'devices.name as name',
                    'devices.status as status'
                )
                .where('devices.organization', organization)
                .innerJoin('models', function() {
                    this.on('devices.model', 'models.id')
                })
                .innerJoin('families', function() {
                    this.on('models.family', 'families.id')
                })
                .innerJoin('manufacturers', function() {
                    this.on('families.manufacturer', 'manufacturers.id')
                });

            return devices;
        } catch (err) {
            this.uow.logger.error('Failed to fetch devices');
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