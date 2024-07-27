import { client } from 'digitalocean'
import {
    CloudHost,
    CloudHostConstructor,
    CloudHostOptions,
} from '../CloudHostFactory'

export default class DigitalOceanHost implements CloudHost {
    public static Class?: CloudHostConstructor
    public static client = client

    private apiToken: string
    private name: string
    private region: string
    private size: string
    private image: string

    protected constructor(options: CloudHostOptions) {
        const { apiToken, name, region, size, image } = options

        this.apiToken = apiToken
        this.name = name
        this.region = region
        this.size = size
        this.image = image
    }

    public static Create(options: CloudHostOptions) {
        return new (this.Class ?? this)(options)
    }

    public async spinup() {
        await this.client.droplets.create({
            name: this.name,
            region: this.region,
            size: this.size,
            image: this.image,
        })
    }

    private get client() {
        return DigitalOceanHost.client(this.apiToken)
    }
}
