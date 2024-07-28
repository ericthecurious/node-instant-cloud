import {
    Operations,
    Deployments,
    Providers,
    ProviderResourceTypes,
    Resources,
    ResourceGroups,
    TagsOperations,
    DeploymentOperations,
} from '@azure/arm-resources'
import { TokenCredential } from '@azure/identity'
import { IResourceManagementClient } from '../../hosts/azure/AzureHost'

export default class FakeResourceManagementClient
    implements IResourceManagementClient
{
    public static passedCredential?: TokenCredential
    public static passedSubscriptionId?: string

    public constructor(credential: TokenCredential, subscriptionId: string) {
        FakeResourceManagementClient.passedCredential = credential
        FakeResourceManagementClient.passedSubscriptionId = subscriptionId
    }

    public $host = ''

    public apiVersion = ''

    public subscriptionId = ''

    public operations = {} as Operations

    public deployments = {} as Deployments

    public providers = {} as Providers

    public providerResourceTypes = {} as ProviderResourceTypes

    public resources = {} as Resources

    public resourceGroups = {} as ResourceGroups

    public tagsOperations = {} as TagsOperations

    public deploymentOperations = {} as DeploymentOperations

    public addCustomApiVersionPolicy(): void {
        throw new Error('Method not implemented.')
    }
}
