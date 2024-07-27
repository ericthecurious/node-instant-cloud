import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import AzureHost from '../../hosts/azure/AzureHost'

export default class AzureHostTest extends AbstractSpruceTest {
    private static host: AzureHost

    protected static async beforeEach() {
        await super.beforeEach()
        this.host = this.AzureHost()
    }

    @test()
    protected static async canCreateAzureHost() {
        assert.isTruthy(this.host)
    }

    private static AzureHost() {
        return AzureHost.Create({
            apiToken: 'token',
            name: 'name',
            region: 'region',
            size: 'size',
            image: 'image',
        })
    }
}
