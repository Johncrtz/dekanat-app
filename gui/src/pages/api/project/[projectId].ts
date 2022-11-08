import {
    changeProjectName,
    getProjects,
    removeProject,
} from "@intutable/project-management/dist/requests"
import { ProjectDescriptor } from "@intutable/project-management/dist/types"
import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withUserCheck } from "api/utils/withUserCheck"
import {
    withReadWriteConnection,
    withReadOnlyConnection,
} from "api/utils/databaseConnection"
import { withSessionRoute } from "auth"

/**
 * GET a single project @type {ProjectDescriptor}.
 *
 * @tutorial
 * ```
 * - URL: `/api/project/[id]` e.g. `/api/project/1`
 * ```
 */
const GET = withCatchingAPIRoute(
    async (req, res, projectId: ProjectDescriptor["id"]) => {
        const user = req.session.user!

        const project = await withReadOnlyConnection(user, async sessionID => {
            const allProjects = await coreRequest<ProjectDescriptor[]>(
                getProjects(sessionID, user.id),
                user.authCookie
            )

            const project = allProjects.find(proj => proj.id === projectId)
            if (project == null)
                throw new Error(`could not find project #${projectId}`)
            return project
        })

        res.status(200).json(project)
    }
)

/**
 * PATCH/update the name of a single project.
 * Returns the updated project {@type {ProjectDescriptor}}.
 *
 * // TODO: In a future version this api route will be able to adjust more than the name.
 *
 * @tutorial
 * ```
 * - URL: `/api/project/[id]` e.g. `/api/project/1`
 * - Body: {
 *     newName: {@type {ProjectDescriptor["name"]}}
 *   }
 * ```
 */
const PATCH = withCatchingAPIRoute(
    async (req, res, projectId: ProjectDescriptor["id"]) => {
        const { newName } = req.body as {
            newName: ProjectDescriptor["name"]
        }
        const user = req.session.user!

        const updatedProject = await withReadWriteConnection(
            user,
            async sessionID => {
                // check if name is taken
                const projects = await coreRequest<ProjectDescriptor[]>(
                    getProjects(sessionID, user.id),
                    user.authCookie
                )

                const isTaken = projects
                    .map(proj => proj.name.toLowerCase())
                    .includes(newName.toLowerCase())
                if (isTaken) throw new Error("alreadyTaken")

                // rename project in project-management
                return coreRequest<ProjectDescriptor>(
                    changeProjectName(sessionID, projectId, newName),
                    user.authCookie
                )
            }
        )

        res.status(200).json(updatedProject)
    }
)

/**
 * DELETE a project. Returns an empty object.
 *
 * @tutorial
 * ```
 * - URL: `/api/project/[id]` e.g. `/api/project/1`
 * ```
 */
const DELETE = withCatchingAPIRoute(
    async (req, res, projectId: ProjectDescriptor["id"]) => {
        const user = req.session.user!
        // delete project in project-management
        await withReadWriteConnection(user, async sessionID => {
            return coreRequest(
                removeProject(sessionID, projectId),
                user.authCookie
            )
        })

        res.status(200).json({})
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
            case "PATCH":
                await PATCH(req, res, projectId)
                break
            case "DELETE":
                await DELETE(req, res, projectId)
                break
            default:
                res.setHeader("Allow", ["GET", "PATCH", "DELETE"])
                res.status(405).end(`Method ${method} Not Allowed`)
        }
    })
)
