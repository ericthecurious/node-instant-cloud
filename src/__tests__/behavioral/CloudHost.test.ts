import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import { CreateDropletOptions, DigitalOceanClient, Droplet } from 'digitalocean'
import CloudHostImpl, { CloudHost } from '../../CloudHost'

export default class CloudHostTest extends AbstractSpruceTest {
    private static apiToken: string
    private static host: CloudHost

    protected static async beforeEach() {
        await super.beforeEach()

        this.apiToken = generateId()
        this.host = this.CloudHost()
    }

    @test()
    protected static async canCreateCloudHost() {
        assert.isTruthy(this.host)
    }

    @test()
    protected static async callingSpinupCallsHostClient() {
        let wasHit = false
        let token = ''

        CloudHostImpl.client = (apiToken: string) => {
            wasHit = true
            token = apiToken
            return this.FakeClient()
        }

        await this.spinupHost()

        assert.isTrue(wasHit, 'Client was not called!')
        assert.isTruthy(token, 'Token was not passed to client!')
        assert.isEqual(token, this.apiToken, 'Invalid token passed to client!')
    }

    @test()
    protected static async callingSpinupCallsCreateOnClient() {
        let wasHit = false
        let passedOptions = undefined

        CloudHostImpl.client = () => {
            return {
                droplets: {
                    create: (options: CreateDropletOptions) => {
                        wasHit = true
                        passedOptions = options
                    },
                },
            } as unknown as DigitalOceanClient
        }

        await this.spinupHost()

        assert.isTrue(wasHit, 'Create was not called!')
        assert.isTruthy(passedOptions, 'Options were not passed to create!')

        assert.isEqualDeep(
            passedOptions,
            this.createOptions(),
            'Invalid options passed to create! Changes needed:'
        )
    }

    private static createOptions() {
        return {
            name: 'a',
            region: 'b',
            size: 'c',
            image: 'd',
        } as CreateDropletOptions
    }

    private static spinupHost() {
        return this.host.spinup()
    }

    private static FakeClient() {
        return new FakeDigitalOceanClient()
    }

    private static CloudHost() {
        return CloudHostImpl.Create(this.apiToken)
    }
}

class FakeDigitalOceanClient implements DigitalOceanClient {
    public droplets = {
        create: async () => {
            return {} as Droplet
        },
    }
}
