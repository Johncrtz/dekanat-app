import { ColumnType } from "@intutable/database/dist/types"
import {
    addJoinToView,
    getViewInfo,
    JoinDescriptor,
    selectable,
    viewId,
    ViewInfo,
} from "@intutable/lazy-views"
import { createColumnInTable } from "@intutable/project-management/dist/requests"
import { ColumnDescriptor as PM_Column } from "@intutable/project-management/dist/types"
import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withUserCheck } from "api/utils/withUserCheck"
import { withReadWriteConnection } from "api/utils/databaseConnection"
import { withSessionRoute } from "auth"
import makeForeignKeyName from "utils/makeForeignKeyName"
import { linkColumnAttributes } from "@backend/defaults"
import { addColumnToTable } from "@backend/requests"

/**
 * Add a link from one table view to another. The target table will be
 * represented by its user primary column, and the latter also provides
 * an "add more linked columns" feature in its context menu.
 * This requires creating an extra FK column in the underlying table. The join
 * and the FK can be deleted by deleting the column that represents the link.
 * @tutorial
 * ```
 * - Body: {
 *   tableId: {@type number} The ID of the table in which to create the link.
 *   foreignViewId {@type number} The ID of the table to which the link points.
 * }
 * ```
 */
const POST = withCatchingAPIRoute(async (req, res) => {
    const { tableId, foreignTableId } = req.body as {
        tableId: number
        foreignTableId: number
    }
    const user = req.session.user!

    const join = await withReadWriteConnection(user, async sessionID => {
        const tableInfo = await coreRequest<ViewInfo>(
            getViewInfo(sessionID, tableId),
            user.authCookie
        )

        // create a table column with the foreign key
        const fkColumn = await coreRequest<PM_Column>(
            createColumnInTable(
                sessionID,
                selectable.getId(tableInfo.source),
                makeForeignKeyName(tableInfo),
                ColumnType.integer
            ),
            user.authCookie
        )

        // find out the foreign table's ID column (the actual primary key)
        // and its "user primary" column which will be used to represent it
        // to the user
        const foreignTableInfo = await coreRequest<ViewInfo>(
            getViewInfo(sessionID, foreignTableId),
            user.authCookie
        )
        const foreignIdColumn = foreignTableInfo.columns.find(
            c => c.name === "_id"
        )!
        const userPrimaryColumn = foreignTableInfo.columns.find(
            c => c.attributes.userPrimary! === 1
        )!
        const displayName = (userPrimaryColumn.attributes.displayName ||
            userPrimaryColumn.name) as string

        // create the join metadata in the view plugin
        const join = await coreRequest<JoinDescriptor>(
            addJoinToView(sessionID, tableId, {
                foreignSource: viewId(foreignTableId),
                on: [fkColumn.id, "=", foreignIdColumn.id],
                columns: [],
            }),
            user.authCookie
        )

        const columnIndex = tableInfo.columns.length
        const attributes = linkColumnAttributes(displayName, columnIndex)

        // create representative link column
        await coreRequest(
            addColumnToTable(
                sessionID,
                tableId,
                { parentColumnId: userPrimaryColumn.id, attributes },
                join.id
            ),
            user.authCookie
        )
        return join
    })

    res.status(200).json(join)
})

export default withSessionRoute(
    withUserCheck(async (req, res) => {
        switch (req.method) {
            case "POST":
                await POST(req, res)
                break
            default:
                res.setHeader("Allow", ["POST"])
                res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    })
)
