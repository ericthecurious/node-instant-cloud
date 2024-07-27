import { CloudHost, CloudHostOptions } from '../../hosts/CloudHostFactory'

export class FakeCloudHost implements CloudHost {
    public passedOptions?: CloudHostOptions
    public wasSpinupCalled = false

    public constructor(options: CloudHostOptions) {
        this.passedOptions = options
    }

    public async spinup() {
        this.wasSpinupCalled = true
    }
}
