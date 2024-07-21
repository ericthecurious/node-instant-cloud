import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import { DigitalOceanClient } from 'digitalocean'
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
    protected static async callingSpinupInstantiatesHostClient() {
        let wasHit = false

        CloudHostImpl.client = () => {
            wasHit = true
            return {} as DigitalOceanClient
        }

        await this.spinupHost()

        assert.isTrue(wasHit)
    }

    @test()
    protected static async callingSpinupPassesApiTokenToClient() {
        let token = ''

        CloudHostImpl.client = (apiToken: string) => {
            token = apiToken
            return {} as DigitalOceanClient
        }

        await this.spinupHost()

        assert.isEqual(token, this.apiToken)
    }

    private static spinupHost() {
        return this.host.spinup()
    }

    private static CloudHost() {
        return CloudHostImpl.Create(this.apiToken)
    }
}
