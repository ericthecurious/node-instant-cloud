import CloudHostImpl from '../../CloudHost'
import InstantLlmImpl from '../../InstantLlm'

export class SpyInstantLlm extends InstantLlmImpl {
    public constructor() {
        const host = CloudHostImpl.Create()
        super(host)
    }

    public getCloudHost() {
        return this.host
    }
}
