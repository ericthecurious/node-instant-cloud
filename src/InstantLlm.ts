import CloudHostImpl, { CloudHost } from './CloudHost'

export default class InstantLlmImpl implements InstantLlm {
    public static Class?: InstantLlmConstructor

    protected host: CloudHost

    protected constructor(host: CloudHost) {
        this.host = host
    }

    public static Create(apiToken: string) {
        const host = this.CloudHost(apiToken)
        return new (this.Class ?? this)(host)
    }

    public async run() {
        await this.host.spinup()
    }

    private static CloudHost(apiToken: string) {
        return CloudHostImpl.Create(apiToken)
    }
}

export interface InstantLlm {
    run(): Promise<void>
}

export type InstantLlmConstructor = new (host: CloudHost) => InstantLlm
