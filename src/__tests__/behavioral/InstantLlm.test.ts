import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import DigitalOceanHost from '../../DigitalOceanHost'
import InstantLlmImpl, { InstantLlmOptions } from '../../InstantLlm'
import { FakeCloudHost } from '../testDoubles/FakeCloudHost'
import { SpyInstantLlm } from '../testDoubles/SpyInstantLlm'

export default class InstantLlmTest extends AbstractSpruceTest {
    private static llm: SpyInstantLlm
    private static apiToken: string

    protected static async beforeEach() {
        await super.beforeEach()

        InstantLlmImpl.Class = SpyInstantLlm
        DigitalOceanHost.Class = FakeCloudHost

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
    protected static async passesCorrectOptionsToCloudHost() {
        const host = this.getCloudHost()

        assert.isEqualDeep(
            host.passedOptions,
            {
                apiToken: this.apiToken,
                name: 'example-droplet',
                region: 'nyc3',
                size: 's-1vcpu-1gb',
                image: 'ubuntu-20-04-x64',
            },
            'Invalid create options passed to host!'
        )
    }

    @test()
    protected static async passingHostTypeReturnsCorrectType() {
        delete DigitalOceanHost.Class

        const llm = this.InstantLlm({ hostType: 'digitalocean' })
        const host = llm.getCloudHost()

        assert.isEqual(
            host.constructor.name,
            'DigitalOceanHost',
            `Invalid host type for ${'digitalocean'}!`
        )
    }

    private static getCloudHost(llm?: SpyInstantLlm) {
        return (llm ?? this.llm).getCloudHost() as FakeCloudHost
    }

    private static InstantLlm(options?: Partial<InstantLlmOptions>) {
        return InstantLlmImpl.Create({
            hostType: 'digitalocean',
            apiToken: this.apiToken,
            ...options,
        }) as SpyInstantLlm
    }
}
