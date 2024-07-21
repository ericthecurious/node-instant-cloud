import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import InstantLlmImpl from '../../InstantLlm'

export default class InstantLlmTest extends AbstractSpruceTest {
    private static llm: InstantLlmImpl

    protected static async beforeEach() {
        await super.beforeEach()

        this.llm = this.InstantLlm()
    }

    @test()
    protected static async canCreateInstantLlm() {
        assert.isTruthy(this.llm)
    }

    private static InstantLlm() {
        return InstantLlmImpl.Create()
    }
}
