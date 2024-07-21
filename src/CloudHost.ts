import { CreateDropletOptions, client } from 'digitalocean'

export default class CloudHostImpl implements CloudHost {
    public static Class?: CloudHostConstructor
    public static client = client

    private apiToken: string
    private createOptions: CreateDropletOptions

    protected constructor(
        apiToken: string,
        createOptions: CreateDropletOptions
    ) {
        this.apiToken = apiToken
        this.createOptions = createOptions
    }

    public static Create(
        apiToken: string,
        createOptions: CreateDropletOptions
    ) {
        return new (this.Class ?? this)(apiToken, createOptions)
    }

    public async spinup() {
        const client = CloudHostImpl.client(this.apiToken)
        await client.droplets.create(this.createOptions)
    }
}

export interface CloudHost {
    spinup(): Promise<void>
}

export type CloudHostConstructor = new (apiToken: string) => CloudHost
