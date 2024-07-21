export default class InstantLlmImpl {
    public static Class?: InstantLlmConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface InstantLlm {}

export type InstantLlmConstructor = new () => InstantLlm
