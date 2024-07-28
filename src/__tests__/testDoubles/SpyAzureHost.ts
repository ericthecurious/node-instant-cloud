import { TokenCredential } from '@azure/identity'
import AzureHost from '../../hosts/azure/AzureHost'
import { CloudHostOptions } from '../../hosts/CloudHostFactory'

export class SpyAzureHost extends AzureHost {
    public wasCredentialCreated = false
    public wasResourceManagementClientCreated = false

    public constructor(options: CloudHostOptions) {
        super(options)
    }

    public async spinup() {
        await super.spinup()
    }

    protected Credential() {
        this.wasCredentialCreated = true
        return super.Credential()
    }

    protected Client(credential: TokenCredential, subscriptionId: string) {
        this.wasResourceManagementClientCreated = true
        return super.Client(credential, subscriptionId)
    }
}
