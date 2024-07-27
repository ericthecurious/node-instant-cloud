import CloudHostFactory, {
    CloudHost,
    CloudHostType,
} from './hosts/CloudHostFactory'

export default class InstantCloudImpl implements InstantCloud {
    public static Class?: InstantCloudConstructor

    protected host: CloudHost

    protected constructor(host: CloudHost) {
        this.host = host
    }

    public static Create(options: InstantCloudOptions) {
        const { hostType, apiToken } = options
        const host = this.CloudHost(hostType, apiToken)

        return new (this.Class ?? this)(host)
    }

    public async run() {
        await this.host.spinup()
    }

    private static CloudHost(hostType: CloudHostType, apiToken: string) {
        return CloudHostFactory.Create(hostType, apiToken)
    }
}

export interface InstantCloud {
    run(): Promise<void>
}

export type InstantCloudConstructor = new (host: CloudHost) => InstantCloud

export interface InstantCloudOptions {
    hostType: CloudHostType
    apiToken: string
}
