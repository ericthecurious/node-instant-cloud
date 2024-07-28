import { TokenCredential } from '@azure/identity'

export default class FakeResourceManagementClient {
    public static wasCreateOrUpdateHit = false
    public static wasBeginCreateOrUpdateAndWaitHit = false
    public static passedCredential?: TokenCredential
    public static passedSubscriptionId?: string
    public static passedResourceGroupName?: string
    public static passedLocation?: string
    public static passedResourceGroupNameToDeployments?: string
    public static passedDeploymentNameToDeployments?: string
    public static passedMode?: string
    public static passedTemplate?: any
    public static passedParameters?: any

    public constructor(credential: TokenCredential, subscriptionId: string) {
        FakeResourceManagementClient.passedCredential = credential
        FakeResourceManagementClient.passedSubscriptionId = subscriptionId
    }

    public get resourceGroups() {
        return {
            createOrUpdate: async (
                resourceGroupName: string,
                options: { location: string }
            ) => {
                const { location } = options

                FakeResourceManagementClient.wasCreateOrUpdateHit = true

                FakeResourceManagementClient.passedResourceGroupName =
                    resourceGroupName

                FakeResourceManagementClient.passedLocation = location

                return {
                    properties: {
                        provisioningState: 'Succeeded',
                    },
                }
            },
        }
    }

    public get deployments() {
        return {
            beginCreateOrUpdateAndWait: async (
                resourceGroupName: string,
                deploymentName: string,
                options: {
                    properties: {
                        mode: 'string'
                        template: any
                        parameters: any
                    }
                }
            ) => {
                const { properties } = options
                const { mode, template, parameters } = properties

                FakeResourceManagementClient.wasBeginCreateOrUpdateAndWaitHit =
                    true

                FakeResourceManagementClient.passedResourceGroupNameToDeployments =
                    resourceGroupName

                FakeResourceManagementClient.passedDeploymentNameToDeployments =
                    deploymentName

                FakeResourceManagementClient.passedMode = mode
                FakeResourceManagementClient.passedTemplate = template
                FakeResourceManagementClient.passedParameters = parameters

                // return {
                //     properties: {
                //         provisioningState: 'Succeeded',
                //     },
                // }
            },
        }
    }
}
