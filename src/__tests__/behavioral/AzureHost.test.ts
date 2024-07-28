import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import { AccessToken, GetTokenOptions, TokenCredential } from '@azure/identity'
import AzureHost from '../../hosts/azure/AzureHost'
import { SpyAzureHost } from '../testDoubles/SpyAzureHost'

export default class AzureHostTest extends AbstractSpruceTest {
    private static host: SpyAzureHost

    protected static async beforeEach() {
        await super.beforeEach()

        AzureHost.Class = SpyAzureHost
        AzureHost.Credential = FakeDefaultAzureCredential

        this.host = this.AzureHost()
    }

    @test()
    protected static async canCreateAzureHost() {
        assert.isTruthy(this.host)
    }

    @test()
    protected static async spinupCreatesNewCredential() {
        await this.host.spinup()

        assert.isTrue(this.host.wasCredentialCreated)
    }

    private static AzureHost() {
        return AzureHost.Create({
            apiToken: 'token',
            name: 'name',
            region: 'region',
            size: 'size',
            image: 'image',
        }) as SpyAzureHost
    }
}

class FakeDefaultAzureCredential implements TokenCredential {
    public async getToken(
        _scopes: string | string[],
        _options?: GetTokenOptions
    ) {
        return {} as AccessToken
    }
}
