import CloudHostImpl, { CloudHost } from './CloudHost'

export default class InstantLlmImpl {
    public static Class?: InstantLlmConstructor

    protected host: CloudHost

    protected constructor(host: CloudHost) {
        this.host = host
    }

    public static Create() {
        const host = CloudHostImpl.Create()
        return new (this.Class ?? this)(host)
    }

    public async run() {
        await this.host.spinup()
    }
}

export interface InstantLlm {
    run(): Promise<void>
}

export type InstantLlmConstructor = new () => InstantLlm
