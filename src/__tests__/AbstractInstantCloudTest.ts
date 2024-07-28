import AbstractSpruceTest, { generateId } from '@sprucelabs/test-utils'

export default class AbstractInstantCloudTest extends AbstractSpruceTest {
    protected static async beforeEach() {
        await super.beforeEach()

        process.env.AZURE_SUBSCRIPTION_ID = generateId()
        process.env.AZURE_USER_NAME = generateId()
        process.env.AZURE_USER_PASSWORD = generateId()
    }
}
