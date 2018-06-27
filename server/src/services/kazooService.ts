import axios from 'axios';

export default class KazooService {
    private credentials: string;

    async authenticate() : Promise<void> {
        const response = await axios.put('https://crossbar.reper.io/v2/user_auth', {
            data: {
                credentials: process.env.CREDENTIALS,
                account_name: process.env.ACCOUNT_NAME
            }
        });

        this.credentials = response.data.auth_token;
    }

    async getDevices(organization: string) : Promise<any[]> {
        if(!this.credentials) {
            throw new Error('Credentials not set.');
        }

        const response = await axios.get(
            `https://crossbar.reper.io/v2/accounts/${organization}/devices`,
            {
                headers: {
                    'X-Auth-Token': this.credentials
                }
            }
        );
        return response.data.data;
    }
}