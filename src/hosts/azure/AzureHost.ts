import { ResourceManagementClient } from '@azure/arm-resources'
import { DefaultAzureCredential, TokenCredential } from '@azure/identity'
import {
    CloudHost,
    CloudHostConstructor,
    CloudHostOptions,
} from '../CloudHostFactory'

export default class AzureHost implements CloudHost {
    public static Class?: CloudHostConstructor
    public static Credential: any = DefaultAzureCredential
    public static Client: any = ResourceManagementClient

    protected constructor(_options: CloudHostOptions) {
        this.validateSubscriptionId()
    }

    private validateSubscriptionId() {
        if (!this.subscriptionId) {
            throw new Error('Please set AZURE_SUBSCRIPTION_ID in your env!')
        }
    }

    private get subscriptionId() {
        return process.env.AZURE_SUBSCRIPTION_ID!
    }

    public static Create(options: CloudHostOptions) {
        return new (this.Class ?? this)(options)
    }

    public async spinup() {
        const credential = this.Credential()
        this.Client(credential, this.subscriptionId)
    }

    protected Credential() {
        return new AzureHost.Credential()
    }

    protected Client(credential: TokenCredential, subscriptionId: string) {
        return new AzureHost.Client(credential, subscriptionId)
    }
}
