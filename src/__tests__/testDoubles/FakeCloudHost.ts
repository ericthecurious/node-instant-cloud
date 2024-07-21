import { CloudHost } from '../../CloudHost'

export class FakeCloudHost implements CloudHost {
    public wasSpinupCalled = false

    public async spinup() {
        this.wasSpinupCalled = true
    }
}
