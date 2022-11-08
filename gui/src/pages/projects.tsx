import { ProjectDescriptor } from "@intutable/project-management/dist/types"
import AddIcon from "@mui/icons-material/Add"
import { useTheme } from "@mui/material/styles"
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
import { fetcher } from "api"
import { withSessionSsr } from "auth"
import MetaTitle from "components/MetaTitle"
import { useProjects, useProjectsConfig } from "hooks/useProjects"
import { useSnacki } from "hooks/useSnacki"
import type { InferGetServerSidePropsType, NextPage } from "next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { SWRConfig } from "swr"
import { makeError } from "utils/error-handling/utils/makeError"
import { prepareName } from "utils/validateName"
import { withSSRCatch } from "utils/withSSRCatch"

type ProjectContextMenuProps = {
    anchorEL: Element
    open: boolean
    onClose: () => void
    children: Array<React.ReactNode> | React.ReactNode // overwrite implicit `children`
}
const ProjectContextMenu: React.FC<ProjectContextMenuProps> = props => {
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
type AddProjectCardProps = {
    handleCreate: () => Promise<void>
    children?: React.ReactNode
}

const AddProjectCard: React.FC<AddProjectCardProps> = props => {
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

type ProjectCardProps = {
    project: ProjectDescriptor
    handleRename: (project: ProjectDescriptor) => Promise<void>
    handleDelete: (project: ProjectDescriptor) => Promise<void>
    children: string
}
const ProjectCard: React.FC<ProjectCardProps> = props => {
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

    const handleOnClick = () => router.push(`/project/${props.project.id}`)

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
                <ProjectContextMenu
                    anchorEL={anchorEL}
                    open={anchorEL != null}
                    onClose={handleCloseContextMenu}
                >
                    <Box
                        onClick={async () => {
                            handleCloseContextMenu()
                            await props.handleRename(props.project)
                        }}
                    >
                        Umbenennen
                    </Box>
                    <Box
                        onClick={async () => {
                            handleCloseContextMenu()
                            await props.handleDelete(props.project)
                        }}
                        sx={{ color: theme.palette.warning.main }}
                    >
                        Löschen
                    </Box>
                </ProjectContextMenu>
            )}
        </>
    )
}

const ProjectList: React.FC = () => {
    const theme = useTheme()
    const { snackError } = useSnacki()

    const { projects, error, mutate } = useProjects()

    const handleCreateProject = async () => {
        if (projects == null) return
        try {
            const namePrompt = prompt("Benenne Dein neues Projekt!")
            if (!namePrompt) return
            const name = prepareName(namePrompt)
            await fetcher<ProjectDescriptor>({
                url: "/api/project",
                body: { name },
            })
            await mutate()
        } catch (error) {
            const errKey = (error as Record<string, string>).error
            let errMsg: string
            switch (errKey) {
                case "alreadyTaken":
                    errMsg = `Name bereits vergeben.`
                    break
                case "invalidName":
                    errMsg =
                        `Ungültiger Name: darf nur Buchstaben, Ziffern` +
                        ` und Unterstriche enthalten.`
                    break
                default:
                    errMsg = "Das Projekt konnte nicht erstellt werden!"
            }
            snackError(errMsg)
        }
    }

    const handleRenameProject = async (project: ProjectDescriptor) => {
        if (projects == null) return
        try {
            const name = prompt("Gib einen neuen Namen für dein Projekt ein:")
            if (!name) return
            await fetcher<ProjectDescriptor>({
                url: `/api/project/${project.id}`,
                body: { newName: name },
                method: "PATCH",
            })
            await mutate()
        } catch (error) {
            const err = makeError(error)
            if (err.message === "alreadyTaken")
                snackError("Zwei Projekte können nicht denselben Namen haben!")
            else snackError("Das Projekt konnte nicht umbenannt werden!")
        }
    }

    const handleDeleteProject = async (project: ProjectDescriptor) => {
        if (projects == null) return
        try {
            const confirmed = confirm(
                "Möchtest du dein Projekt wirklich löschen?"
            )
            if (!confirmed) return
            await fetcher({
                url: `/api/project/${project.id}`,
                method: "DELETE",
            })
            await mutate()
        } catch (error) {
            snackError("Projekt konnte nicht gelöscht werden!")
        }
    }

    if (error) return <>Error</>
    if (projects == null) return <CircularProgress />

    return (
        <>
            <MetaTitle title="Projekte" />
            <Typography variant="h5" sx={{ mb: theme.spacing(4) }}>
                Deine Projekte
            </Typography>
            <Grid container spacing={2}>
                {projects.map((proj: ProjectDescriptor, i: number) => (
                    <Grid item key={i}>
                        <ProjectCard
                            handleDelete={handleDeleteProject}
                            handleRename={handleRenameProject}
                            project={proj}
                        >
                            {proj.name}
                        </ProjectCard>
                    </Grid>
                ))}
                <Grid item>
                    <AddProjectCard handleCreate={handleCreateProject}>
                        <AddIcon />
                    </AddProjectCard>
                </Grid>
            </Grid>
        </>
    )
}

type PageProps = {
    fallback: { [cacheKey: string]: ProjectDescriptor[] }
}
const Page: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ fallback }) => (
    <SWRConfig value={{ fallback }}>
        <ProjectList />
    </SWRConfig>
)

export const getServerSideProps = withSSRCatch(
    withSessionSsr<PageProps>(async context => {
        const user = context.req.session.user

        if (user == null || user.isLoggedIn === false)
            return {
                notFound: true,
            }

        const projects = await fetcher<ProjectDescriptor[]>({
            url: `/api/projects`,
            method: "GET",
            headers: context.req.headers as HeadersInit,
        })

        return {
            props: {
                fallback: {
                    [useProjectsConfig.cacheKey]: projects,
                },
            },
        }
    })
)

export default Page
