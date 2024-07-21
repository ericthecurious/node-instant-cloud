import { CreateDropletOptions, DigitalOceanClient, client } from 'digitalocean'

export default class CloudHostImpl implements CloudHost {
    public static Class?: CloudHostConstructor
    public static client = client

    protected apiToken: string
    private createOptions: CreateDropletOptions
    private client: DigitalOceanClient

    protected constructor(options: CloudHostConstructorOptions) {
        const { apiToken, createOptions, client } = options

        this.apiToken = apiToken
        this.createOptions = createOptions
        this.client = client
    }

    public static Create(
        apiToken: string,
        createOptions: CreateDropletOptions
    ) {
        const client = CloudHostImpl.client(apiToken)
        return new (this.Class ?? this)({ apiToken, createOptions, client })
    }

    public async spinup() {
        await this.client.droplets.create(this.createOptions)
    }
}

export interface CloudHost {
    spinup(): Promise<void>
}

export type CloudHostConstructor = new (
    options: CloudHostConstructorOptions
) => CloudHost

interface CloudHostConstructorOptions {
    apiToken: string
    createOptions: CreateDropletOptions
    client: DigitalOceanClient
}
