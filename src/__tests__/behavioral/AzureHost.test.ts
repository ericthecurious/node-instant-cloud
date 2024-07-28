import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import AzureHost from '../../hosts/azure/AzureHost'
import { SpyAzureHost } from '../testDoubles/SpyAzureHost'

export default class AzureHostTest extends AbstractSpruceTest {
    private static host: AzureHost

    protected static async beforeEach() {
        await super.beforeEach()

        AzureHost.Class = SpyAzureHost

        this.host = this.AzureHost()
    }

    @test()
    protected static async canCreateAzureHost() {
        assert.isTruthy(this.host)
    }

    @test()
    protected static async spinupCallsCreatesNetworkInterface() {
        await this.host.spinup()
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
