import AzureHost from './AzureHost'
import DigitalOceanHost from './DigitalOceanHost'

export default class CloudHostFactory {
    public static Create(hostType: CloudHostType, apiToken: string) {
        const options = {
            apiToken,
            name: 'example-droplet',
            region: 'nyc3',
            size: 's-1vcpu-1gb',
            image: 'ubuntu-20-04-x64',
        }
        switch (hostType) {
            case 'digitalocean':
                return DigitalOceanHost.Create(options)
            case 'azure':
                return AzureHost.Create(options)
        }
    }
}

export interface CloudHost {
    spinup(): Promise<void>
}

export type CloudHostConstructor = new (options: CloudHostOptions) => CloudHost

export interface CloudHostOptions {
    apiToken: string
    name: string
    region: string
    size: string
    image: string
}

export type CloudHostType = 'digitalocean' | 'azure'
