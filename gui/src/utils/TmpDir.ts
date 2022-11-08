import tmp from "tmp"

export class TmpDir {
    public readonly path: string
    private removeCallback: () => void
    constructor() {
        const dir = tmp.dirSync({ unsafeCleanup: true })
        this.path = dir.name
        this.removeCallback = dir.removeCallback
    }
    delete() {
        this.removeCallback()
    }
}
