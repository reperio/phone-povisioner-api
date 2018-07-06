import axios from 'axios';

export default class KazooService {
    private credentials: string;

    async authenticate(credentials: string, account_name: string) : Promise<void> {
        const response = await axios.put('https://crossbar.reper.io/v2/user_auth', {
            data: {
                credentials,
                account_name
            }
        });

        this.credentials = response.data.auth_token;
    }

    async getOrganizations(account_id: string) : Promise<any[]> {
        if(!this.credentials) {
            throw new Error('Credentials not set.');
        }

        const response = await axios.get(
            `https://crossbar.reper.io/v2/accounts/${account_id}/descendants`,
            {
                headers: {
                    'X-Auth-Token': this.credentials
                }
            }
        );
        return response.data.data;
    }

    async getDevices(organization: string) : Promise<any[]> {
        if(!this.credentials) {
            throw new Error('Credentials not set.');
        }

        const response = await axios.get(
            `https://crossbar.reper.io/v2/accounts/${organization}/devices`, {
                headers: {
                    'X-Auth-Token': this.credentials
                }
            }
        );
        return response.data.data;
    }

    async getDevice(organization: string, device: string) : Promise<any> {
        if(!this.credentials) {
            throw new Error('Credentials not set.');
        }

        const response = await axios.get(
            `https://crossbar.reper.io/v2/accounts/${organization}/devices/${device}`, {
                headers: {
                    'X-Auth-Token': this.credentials
                }
            }
        );
        return response.data.data;
    }
}