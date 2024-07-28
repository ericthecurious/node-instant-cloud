import { TokenCredential } from '@azure/identity'

export default class FakeResourceManagementClient {
    public static wasCreateOrUpdateHit = false
    public static passedCredential?: TokenCredential
    public static passedSubscriptionId?: string
    public static passedResourceGroupName?: string
    public static passedLocation?: string

    public constructor(credential: TokenCredential, subscriptionId: string) {
        FakeResourceManagementClient.passedCredential = credential
        FakeResourceManagementClient.passedSubscriptionId = subscriptionId
    }

    public get deployments() {
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
}
