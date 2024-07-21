export default class CloudHostImpl implements CloudHost {
    public static Class?: CloudHostConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async spinup() {}
}

export interface CloudHost {
    spinup(): Promise<void>
}

export type CloudHostConstructor = new () => CloudHost
