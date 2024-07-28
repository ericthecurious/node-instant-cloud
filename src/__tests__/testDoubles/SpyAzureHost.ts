import AzureHost from '../../hosts/azure/AzureHost'
import { CloudHostOptions } from '../../hosts/CloudHostFactory'

export class SpyAzureHost extends AzureHost {
    public constructor(options: CloudHostOptions) {
        super(options)
    }

    public async spinup() {}
}
