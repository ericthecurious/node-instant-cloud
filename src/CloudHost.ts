import { client } from 'digitalocean'

export default class CloudHostImpl implements CloudHost {
    public static Class?: CloudHostConstructor
    public static client = client

    private apiToken: string

    protected constructor(apiToken: string) {
        this.apiToken = apiToken
    }

    public static Create(apiToken: string) {
        return new (this.Class ?? this)(apiToken)
    }

    public async spinup() {
        const client = CloudHostImpl.client(this.apiToken)

        await client.droplets.create({
            name: 'a',
            region: 'b',
            size: 'c',
            image: 'd',
        })
    }
}

export interface CloudHost {
    spinup(): Promise<void>
}

export type CloudHostConstructor = new (apiToken: string) => CloudHost
