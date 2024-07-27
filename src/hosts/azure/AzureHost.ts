import {
    CloudHost,
    CloudHostConstructor,
    CloudHostOptions,
} from '../CloudHostFactory'

export default class AzureHost implements CloudHost {
    public static Class?: CloudHostConstructor

    protected constructor(_options: CloudHostOptions) {}

    public static Create(options: CloudHostOptions) {
        return new (this.Class ?? this)(options)
    }

    public async spinup() {}
}
