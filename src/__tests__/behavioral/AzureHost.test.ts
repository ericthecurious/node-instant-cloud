import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import AzureHost from '../../AzureHost'

export default class AzureHostTest extends AbstractSpruceTest {
    protected static async beforeEach() {
        await super.beforeEach()
    }

    @test()
    protected static async canCreateAzureHost() {
        const azureHost = this.AzureHost()
        assert.isTruthy(azureHost)
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
