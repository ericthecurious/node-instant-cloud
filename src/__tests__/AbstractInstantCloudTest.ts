import AbstractSpruceTest, { generateId } from '@sprucelabs/test-utils'

export default class AbstractInstantCloudTest extends AbstractSpruceTest {
    protected static async beforeEach() {
        await super.beforeEach()

        process.env.AZURE_SUBSCRIPTION_ID = generateId()
    }
}
