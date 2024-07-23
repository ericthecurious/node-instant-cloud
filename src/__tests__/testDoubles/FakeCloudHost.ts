import { CloudHost, CloudHostConstructorOptions } from '../../CloudHost'

export class FakeCloudHost implements CloudHost {
    public wasSpinupCalled = false
    public passedOptions: CloudHostConstructorOptions | undefined

    public constructor(options: CloudHostConstructorOptions) {
        this.passedOptions = options
    }

    public async spinup() {
        this.wasSpinupCalled = true
    }
}
