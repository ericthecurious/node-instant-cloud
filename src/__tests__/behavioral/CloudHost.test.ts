import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import { CreateDropletOptions, DigitalOceanClient, Droplet } from 'digitalocean'
import CloudHostImpl, { CloudHost } from '../../CloudHost'
import FakeDigitalOceanClient from '../testDoubles/FakeDigitalOceanClient'

export default class CloudHostTest extends AbstractSpruceTest {
    private static apiToken: string
    private static host: CloudHost
    private static hostName: string
    private static hostRegion: string
    private static hostSize: string
    private static hostImage: string

    protected static async beforeEach() {
        await super.beforeEach()

        this.fakeClientFunction()

        this.apiToken = generateId()
        this.hostName = generateId()
        this.hostRegion = generateId()
        this.hostSize = generateId()
        this.hostImage = generateId()

        this.host = this.CloudHost()
    }

    @test()
    protected static async canCreateCloudHost() {
        assert.isTruthy(this.host, 'Instance was not created!')
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

        await this.createHostAndSpinup()

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
                    create: async (options: CreateDropletOptions) => {
                        wasHit = true
                        passedOptions = options
                        return {} as Droplet
                    },
                },
            } as DigitalOceanClient
        }

        await this.createHostAndSpinup()

        assert.isTrue(wasHit, 'Create was not called!')
        assert.isTruthy(passedOptions, 'Options were not passed to create!')

        assert.isEqualDeep(
            passedOptions,
            this.createOptions,
            'Invalid options passed to create! Changes needed:'
        )
    }

    private static get createOptions() {
        return {
            name: this.hostName,
            region: this.hostRegion,
            size: this.hostSize,
            image: this.hostImage,
        } as CreateDropletOptions
    }

    private static async createHostAndSpinup() {
        const host = this.CloudHost()
        await this.spinupHost(host)
    }

    private static spinupHost(host?: CloudHost) {
        return (host ?? this.host).spinup()
    }

    private static fakeClientFunction() {
        // Sane default fake to avoid calling real client
        CloudHostImpl.client = () => {
            return this.FakeClient()
        }
    }

    private static FakeClient() {
        return new FakeDigitalOceanClient()
    }

    private static CloudHost() {
        return CloudHostImpl.Create(this.apiToken, this.createOptions)
    }
}
