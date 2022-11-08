import { deleteRow, insert, update } from "@intutable/database/dist/requests"
import { getTableData } from "@intutable/project-management/dist/requests"
import {
    TableDescriptor,
    TableData,
} from "@intutable/project-management/dist/types"
import { coreRequest } from "api/utils"
import { withCatchingAPIRoute } from "api/utils/withCatchingAPIRoute"
import { withUserCheck } from "api/utils/withUserCheck"
import { withSessionRoute } from "auth"
import { withReadWriteConnection } from "api/utils/databaseConnection"
import { Row } from "types"
import Obj from "types/Obj"

// Intermediate type representing a row whose index is to be changed.
type IndexChange = {
    _id: number
    index: number
    oldIndex: number
}

// compare two rows by index
const byIndex = (a: Obj, b: Obj) =>
    (a.index as number) > (b.index as number) ? 1 : -1

/**
 * Create a new row with some starting values. Ensuring that the types of
 * `values` match up with what the table can take is up to the user.
 * @tutorial
 * ```
 * Body: {
 *    table: {@type {TableDescriptor}}
 *    values: {@type {Record<string, unknown>}}
 * }
 * ```
 */
const POST = withCatchingAPIRoute(async (req, res) => {
    const {
        table,
        values: rowToInsert,
        atIndex,
    } = req.body as {
        table: TableDescriptor
        values: Obj
        atIndex?: number
    }
    const user = req.session.user!

    const rowId = await withReadWriteConnection(user, async sessionID => {
        const oldData = await coreRequest<TableData<unknown>>(
            getTableData(sessionID, table.id),
            user.authCookie
        )

        // mind-bending "insert at certain index" logic... good lord!
        let newRow: Obj
        if (atIndex == null || atIndex === oldData.rows.length)
            newRow = { ...rowToInsert, index: oldData.rows.length }
        else {
            newRow = { ...rowToInsert, index: atIndex }
            const shiftedRows = (oldData.rows as Row[])
                .sort(byIndex)
                .slice(atIndex)
                .map((row: Row) => ({
                    _id: row._id as number,
                    oldIndex: row.index as number,
                    index: (row.index as number) + 1,
                }))

            await Promise.all(
                shiftedRows.map(
                    async (row: Obj) =>
                        await coreRequest(
                            update(sessionID, table.key, {
                                condition: ["_id", row._id],
                                update: { index: row.index },
                            }),
                            user.authCookie
                        )
                )
            )
        }

        // create row in database
        return coreRequest<number>(
            insert(sessionID, table.key, newRow, ["_id"]),
            user.authCookie
        )
    })

    res.status(200).send(rowId)
})

/**
 * Update a row, identified by `condition`. Ensuring that the types of
 * `values` match up with what the table can take is up to the user.
 * @tutorial
 * ```
 * Body: {
 *    table: {@type {TableDescriptor}}
 *    condition: {@type {Array<unknown>}}
 *    values: {@type {Record<string, unknown>}}
 * }
 * ```
 */
const PATCH = withCatchingAPIRoute(async (req, res) => {
    const {
        table,
        condition,
        update: rowUpdate,
    } = req.body as {
        table: TableDescriptor
        condition: unknown[]
        update: { [index: string]: unknown }
    }

    const user = req.session.user!
    const updatedRow = await withReadWriteConnection(user, async sessionID => {
        return coreRequest<Row>(
            update(sessionID, table.key, {
                condition,
                update: rowUpdate,
            }),
            user.authCookie
        )
    })

    res.status(200).json(updatedRow)
})

/**
 * Delete a row, identified by `condition`.
 * @tutorial
 * ```
 * Body: {
 *    table: {@type {TableDescriptor}}
 *    condition: {@type {Array<unknown>}}
 * }
 * ```
 */
const DELETE = withCatchingAPIRoute(async (req, res) => {
    const { table, condition } = req.body as {
        table: TableDescriptor
        condition: unknown[]
    }
    const user = req.session.user!

    await withReadWriteConnection(user, async sessionID => {
        await coreRequest(
            deleteRow(sessionID, table.key, condition),
            user.authCookie
        )
        // shift indices
        const newData = await coreRequest<TableData<unknown>>(
            getTableData(sessionID, table.id),
            user.authCookie
        )

        const rows = newData.rows as Row[]
        const newIndices: IndexChange[] = rows
            .sort(byIndex)
            .map((row: Row, newIndex: number) => ({
                _id: row._id as number,
                oldIndex: row.index as number,
                index: newIndex,
            }))
            .filter(row => row.oldIndex !== row.index)

        await Promise.all(
            newIndices.map(async ({ _id, index }) =>
                coreRequest(
                    update(sessionID, table.key, {
                        update: { index: index },
                        condition: ["_id", _id],
                    }),
                    user.authCookie
                )
            )
        )
    })

    res.status(200).json({})
})

export default withSessionRoute(
    withUserCheck(async (req, res) => {
        switch (req.method) {
            case "POST":
                await POST(req, res)
                break
            case "PATCH":
                await PATCH(req, res)
                break
            case "DELETE":
                await DELETE(req, res)
                break
            default:
                res.status(
                    ["HEAD", "GET"].includes(req.method!) ? 500 : 501
                ).send("This method is not supported!")
        }
    })
)
