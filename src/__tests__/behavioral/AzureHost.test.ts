import { test, assert } from '@sprucelabs/test-utils'
import { AccessToken, GetTokenOptions, TokenCredential } from '@azure/identity'
import AzureHost from '../../hosts/azure/AzureHost'
import AbstractInstantCloudTest from '../AbstractInstantCloudTest'
import FakeResourceManagementClient from '../testDoubles/FakeResourceManagementClient'
import { SpyAzureHost } from '../testDoubles/SpyAzureHost'

export default class AzureHostTest extends AbstractInstantCloudTest {
    private static host: SpyAzureHost

    protected static async beforeEach() {
        await super.beforeEach()

        AzureHost.Class = SpyAzureHost
        AzureHost.Credential = FakeDefaultAzureCredential
        AzureHost.Client = FakeResourceManagementClient

        this.host = this.AzureHost()
    }

    @test()
    protected static async canCreateAzureHost() {
        assert.isTruthy(this.host)
    }

    @test()
    protected static async throwsWithMissingSubscriptionIdEnv() {
        delete process.env.AZURE_SUBSCRIPTION_ID

        assert.doesThrow(
            () => this.AzureHost(),
            '',
            'Should throw with missing subscriptionId env!'
        )
    }

    @test()
    protected static async spinupCreatesNewCredential() {
        await this.host.spinup()
        assert.isTrue(this.host.wasCredentialCreated)
    }

    @test()
    protected static async spinupCreatesNewResourceManagementClient() {
        await this.host.spinup()

        assert.isTrue(
            this.host.wasResourceManagementClientCreated,
            'ResourceManagementClient was not created!'
        )

        assert.isInstanceOf(this.passedCredential, FakeDefaultAzureCredential)

        assert.isEqual(
            this.passedSubscriptionId,
            process.env.AZURE_SUBSCRIPTION_ID,
            'Invalid subscriptionId passed to ResourceManagementClient!'
        )
    }

    private static get passedCredential() {
        return FakeResourceManagementClient.passedCredential
    }

    private static get passedSubscriptionId() {
        return FakeResourceManagementClient.passedSubscriptionId
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
