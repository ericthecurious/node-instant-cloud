import { CloudHost, CloudHostOptions } from '../../CloudHostFactory'

export class FakeCloudHost implements CloudHost {
    public wasSpinupCalled = false
    public passedOptions?: CloudHostOptions

    public constructor(options: CloudHostOptions) {
        this.passedOptions = options
    }

    public async spinup() {
        this.wasSpinupCalled = true
    }
}
