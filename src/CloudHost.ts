import * as digitalocean from 'digitalocean'

export default class CloudHostImpl implements CloudHost {
    public static Class?: CloudHostConstructor
    public static client = digitalocean.client

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async spinup() {
        CloudHostImpl.client('')
    }
}

export interface CloudHost {
    spinup(): Promise<void>
}

export type CloudHostConstructor = new () => CloudHost
