import { CloudHost } from '../../CloudHost'
import InstantLlmImpl from '../../InstantLlm'

export class SpyInstantLlm extends InstantLlmImpl {
    public constructor(host: CloudHost) {
        super(host)
    }

    public getCloudHost() {
        return this.host
    }
}