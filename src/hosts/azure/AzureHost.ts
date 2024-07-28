import {
    DeploymentOperations,
    Deployments,
    Operations,
    ProviderResourceTypes,
    Providers,
    ResourceGroups,
    ResourceManagementClient,
    Resources,
    TagsOperations,
} from '@azure/arm-resources'
import { ServiceClientOptions } from '@azure/core-client'
import { PipelineRequest, PipelineResponse } from '@azure/core-rest-pipeline'
import { DefaultAzureCredential, TokenCredential } from '@azure/identity'
import {
    CloudHost,
    CloudHostConstructor,
    CloudHostOptions,
} from '../CloudHostFactory'

export default class AzureHost implements CloudHost {
    public static Class?: CloudHostConstructor
    public static Credential: CredentialConstructor = DefaultAzureCredential
    public static Client: any = ResourceManagementClient

    protected constructor(_options: CloudHostOptions) {
        this.validateSubscriptionId()
    }

    private validateSubscriptionId() {
        if (!this.subscriptionId) {
            throw new Error('Please set AZURE_SUBSCRIPTION_ID in your env!')
        }
    }

    public get subscriptionId() {
        return process.env.AZURE_SUBSCRIPTION_ID!
    }

    public static Create(options: CloudHostOptions) {
        return new (this.Class ?? this)(options)
    }

    public async spinup() {
        const credential = this.Credential()
        this.Client(credential, this.subscriptionId)
    }

    protected Credential() {
        return new AzureHost.Credential()
    }

    protected Client(credential: TokenCredential, subscriptionId: string) {
        return new AzureHost.Client(credential, subscriptionId)
    }
}

export type CredentialConstructor = new () => TokenCredential

export type ResourceClientConstructor = new (
    credential: TokenCredential,
    subscriptionId: string
) => IResourceManagementClient

export interface ResourceManagementClientOptionalParams
    extends ServiceClientOptions {
    // Add specific optional parameters for the ResourceManagementClient if needed
}

export interface IResourceManagementClient {
    $host: string
    apiVersion: string
    subscriptionId: string
    operations: Operations
    deployments: Deployments
    providers: Providers
    providerResourceTypes: ProviderResourceTypes
    resources: Resources
    resourceGroups: ResourceGroups
    tagsOperations: TagsOperations
    deploymentOperations: DeploymentOperations
    addCustomApiVersionPolicy(): void
}

export interface ServiceClient {
    _endpoint?: string
    _requestContentType?: string
    _allowInsecureConnection?: boolean
    _httpClient: any // Replace with actual HTTP client type
    pipeline: any // Replace with actual Pipeline type

    /**
     * The ServiceClient constructor
     * @param credential - The credentials used for authentication with the service.
     * @param options - The service client options that govern the behavior of the client.
     */
    new (options?: ServiceClientOptions): ServiceClient

    /**
     * Send the provided httpRequest.
     */
    sendRequest(request: PipelineRequest): Promise<PipelineResponse>

    /**
     * Send an HTTP request that is populated using the provided OperationSpec.
     * @typeParam T - The typed result of the request, based on the OperationSpec.
     * @param operationArguments - The arguments that the HTTP request's templated values will be populated from.
     * @param operationSpec - The OperationSpec to use to populate the httpRequest.
     */
    sendOperationRequest<T>(
        operationArguments: any,
        operationSpec: any
    ): Promise<T> // Replace any with specific types
}
