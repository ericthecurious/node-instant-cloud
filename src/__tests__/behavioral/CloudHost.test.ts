import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import { DigitalOceanClient } from 'digitalocean'
import CloudHostImpl, { CloudHost } from '../../CloudHost'

export default class CloudHostTest extends AbstractSpruceTest {
    private static host: CloudHost

    protected static async beforeEach() {
        await super.beforeEach()

        this.host = this.CloudHost()
    }

    @test()
    protected static async canCreateCloudHost() {
        assert.isTruthy(this.host)
    }

    @test()
    protected static async callingSpinupInstantiatesHostClient() {
        let wasHit = false

        CloudHostImpl.client = () => {
            wasHit = true
            return {} as DigitalOceanClient
        }

        await this.host.spinup()

        assert.isTrue(wasHit)
    }

    private static CloudHost() {
        return CloudHostImpl.Create()
    }
}
