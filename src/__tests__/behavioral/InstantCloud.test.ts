import { test, assert, generateId } from '@sprucelabs/test-utils'
import { CloudHostType } from '../../hosts/CloudHostFactory'
import DigitalOceanHost from '../../hosts/digitalocean/DigitalOceanHost'
import InstantCloudImpl, { InstantCloudOptions } from '../../InstantCloud'
import AbstractInstantCloudTest from '../AbstractInstantCloudTest'
import { FakeCloudHost } from '../testDoubles/FakeCloudHost'
import { SpyInstantCloud } from '../testDoubles/SpyInstantCloud'

export default class InstantCloudTest extends AbstractInstantCloudTest {
    private static cloud: SpyInstantCloud
    private static apiToken: string

    protected static async beforeEach() {
        await super.beforeEach()

        InstantCloudImpl.Class = SpyInstantCloud
        DigitalOceanHost.Class = FakeCloudHost

        this.apiToken = generateId()
        this.cloud = this.InstantCloud()
    }

    @test()
    protected static async canCreateInstantCloud() {
        assert.isTruthy(this.cloud, 'Instance was not created!')
    }

    @test()
    protected static async runCallsSpinupOnCloudHost() {
        await this.cloud.run()

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

    @test('passingHostTypeReturnsCorrectType: azure', 'azure')
    @test('passingHostTypeReturnsCorrectType: digitalocean', 'digitalocean')
    protected static async passingHostTypeReturnsCorrectConcreteClass(
        hostType: CloudHostType
    ) {
        delete DigitalOceanHost.Class

        const cloud = this.InstantCloud({ hostType })
        const host = cloud.getCloudHost()

        let expectedHostClass: any

        switch (hostType) {
            case 'digitalocean':
                expectedHostClass = 'DigitalOceanHost'
                break
            case 'azure':
                expectedHostClass = 'AzureHost'
                break
        }

        assert.isEqual(
            host.constructor.name,
            expectedHostClass,
            `Invalid host type for ${hostType}!`
        )
    }

    private static getCloudHost(cloud?: SpyInstantCloud) {
        return (cloud ?? this.cloud).getCloudHost() as FakeCloudHost
    }

    private static InstantCloud(options?: Partial<InstantCloudOptions>) {
        return InstantCloudImpl.Create({
            hostType: 'digitalocean',
            apiToken: this.apiToken,
            ...options,
        }) as SpyInstantCloud
    }
}
