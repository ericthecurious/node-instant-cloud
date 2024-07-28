import { DefaultAzureCredential, TokenCredential } from '@azure/identity'
import {
    CloudHost,
    CloudHostConstructor,
    CloudHostOptions,
} from '../CloudHostFactory'

export default class AzureHost implements CloudHost {
    public static Class?: CloudHostConstructor
    public static Credential: CredentialConstructor = DefaultAzureCredential

    protected constructor(_options: CloudHostOptions) {}

    public static Create(options: CloudHostOptions) {
        return new (this.Class ?? this)(options)
    }

    public async spinup() {
        this.Credential()
    }

    protected Credential() {
        return new AzureHost.Credential()
    }
}

export type CredentialConstructor = new () => TokenCredential
