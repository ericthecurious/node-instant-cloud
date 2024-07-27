import DigitalOceanHost from './DigitalOceanHost'

export default class CloudHostFactory {
    public static Create(options: CloudHostOptions) {
        return DigitalOceanHost.Create(options)
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

export type CloudHostType = 'digitalocean'
