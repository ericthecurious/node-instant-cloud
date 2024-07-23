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
        assert.isTruthy(this.llm, 'Instance was not created!')
    }

    @test()
    protected static async runCallsSpinupOnCloudHost() {
        await this.llm.run()

        const host = this.getCloudHost()
        assert.isTrue(host.wasSpinupCalled, 'Spinup was not called on host!')
    }

    @test()
    protected static async passesCorrectCreateOptionsToCloudHost() {
        await this.llm.run()

        const host = this.getCloudHost()

        assert.isEqualDeep(
            host.passedOptions?.createOptions,
            {
                name: 'example-droplet',
                region: 'nyc3',
                size: 's-1vcpu-1gb',
                image: 'ubuntu-20-04-x64',
            },
            'Invalid create options passed to host!'
        )
    }

    private static getCloudHost() {
        return this.llm.getCloudHost() as FakeCloudHost
    }

    private static InstantLlm() {
        return InstantLlmImpl.Create(this.apiToken) as SpyInstantLlm
    }
}
