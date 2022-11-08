import { ViewDescriptor } from "@intutable/lazy-views"
import { ProjectDescriptor } from "@intutable/project-management/dist/types"
import AddIcon from "@mui/icons-material/Add"
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { fetcher } from "api"
import { withSessionSsr } from "auth"
import MetaTitle from "components/MetaTitle"
import Link from "components/Link"
import { useSnacki } from "hooks/useSnacki"
import { useTables, useTablesConfig } from "hooks/useTables"
import { InferGetServerSidePropsType, NextPage } from "next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { SWRConfig, unstable_serialize } from "swr"
import { DynamicRouteQuery } from "types/DynamicRouteQuery"
import { makeError } from "utils/error-handling/utils/makeError"
import { prepareName } from "utils/validateName"
import { withSSRCatch } from "utils/withSSRCatch"

type TableContextMenuProps = {
    anchorEL: Element
    open: boolean
    onClose: () => void
    children?: React.ReactNode
}
const TableContextMenu: React.FC<TableContextMenuProps> = props => {
    const theme = useTheme()
    return (
        <Menu
            elevation={0}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            // transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={props.open}
            anchorEl={props.anchorEL}
            onClose={props.onClose}
            PaperProps={{
                sx: {
                    boxShadow: theme.shadows[1],
                },
            }}
        >
            {Array.isArray(props.children) ? (
                props.children.map((item, i) => (
                    <MenuItem key={i}>{item}</MenuItem>
                ))
            ) : (
                <MenuItem>{props.children}</MenuItem>
            )}
        </Menu>
    )
}
type AddTableCardProps = {
    handleCreate: () => Promise<void>
    children?: React.ReactNode
}

const TableProjectCard: React.FC<AddTableCardProps> = props => {
    const theme = useTheme()
    return (
        <Card
            onClick={async () => {
                await props.handleCreate()
            }}
            sx={{
                minWidth: 150,
                minHeight: 150,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": {
                    bgcolor: theme.palette.action.hover,
                },
            }}
        >
            <CardContent>{props.children}</CardContent>
        </Card>
    )
}

type TableCardProps = {
    project: ProjectDescriptor
    table: ViewDescriptor
    handleRename: (tableView: ViewDescriptor) => Promise<void>
    handleDelete: (tableView: ViewDescriptor) => Promise<void>
    children: string
}
const TableCard: React.FC<TableCardProps> = props => {
    const router = useRouter()
    const theme = useTheme()
    const [anchorEL, setAnchorEL] = useState<Element | null>(null)

    const handleOpenContextMenu = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault()
        setAnchorEL(event.currentTarget)
    }
    const handleCloseContextMenu = () => setAnchorEL(null)

    const handleOnClick = () => {
        router.push("/project/" + props.project.id + "/table/" + props.table.id)
    }

    return (
        <>
            <Card
                onClick={handleOnClick}
                onContextMenu={handleOpenContextMenu}
                sx={{
                    minWidth: 150,
                    minHeight: 150,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&:hover": {
                        bgcolor: theme.palette.action.hover,
                    },
                }}
            >
                <CardContent>{props.children}</CardContent>
            </Card>

            {anchorEL && (
                <TableContextMenu
                    anchorEL={anchorEL}
                    open={anchorEL != null}
                    onClose={handleCloseContextMenu}
                >
                    <Box
                        onClick={async () => {
                            handleCloseContextMenu()
                            await props.handleRename(props.table)
                        }}
                    >
                        Umbenennen
                    </Box>
                    <Box
                        onClick={async () => {
                            handleCloseContextMenu()
                            await props.handleDelete(props.table)
                        }}
                        sx={{ color: theme.palette.warning.main }}
                    >
                        Löschen
                    </Box>
                </TableContextMenu>
            )}
        </>
    )
}

type TableListProps = {
    project: ProjectDescriptor
}
const TableList: React.FC<TableListProps> = ({ project }) => {
    const theme = useTheme()
    const { snackError } = useSnacki()

    const { tables, error, mutate } = useTables({ project: project })

    const handleCreateTable = async () => {
        try {
            const namePrompt = prompt("Benenne deine neue Tabelle!")
            if (!namePrompt) return
            const name = prepareName(namePrompt)
            await fetcher({
                url: "/api/table",
                body: {
                    projectId: project.id,
                    name,
                },
            })
            await mutate()
        } catch (error) {
            const errKey = (error as Record<string, string>).error
            let errMsg: string
            switch (errKey) {
                case "alreadyTaken":
                    errMsg = `Name bereits vergeben.`
                    break
                default:
                    errMsg = "Die Tabelle konnte nicht erstellt werden!"
            }
            snackError(errMsg)
        }
    }

    const handleRenameTable = async (tableView: ViewDescriptor) => {
        try {
            const name = prompt("Gib einen neuen Namen für deine Tabelle ein:")
            if (!name) return
            await fetcher({
                url: `/api/table/${tableView.id}`,
                body: {
                    newName: name,
                    project,
                },
                method: "PATCH",
            })
            await mutate()
        } catch (error) {
            const err = makeError(error)
            if (err.message === "alreadyTaken")
                snackError(
                    "Dieser Name wird bereits für eine deiner Tabellen verwendet!"
                )
            else snackError("Die Tabelle konnte nicht umbenannt werden!")
        }
    }

    const handleDeleteTable = async (joinTable: ViewDescriptor) => {
        try {
            const confirmed = confirm(
                "Möchtest du deine Tabelle wirklich löschen?"
            )
            if (!confirmed) return
            await fetcher({
                url: `/api/table/${joinTable.id}`,
                method: "DELETE",
            })
            await mutate()
        } catch (error) {
            snackError("Tabelle konnte nicht gelöscht werden!")
        }
    }

    if (error) return <>Error: {error}</>
    if (tables == null) return <CircularProgress />

    return (
        <>
            <MetaTitle title="Projekte" />
            <Typography
                sx={{
                    mb: theme.spacing(4),
                    color: theme.palette.text.secondary,
                }}
            >
                Zurück zur{" "}
                <Link
                    href={`/projects`}
                    muiLinkProps={{
                        underline: "hover",
                        color: theme.palette.primary.main,
                        textDecoration: "none",
                    }}
                >
                    {"Gesamtübersicht"}
                </Link>
            </Typography>
            <Grid container spacing={2}>
                {tables.map((tbl: ViewDescriptor, i: number) => (
                    <Grid item key={i}>
                        <TableCard
                            table={tbl}
                            handleDelete={handleDeleteTable}
                            handleRename={handleRenameTable}
                            project={project}
                        >
                            {tbl.name}
                        </TableCard>
                    </Grid>
                ))}
                <Grid item>
                    <TableProjectCard handleCreate={handleCreateTable}>
                        <AddIcon />
                    </TableProjectCard>
                </Grid>
            </Grid>
        </>
    )
}

type PageProps = {
    project: ProjectDescriptor
    fallback: { [cackeKey: string]: ViewDescriptor[] }
}
const Page: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ fallback, project }) => (
    <SWRConfig value={{ fallback }}>
        <TableList project={project} />
    </SWRConfig>
)

export const getServerSideProps = withSSRCatch(
    withSessionSsr<PageProps>(async context => {
        const query = context.query as DynamicRouteQuery<
            typeof context.query,
            "projectId"
        >
        const user = context.req.session.user

        if (user == null || user.isLoggedIn === false)
            return {
                notFound: true,
            }

        const projectId: ProjectDescriptor["id"] = Number.parseInt(
            query.projectId
        )
        if (isNaN(projectId))
            return {
                notFound: true,
            }

        const projects = await fetcher<ProjectDescriptor[]>({
            url: `/api/projects`,
            method: "GET",
            headers: context.req.headers as HeadersInit,
        })

        const project = projects.find(p => p.id === projectId)
        if (project == null) return { notFound: true }

        const tables = await fetcher<ViewDescriptor[]>({
            url: `/api/tables/${project.id}`,
            method: "GET",
            headers: context.req.headers as HeadersInit,
        })

        return {
            props: {
                project,
                fallback: {
                    [unstable_serialize(useTablesConfig.cacheKey(projectId))]:
                        tables,
                },
            },
        }
    })
)

export default Page
