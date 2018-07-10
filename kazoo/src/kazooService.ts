import axios from 'axios';
import {LoggerInstance} from 'winston';

export default class KazooService {
    private credentials: string;
    private logger: LoggerInstance;

    constructor(logger: LoggerInstance) {
        this.logger = logger;
    }

    async authenticate(credentials: string, account_name: string) : Promise<void> {
        try {
            this.logger.debug('Authenticating Kazoo service.');

            const response = await axios.put('https://crossbar.reper.io/v2/user_auth', {
                data: {
                    credentials,
                    account_name
                }
            });

            this.credentials = response.data.auth_token;
        } catch(e) {
            this.logger.error('Failed to authenticate the Kazoo service.');
            this.logger.error(e);
            throw e;
        }
    }

    async getOrganizations(account_id: string) : Promise<any[]> {
        if(!this.credentials) {
            throw new Error('Credentials not set in Kazoo service.');
        }

        try {
            this.logger.debug('Fetching credentials.');

            const response = await axios.get(
                `https://crossbar.reper.io/v2/accounts/${account_id}/descendants`,
                {
                    headers: {
                        'X-Auth-Token': this.credentials
                    }
                }
            );
            return response.data.data;
        } catch(e) {
            this.logger.error('Failed to fetch organizations from the Kazoo service.');
            this.logger.error(e);
            throw e;
        }
    }

    async getDevices(organization: string) : Promise<any[]> {
        if(!this.credentials) {
            throw new Error('Credentials not set in Kazoo service.');
        }

        try {
            this.logger.debug('Fetching devices.');

            const response = await axios.get(
                `https://crossbar.reper.io/v2/accounts/${organization}/devices`, {
                    headers: {
                        'X-Auth-Token': this.credentials
                    }
                }
            );
            return response.data.data;
        } catch(e) {
            this.logger.error('Failed to fetch devices from the Kazoo service.');
            this.logger.error(e);
            throw e;
        }
    }

    async getDevice(organization: string, device: string) : Promise<any> {
        if(!this.credentials) {
            throw new Error('Credentials not set in Kazoo service.');
        }

        try {
            this.logger.debug('Fetching device info.');

            const response = await axios.get(
                `https://crossbar.reper.io/v2/accounts/${organization}/devices/${device}`, {
                    headers: {
                        'X-Auth-Token': this.credentials
                    }
                }
            );
            return response.data.data;
        } catch(e) {
            this.logger.error('Failed to fetch device info from the Kazoo service.');
            this.logger.error(e);
            throw e;
        }
    }
}