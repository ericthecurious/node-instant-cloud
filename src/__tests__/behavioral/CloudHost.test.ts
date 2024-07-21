import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
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

    private static CloudHost() {
        return CloudHostImpl.Create()
    }
}
