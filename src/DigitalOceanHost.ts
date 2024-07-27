import { CreateDropletOptions, DigitalOceanClient, client } from 'digitalocean'

export default class DigitalOceanHost implements CloudHost {
    public static Class?: CloudHostConstructor
    public static client = client

    private createOptions: CreateDropletOptions
    private client: DigitalOceanClient

    protected constructor(options: CloudHostConstructorOptions) {
        const { createOptions, client } = options

        this.createOptions = createOptions
        this.client = client
    }

    public static Create(
        apiToken: string,
        createOptions: CreateDropletOptions
    ) {
        const client = DigitalOceanHost.client(apiToken)
        return new (this.Class ?? this)({ createOptions, client })
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

export interface CloudHostConstructorOptions {
    createOptions: CreateDropletOptions
    client: DigitalOceanClient
}
