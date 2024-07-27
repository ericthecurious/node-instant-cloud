import { CloudHost } from '../../hosts/CloudHostFactory'
import InstantCloudImpl from '../../InstantCloud'

export class SpyInstantCloud extends InstantCloudImpl {
    public constructor(host: CloudHost) {
        super(host)
    }

    public getCloudHost() {
        return this.host
    }
}
