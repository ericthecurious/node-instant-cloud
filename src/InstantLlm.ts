export default class InstantLlmImpl {
    public static Class?: InstantLlmConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public async run() {}
}

export interface InstantLlm {
    run(): Promise<void>
}

export type InstantLlmConstructor = new () => InstantLlm
