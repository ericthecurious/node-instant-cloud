import * as dotenv from 'dotenv'
dotenv.config()

import InstantCloudImpl from './InstantCloud'

async function deployTemplate() {
    const cloud = InstantCloudImpl.Create({
        apiToken: 'token',
        hostType: 'azure',
    })

    await cloud.run()
}

deployTemplate().catch(console.error)
