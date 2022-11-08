import React from "react"
import {
    SxProps,
    Theme,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { User } from "@backend/permissions"
import { useRoles } from "hooks/useRoles"

const USER_TABLE_COLUMNS = [
    { id: "email", label: "E-Mail", minWidth: "20em" },
    { id: "role", label: "Rolle", minWidth: "12em" },
    { id: "edit", label: "", minWidth: null },
    { id: "delete", label: "", minWidth: null },
]

export type UserListProps = {
    users: User[]
    onDeleteUser: (id: number) => Promise<void>
    onOpenEditor: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        user: User
    ) => Promise<void>
    sx?: SxProps<Theme>
}

const UserList: React.FC<UserListProps> = props => {
    const { users, onDeleteUser, onOpenEditor, sx } = props
    return (
        <TableContainer sx={sx}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {USER_TABLE_COLUMNS.map(c => (
                            <TableCell
                                key={c.id}
                                style={
                                    c.minWidth ? { minWidth: c.minWidth } : {}
                                }
                            >
                                {c.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(u => (
                        <UserListItem
                            key={u.id}
                            user={u}
                            onDelete={() => onDeleteUser(u.id)}
                            onOpenEditor={e => onOpenEditor(e, u)}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

type UserListItemProps = {
    user: User
    onDelete: () => Promise<void>
    onOpenEditor: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => Promise<void>
}

const UserListItem: React.FC<UserListItemProps> = props => {
    const { user, onDelete, onOpenEditor } = props
    const { roles } = useRoles()

    if (!user || !roles) return null

    return (
        <TableRow>
            <TableCell key="email">{user.email}</TableCell>
            <TableCell key="role">{user.role.name}</TableCell>
            <TableCell key="edit">
                <IconButton onClick={onOpenEditor}>
                    <EditIcon />
                </IconButton>
            </TableCell>
            <TableCell key="delete">
                <IconButton onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}

export default UserList
