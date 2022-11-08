import { listViews, tableId, ViewDescriptor } from "@intutable/lazy-views"
import { getTablesFromProject } from "@intutable/project-management/dist/requests"
import {
    ProjectDescriptor,
    TableDescriptor,
} from "@intutable/project-management/dist/types"
import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withReadOnlyConnection } from "api/utils/databaseConnection"
import { withUserCheck } from "api/utils/withUserCheck"
import { withSessionRoute } from "auth"

/**
 * List tables that belong to a project. These are actually views from teh
 * `lazy-views` plugin.
 * @tutorial
 * ```
 * URL: `/api/tables/[projectId]`
 * ```
 */
const GET = withCatchingAPIRoute(
    async (req, res, projectId: ProjectDescriptor["id"]) => {
        const user = req.session.user!
        const tables = await withReadOnlyConnection(user, async sessionID => {
            const baseTables = await coreRequest<TableDescriptor[]>(
                getTablesFromProject(sessionID, projectId),
                user.authCookie
            )

            const tables = await Promise.all(
                baseTables.map(t =>
                    coreRequest<ViewDescriptor[]>(
                        listViews(sessionID, tableId(t.id)),
                        user.authCookie
                    )
                )
            ).then(tableLists => tableLists.flat())
            return tables
        })
        res.status(200).json(tables)
    }
)

export default withSessionRoute(
    withUserCheck(async (req, res) => {
        const { query, method } = req
        const projectId = parseInt(query.projectId as string)

        switch (method) {
            case "GET":
                await GET(req, res, projectId)
                break
            default:
                res.setHeader("Allow", ["GET"])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
    })
)
