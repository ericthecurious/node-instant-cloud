import { TokenCredential } from '@azure/identity'

export default class FakeResourceManagementClient {
    public static passedCredential?: TokenCredential
    public static passedSubscriptionId?: string

    public constructor(credential: TokenCredential, subscriptionId: string) {
        FakeResourceManagementClient.passedCredential = credential
        FakeResourceManagementClient.passedSubscriptionId = subscriptionId
    }
}
