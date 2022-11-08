import { useState } from "react"
import { useRouter } from "next/router"
import { InferGetServerSidePropsType, NextPage } from "next"
import { SWRConfig } from "swr"
import { fetcher } from "api"
import { withSessionSsr } from "auth"
import { withSSRCatch } from "utils/withSSRCatch"
import { IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { User } from "@backend/permissions/types"
import { useUsersAsAdmin, useUsersAsAdminConfig } from "hooks/useUsersAsAdmin"
import { UserList, AddUserModal, EditUserModal } from "components/Permissions"

const Users: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ fallback }) => (
    <SWRConfig value={{ fallback }}>
        <UserPage />
    </SWRConfig>
)

const UserPage: React.FC = () => {
    const { users, createUser, deleteUser, changeRole } = useUsersAsAdmin()
    const router = useRouter()

    const [addUserAnchorEl, setAddUserAnchorEl] = useState<Element | null>(null)
    const [editUserAnchorEl, setEditUserAnchorEl] = useState<Element | null>(
        null
    )
    const [userBeingEdited, setUserBeingEdited] = useState<User | null>(null)

    if (!users) {
        router.push("/")
        return null
    }

    const handleOpenAddUserModal = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setAddUserAnchorEl(event.currentTarget)
    }

    const handleOpenEditUserModal = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        user: User
    ) => {
        setEditUserAnchorEl(event.currentTarget)
        setUserBeingEdited(user)
    }

    return (
        <>
            <UserList
                users={users}
                onDeleteUser={deleteUser}
                onOpenEditor={handleOpenEditUserModal}
                sx={{
                    maxWidth: 0.8,
                    maxHeight: 0.8,
                }}
            />
            <IconButton onClick={handleOpenAddUserModal}>
                <AddIcon />
            </IconButton>
            <AddUserModal
                open={addUserAnchorEl !== null}
                onClose={() => setAddUserAnchorEl(null)}
                onHandleCreateUser={createUser}
            />
            {editUserAnchorEl && userBeingEdited && (
                <EditUserModal
                    open={editUserAnchorEl != null}
                    onClose={() => setEditUserAnchorEl(null)}
                    user={userBeingEdited}
                    onHandleChangeRole={changeRole}
                />
            )}
        </>
    )
}

type PageProps = { fallback: Record<string, User[]> }

export const getServerSideProps = withSSRCatch(
    withSessionSsr<PageProps>(async context => {
        const user = context.req.session.user

        if (user == null || user.isLoggedIn === false)
            return {
                notFound: true,
            }
        const users = await fetcher<User[]>({
            url: `/api/permissions/users`,
            method: "GET",
            headers: context.req.headers as HeadersInit,
        })
        return {
            props: {
                fallback: { [useUsersAsAdminConfig.cacheKey]: users },
            },
        }
    })
)
export default Users
