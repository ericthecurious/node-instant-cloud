import { ResourceManagementClient } from '@azure/arm-resources'
import { DefaultAzureCredential, TokenCredential } from '@azure/identity'
import {
    CloudHost,
    CloudHostConstructor,
    CloudHostOptions,
} from '../CloudHostFactory'

export default class AzureHost implements CloudHost {
    public static Class?: CloudHostConstructor
    public static Credential: any = DefaultAzureCredential
    public static Client: any = ResourceManagementClient

    private readonly resourceGroupName = 'instantCloud'
    private readonly deploymentName = 'instantCloudDeployment'
    private readonly vmName = 'instantCloudVM'
    private readonly nicName = 'instantCloudNIC'
    private readonly location = 'eastus'

    protected constructor(_options: CloudHostOptions) {
        this.validateEnvVars()
    }

    private validateEnvVars() {
        this.validateSubscriptionId()
        this.validateUserName()
        this.validateUserPassword()
    }

    private validateSubscriptionId() {
        if (!this.subscriptionId) {
            throw new Error('Please set AZURE_SUBSCRIPTION_ID in your env!')
        }
    }

    private get subscriptionId() {
        return process.env.AZURE_SUBSCRIPTION_ID!
    }

    private validateUserName() {
        if (!this.userName) {
            throw new Error('Please set AZURE_USER_NAME in your env!')
        }
    }

    private get userName() {
        return process.env.AZURE_USER_NAME!
    }

    private validateUserPassword() {
        if (!this.userPassword) {
            throw new Error('Please set AZURE_USER_PASSWORD in your env!')
        }
    }

    private get userPassword() {
        return process.env.AZURE_USER_PASSWORD!
    }

    public static Create(options: CloudHostOptions) {
        return new (this.Class ?? this)(options)
    }

    public async spinup() {
        const credential = this.Credential()
        const client = this.Client(credential, this.subscriptionId)

        await client.resourceGroups.createOrUpdate(this.resourceGroupName, {
            location: this.location,
        })

        await client.deployments.beginCreateOrUpdateAndWait(
            this.resourceGroupName,
            this.deploymentName,
            {
                properties: {
                    mode: 'Incremental',
                    template: this.template,
                    parameters: this.parameters,
                },
            }
        )
    }

    private get template() {
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

    private get parameters() {
        return {
            vmName: { value: this.vmName },
            location: { value: this.location },
            vmSize: { value: 'Standard_DS1_v2' },
            adminUsername: { value: this.userName },
            adminPassword: { value: this.userPassword },
            nicName: { value: this.nicName },
        }
    }

    protected Credential() {
        return new AzureHost.Credential()
    }

    protected Client(credential: TokenCredential, subscriptionId: string) {
        return new AzureHost.Client(credential, subscriptionId)
    }
}
