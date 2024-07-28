import { test, assert } from '@sprucelabs/test-utils'
import { AccessToken, GetTokenOptions, TokenCredential } from '@azure/identity'
import AzureHost from '../../hosts/azure/AzureHost'
import AbstractInstantCloudTest from '../AbstractInstantCloudTest'
import FakeResourceManagementClient from '../testDoubles/FakeResourceManagementClient'
import { SpyAzureHost } from '../testDoubles/SpyAzureHost'

export default class AzureHostTest extends AbstractInstantCloudTest {
    private static host: SpyAzureHost
    private static resourceGroupName = 'instantCloud'
    private static deploymentName = 'instantCloudDeployment'
    private static nicName = 'instantCloudNIC'
    private static vmName = 'instantCloudVM'
    private static vmSize = 'Standard_DS1_v2'
    private static location = 'eastus'

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
            'Should throw with missing AZURE_SUBSCRIPTION_ID env!'
        )
    }

    @test()
    protected static async throwsWithMissingUserNameEnv() {
        delete process.env.AZURE_USER_NAME

        assert.doesThrow(
            () => this.AzureHost(),
            '',
            'Should throw with missing AZURE_USER_NAME env!'
        )
    }

    @test()
    protected static async throwsWithMissingUserPasswordEnv() {
        delete process.env.AZURE_USER_PASSWORD

        assert.doesThrow(
            () => this.AzureHost(),
            '',
            'Should throw with missing AZURE_USER_PASSWORD env!'
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

    @test()
    protected static async spinupCallsCreateOrUpdateOnClient() {
        await this.host.spinup()

        assert.isTrue(
            this.wasCreateOrUpdateHit,
            'createOrUpdate was not called on ResourceManagementClient!'
        )

        assert.isEqual(
            this.passedResourceGroupName,
            this.resourceGroupName,
            'Invalid resourceGroupName passed to createOrUpdate!'
        )

        assert.isEqual(
            this.passedLocation,
            this.location,
            'Invalid location passed to createOrUpdate!'
        )
    }

    @test()
    protected static async spinupCallsBeginCreateOrUpdateAndWaitOnClient() {
        await this.host.spinup()

        assert.isTrue(
            this.wasBeginCreateOrUpdateAndWaitHit,
            'beginCreateOrUpdateAndWait was not called on ResourceManagementClient!'
        )

        assert.isEqual(
            this.passedResourceGroupNameToDeployments,
            this.resourceGroupName,
            'Invalid resourceGroupName passed to beginCreateOrUpdateAndWait!'
        )

        assert.isEqual(
            this.passedDeploymentsNameToDeployments,
            this.deploymentName,
            'Invalid deploymentName passed to beginCreateOrUpdateAndWait!'
        )

        assert.isEqual(
            this.passedMode,
            'Incremental',
            'Invalid mode passed to beginCreateOrUpdateAndWait!'
        )

        assert.isEqualDeep(
            this.passedTemplate,
            this.expectedTemplate,
            'Invalid template passed to beginCreateOrUpdateAndWait!'
        )

        assert.isEqualDeep(
            this.passedParameters,
            this.expectedParameters,
            'Invalid parameters passed to beginCreateOrUpdateAndWait!'
        )
    }

    private static get expectedTemplate() {
        return {
            $schema:
                'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#',
            contentVersion: '1.0.0.0',
            parameters: {
                vmName: {
                    type: 'string',
                },
                location: {
                    type: 'string',
                },
                vmSize: {
                    type: 'string',
                },
                adminUsername: {
                    type: 'string',
                },
                adminPassword: {
                    type: 'securestring',
                },
                nicName: {
                    type: 'string',
                },
                vnetName: {
                    type: 'string',
                    defaultValue: 'instantCloudVNet',
                },
                subnetName: {
                    type: 'string',
                    defaultValue: 'default',
                },
                addressPrefix: {
                    type: 'string',
                    defaultValue: '10.0.0.0/16',
                },
                subnetPrefix: {
                    type: 'string',
                    defaultValue: '10.0.0.0/24',
                },
            },
            resources: [
                {
                    type: 'Microsoft.Network/networkInterfaces',
                    apiVersion: '2022-03-01',
                    name: "[parameters('nicName')]",
                    location: "[parameters('location')]",
                    properties: {
                        ipConfigurations: [
                            {
                                name: 'ipconfig1',
                                properties: {
                                    subnet: {
                                        id: "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), parameters('subnetName'))]",
                                    },
                                    privateIPAllocationMethod: 'Dynamic',
                                },
                            },
                        ],
                    },
                },
                {
                    type: 'Microsoft.Compute/virtualMachines',
                    apiVersion: '2022-03-01',
                    name: "[parameters('vmName')]",
                    location: "[parameters('location')]",
                    properties: {
                        hardwareProfile: {
                            vmSize: "[parameters('vmSize')]",
                        },
                        storageProfile: {
                            imageReference: {
                                publisher: 'Canonical',
                                offer: 'UbuntuServer',
                                sku: '18.04-LTS',
                                version: 'latest',
                            },
                        },
                        osProfile: {
                            computerName: "[parameters('vmName')]",
                            adminUsername: "[parameters('adminUsername')]",
                            adminPassword: "[parameters('adminPassword')]",
                        },
                        networkProfile: {
                            networkInterfaces: [
                                {
                                    id: "[resourceId('Microsoft.Network/networkInterfaces', parameters('nicName'))]",
                                },
                            ],
                        },
                    },
                },
            ],
        }
    }

    private static get expectedParameters() {
        return {
            vmName: { value: this.vmName },
            location: { value: this.location },
            vmSize: { value: this.vmSize },
            adminUsername: { value: process.env.AZURE_USER_NAME },
            adminPassword: { value: process.env.AZURE_USER_PASSWORD },
            nicName: { value: this.nicName },
        }
    }

    private static get wasCreateOrUpdateHit() {
        return FakeResourceManagementClient.wasCreateOrUpdateHit
    }

    private static get wasBeginCreateOrUpdateAndWaitHit() {
        return FakeResourceManagementClient.wasBeginCreateOrUpdateAndWaitHit
    }

    private static get passedCredential() {
        return FakeResourceManagementClient.passedCredential
    }

    private static get passedSubscriptionId() {
        return FakeResourceManagementClient.passedSubscriptionId
    }

    private static get passedResourceGroupName() {
        return FakeResourceManagementClient.passedResourceGroupName
    }

    private static get passedLocation() {
        return FakeResourceManagementClient.passedLocation
    }

    private static get passedResourceGroupNameToDeployments() {
        return FakeResourceManagementClient.passedResourceGroupNameToDeployments
    }

    private static get passedDeploymentsNameToDeployments() {
        return FakeResourceManagementClient.passedDeploymentNameToDeployments
    }

    private static get passedMode() {
        return FakeResourceManagementClient.passedMode
    }

    private static get passedTemplate() {
        return FakeResourceManagementClient.passedTemplate
    }

    private static get passedParameters() {
        return FakeResourceManagementClient.passedParameters
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
