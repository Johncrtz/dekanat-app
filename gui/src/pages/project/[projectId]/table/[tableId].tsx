import LoadingSkeleton from "@datagrid/LoadingSkeleton"
import NoRowsFallback from "@datagrid/NoRowsFallback/NoRowsFallback"
import { RowRenderer } from "@datagrid/renderers"
import Toolbar from "@datagrid/Toolbar/Toolbar"
import * as ToolbarItem from "@datagrid/Toolbar/ToolbarItems"
import { ViewDescriptor } from "@intutable/lazy-views/dist/types"
import { ProjectDescriptor } from "@intutable/project-management/dist/types"
import { Grid, Box, Button, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { fetcher } from "api"
import { withSessionSsr } from "auth"
import MetaTitle from "components/MetaTitle"
import Link from "components/Link"
import { TableNavigator } from "components/TableNavigator"
import { ViewNavigator } from "components/ViewNavigator"
import {
    APIContextProvider,
    HeaderSearchFieldProvider,
    useAPI,
    useHeaderSearchField,
} from "context"
import { useBrowserInfo } from "hooks/useBrowserInfo"
import { useRow } from "hooks/useRow"
import { useSnacki } from "hooks/useSnacki"
import { useView } from "hooks/useView"
import { useTables } from "hooks/useTables"
import { InferGetServerSidePropsType, NextPage } from "next"
import React, { useEffect, useState } from "react"
import DataGrid, { CalculatedColumn, RowsChangeData } from "react-data-grid"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import type { Row, TableData, ViewData } from "types"
import { DynamicRouteQuery } from "types/DynamicRouteQuery"
import { rowKeyGetter } from "utils/rowKeyGetter"
import { withSSRCatch } from "utils/withSSRCatch"
import { useThemeToggler } from "pages/_app"
import { DetailedRowView } from "@datagrid/Detail Window/DetailedRowView"
import {
    SelectedRowsContextProvider,
    useSelectedRows,
} from "context/SelectedRowsContext"
import { useCellNavigation } from "hooks/useCellNavigation"
import { ClipboardUtil } from "utils/ClipboardUtil"

const TablePage: React.FC = () => {
    const theme = useTheme()
    const { getTheme } = useThemeToggler()
    const { snackWarning, closeSnackbar, snackError, snack } = useSnacki()
    const { isChrome } = useBrowserInfo()
    const { selectedRows, setSelectedRows } = useSelectedRows()
    const { cellNavigationMode } = useCellNavigation()

    // warn if browser is not chrome
    useEffect(() => {
        if (isChrome === false)
            snackWarning(
                "Zzt. wird für Tabellen nur Google Chrome (für Browser) unterstützt!",
                {
                    persist: true,
                    action: key => (
                        <Button
                            onClick={() => closeSnackbar(key)}
                            sx={{ color: "white" }}
                        >
                            Ich verstehe
                        </Button>
                    ),
                    preventDuplicate: true,
                }
            )

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isChrome])

    // #################### states ####################

    const { headerHeight } = useHeaderSearchField()
    const { project } = useAPI()
    const { data, error } = useView()
    const { tables: tableList } = useTables()
    const { getRowId, updateRow } = useRow()

    // views side panel
    const [viewNavOpen, setViewNavOpen] = useState<boolean>(false)

    // Detailed View
    const [detailedViewOpen, setDetailedViewOpen] = useState<boolean>(false)
    const [detailedViewData, setDetailedViewData] = useState<{
        row: Row
        column: CalculatedColumn<Row>
    } | null>(null)

    // TODO: this should not be here and does not work as intended in this way
    const partialRowUpdate = async (
        rows: Row[],
        changeData: RowsChangeData<Row>
    ): Promise<void> => {
        const changedRow = rows[changeData.indexes[0]]
        const col = changeData.column
        const changedValue = changedRow[col.key]

        // BUG: in react-data-grid RowsChangeData.column is sometimes undefined here, this is a known bug
        // hopefully (at least it seems like it did fix it) the last beta version (7.0.0-beta.14) fixed this bug
        // (see 9753a70240afdaa1b6c7cca0c4d555abee77a01f)

        await updateRow(col, getRowId(changedRow), changedValue)
    }

    const tableSize = {
        xs:
            viewNavOpen && detailedViewOpen
                ? 8
                : viewNavOpen != detailedViewOpen
                ? 10
                : 12,
        xl:
            viewNavOpen && detailedViewOpen
                ? 10
                : viewNavOpen != detailedViewOpen
                ? 11
                : 12,
    }
    if (tableList == null || data == null) return <LoadingSkeleton />

    const clipboardUtil = new ClipboardUtil(data!.columns)

    return (
        <>
            <MetaTitle title={project!.name} />
            <Typography
                sx={{
                    mb: theme.spacing(4),
                    color: theme.palette.text.secondary,
                }}
            >
                Deine Tabellen in{" "}
                <Link
                    href={`/project/${project!.id}`}
                    muiLinkProps={{
                        underline: "hover",
                        color: theme.palette.primary.main,
                        textDecoration: "none",
                    }}
                >
                    {project!.name}
                </Link>
            </Typography>

            <TableNavigator />

            {error ? (
                <span>Die Tabelle konnte nicht geladen Werden</span>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {viewNavOpen && (
                            <Grid item xs={2} xl={1}>
                                <ViewNavigator open={viewNavOpen} />
                            </Grid>
                        )}

                        <Grid item xs={tableSize.xs} xl={tableSize.xl}>
                            <Box>
                                <Toolbar position="top">
                                    <ToolbarItem.Views
                                        handleClick={() =>
                                            setViewNavOpen(prev => !prev)
                                        }
                                        open={viewNavOpen}
                                    />
                                    <ToolbarItem.AddCol />
                                    <ToolbarItem.AddLink />
                                    <ToolbarItem.AddRow />
                                    <ToolbarItem.EditFilters />
                                    <ToolbarItem.ExportView />
                                    <ToolbarItem.DetailView
                                        handleClick={() =>
                                            setDetailedViewOpen(prev => !prev)
                                        }
                                        open={detailedViewOpen}
                                    />
                                </Toolbar>

                                <DndProvider backend={HTML5Backend}>
                                    <DataGrid
                                        className={
                                            "rdg-" + getTheme() + " fill-grid"
                                        }
                                        rows={data.rows}
                                        columns={data.columns}
                                        components={{
                                            noRowsFallback: <NoRowsFallback />,
                                            rowRenderer: RowRenderer,
                                            // checkboxFormatter: // TODO: adjust
                                            // sortIcon: // TODO: adjust
                                        }}
                                        rowKeyGetter={rowKeyGetter}
                                        defaultColumnOptions={{
                                            sortable: true,
                                            resizable: true,
                                            // formatter: // TODO: adjust
                                        }}
                                        onCopy={event =>
                                            clipboardUtil.handleOnCopy(
                                                event,
                                                error => {
                                                    error
                                                        ? snackError(error)
                                                        : snack(
                                                              "1 Zelle kopiert"
                                                          )
                                                }
                                            )
                                        }
                                        // onFill={e =>
                                        //     clipboardUtil.handleOnFill(e)
                                        // }
                                        onPaste={e =>
                                            clipboardUtil.handleOnPaste(
                                                e,
                                                error => {
                                                    error
                                                        ? snackError(error)
                                                        : snack(
                                                              "1 Zelle eingefügt"
                                                          )
                                                }
                                            )
                                        }
                                        selectedRows={selectedRows}
                                        onSelectedRowsChange={setSelectedRows}
                                        onRowsChange={partialRowUpdate}
                                        headerRowHeight={headerHeight}
                                        onRowClick={(row, column) =>
                                            setDetailedViewData({ row, column })
                                        }
                                        cellNavigationMode={cellNavigationMode}
                                    />
                                </DndProvider>

                                <Toolbar position="bottom">
                                    <ToolbarItem.Connection status="connected" />
                                </Toolbar>
                            </Box>
                        </Grid>

                        {detailedViewOpen && (
                            <Grid item xs={2} xl={1}>
                                <DetailedRowView
                                    data={detailedViewData || undefined}
                                    open={detailedViewOpen}
                                />
                            </Grid>
                        )}
                    </Grid>
                </>
            )}
        </>
    )
}

type PageProps = {
    project: ProjectDescriptor
    /**
     * In order to allow links/joins, tables are actually implemented using
     * views. The user-facing views (filtering, hiding columns, etc.) are
     * implemented as views on views, so be careful not to get confused.
     */
    table: ViewDescriptor
    tableList: ViewDescriptor[]
    /**
     * The current filter view, which selects from the table view
     * {@link table}
     */
    view: ViewDescriptor
    viewList: ViewDescriptor[]
    // fallback: {
    //     [cacheKey: string]: ViewData
    // }
}

const Page: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ project, table, view }) => {
    return (
        <APIContextProvider project={project} table={table} view={view}>
            <SelectedRowsContextProvider>
                <HeaderSearchFieldProvider>
                    <TablePage />
                </HeaderSearchFieldProvider>
            </SelectedRowsContextProvider>
        </APIContextProvider>
    )
}

export const getServerSideProps = withSSRCatch(
    withSessionSsr<PageProps>(async context => {
        const query = context.query as DynamicRouteQuery<
            typeof context.query,
            "tableId" | "projectId"
        >

        const user = context.req.session.user

        if (user == null || user.isLoggedIn === false)
            return {
                notFound: true,
            }

        const projectId: ProjectDescriptor["id"] = Number.parseInt(
            query.projectId
        )
        const tableId: ViewDescriptor["id"] = Number.parseInt(query.tableId)

        if (isNaN(projectId) || isNaN(tableId))
            return {
                notFound: true,
            }

        // workaround until PM exposes a "get project" method
        const projects = await fetcher<ProjectDescriptor[]>({
            url: `/api/projects`,
            method: "GET",
            headers: context.req.headers as HeadersInit,
        })
        const project = projects.find(p => p.id === projectId)

        if (project == null) return { notFound: true }

        const tableList = await fetcher<ViewDescriptor[]>({
            url: `/api/tables/${projectId}`,
            method: "GET",
            headers: context.req.headers as HeadersInit,
        })
        const tableData = await fetcher<TableData.Serialized>({
            url: `/api/table/${tableId}`,
            method: "GET",
            headers: context.req.headers as HeadersInit,
        })
        const viewList = await fetcher<ViewDescriptor[]>({
            url: `/api/views/${tableId}`,
            method: "GET",
            headers: context.req.headers as HeadersInit,
        })

        if (viewList.length === 0) {
            return { notFound: true }
        }
        const view: ViewDescriptor = viewList[0]

        const data = await fetcher<ViewData.Serialized>({
            url: `/api/view/${view.id}`,
            method: "GET",
            headers: context.req.headers as HeadersInit,
        })

        return {
            props: {
                project,
                table: tableData.metadata.descriptor,
                tableList,
                view: data.descriptor,
                viewList,
                // fallback: {
                //     [unstable_serialize({
                //         url: `/api/table/${tableId}`,
                //         method: "GET",
                //     })]: data,
                // },
            },
        }
    })
)

export default Page
