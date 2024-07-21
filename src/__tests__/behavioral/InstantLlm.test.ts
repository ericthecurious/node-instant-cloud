import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import CloudHostImpl from '../../CloudHost'
import InstantLlmImpl from '../../InstantLlm'
import { FakeCloudHost } from '../testDoubles/FakeCloudHost'
import { SpyInstantLlm } from '../testDoubles/SpyInstantLlm'

export default class InstantLlmTest extends AbstractSpruceTest {
    private static llm: SpyInstantLlm
    private static apiToken: string

    protected static async beforeEach() {
        await super.beforeEach()

        InstantLlmImpl.Class = SpyInstantLlm
        CloudHostImpl.Class = FakeCloudHost

        this.apiToken = generateId()
        this.llm = this.InstantLlm()
    }

    @test()
    protected static async canCreateInstantLlm() {
        assert.isTruthy(this.llm)
    }

    @test()
    protected static async runCallsSpinupOnCloudHost() {
        await this.llm.run()

        const host = this.llm.getCloudHost() as FakeCloudHost
        assert.isTrue(host.wasSpinupCalled)
    }

    private static InstantLlm() {
        return InstantLlmImpl.Create(this.apiToken) as SpyInstantLlm
    }
}
