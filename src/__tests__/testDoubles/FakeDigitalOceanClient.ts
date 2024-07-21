import { DigitalOceanClient, Droplet } from 'digitalocean'

export default class FakeDigitalOceanClient implements DigitalOceanClient {
    public droplets = {
        create: async () => {
            return {} as Droplet
        },
    }
}
