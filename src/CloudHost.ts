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
        CloudHostImpl.client(this.apiToken)
    }
}

export interface CloudHost {
    spinup(): Promise<void>
}

export type CloudHostConstructor = new (apiToken: string) => CloudHost
