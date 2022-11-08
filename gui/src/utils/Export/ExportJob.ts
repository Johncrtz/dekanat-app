import { ViewDescriptor } from "@intutable/lazy-views"
import { fetcher } from "api"
import { ExportRequest } from "./ExportRequest"

/**
 * Export jobs are used to export views.
 *
 * This class can be used in the frontend.
 */
export class ExportJob {
    constructor(
        readonly view: ViewDescriptor,
        public requestObject: ExportRequest
    ) {}

    /**
     * Sends a request to the API route that handles exports.
     * Returns the file as an object url.
     */
    public async request(): Promise<string> {
        const file = await fetcher<string>({
            url: `/api/util/export/view/${this.view.id}`,
            body: {
                exportRequest: this.requestObject,
            },
            method: "POST",
            headers: {
                "Content-Type": `text/${this.requestObject.file.format}`,
                Accept: `text/${this.requestObject.file.format}`,
            },
            isReadstream: true,
        })

        return file
    }
}
