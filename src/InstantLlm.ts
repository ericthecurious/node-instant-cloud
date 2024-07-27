import CloudHostFactory, { CloudHost } from './CloudHostFactory'

export default class InstantLlmImpl implements InstantLlm {
    public static Class?: InstantLlmConstructor

    protected host: CloudHost

    protected constructor(host: CloudHost) {
        this.host = host
    }

    public static Create(options: InstantLlmOptions) {
        const { apiToken } = options
        const host = this.CloudHost(apiToken)

        return new (this.Class ?? this)(host)
    }

    public async run() {
        await this.host.spinup()
    }

    private static CloudHost(apiToken: string) {
        const createOptions = {
            name: 'example-droplet',
            region: 'nyc3',
            size: 's-1vcpu-1gb',
            image: 'ubuntu-20-04-x64',
        }
        return CloudHostFactory.Create({ apiToken, ...createOptions })
    }
}

export interface InstantLlm {
    run(): Promise<void>
}

export type InstantLlmConstructor = new (host: CloudHost) => InstantLlm

export interface InstantLlmOptions {
    apiToken: string
}
