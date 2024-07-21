declare module 'digitalocean' {
    export function client(apiToken: string): DigitalOceanClient

    export interface DigitalOceanClient {
        droplets: DropletService
    }

    export interface DropletService {
        create(options: CreateDropletOptions): Promise<Droplet>
    }

    export interface CreateDropletOptions {
        name: string
        region: string
        size: string
        image: string
        ssh_keys?: (number | string)[]
        backups?: boolean
        ipv6?: boolean
        user_data?: string | null
        private_networking?: boolean | null
        volumes?: string[] | null
        tags?: string[]
    }

    export interface Droplet {
        id: number
        name: string
        memory: number
        vcpus: number
        disk: number
        locked: boolean
        status: string
        kernel: Kernel | null
        created_at: string
        features: string[]
        backup_ids: number[]
        next_backup_window: NextBackupWindow | null
        snapshot_ids: number[]
        image: Image
        volume_ids: string[]
        size: Size
        size_slug: string
        networks: Networks
        region: Region
        tags: string[]
    }
}
