import { useState, useEffect } from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    Button,
    DialogActions,
    TextField,
    Select,
    SelectChangeEvent,
    MenuItem,
    InputLabel,
} from "@mui/material"
import { User } from "@backend/permissions"
import { useRoles } from "hooks/useRoles"

type EditUserModalProps = {
    open: boolean
    onClose: () => void
    user: User
    onHandleChangeRole: (userId: number, roleId: number) => Promise<void>
}

const EditUserModal: React.FC<EditUserModalProps> = props => {
    const { open, onClose, user, onHandleChangeRole } = props
    const { roles } = useRoles()

    const [role, setRole] = useState<number | null>(user.role.id)
    const [valid, setValid] = useState<boolean>(false)

    useEffect(() => {
        if (role !== null) setValid(true)
        else setValid(false)
    }, [role])

    if (!roles || roles.length === 0) return null

    const handleChangeRole = (e: SelectChangeEvent<string | number>) => {
        if (typeof e.target.value === "string") return
        else setRole(e.target.value)
    }

    const handleSaveUser = async () => {
        if (role !== null && role !== user.role.id)
            await onHandleChangeRole(user.id, role)
        props.onClose()
    }

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <DialogTitle>Benutzer anpassen</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    {/* Name */}
                    <TextField
                        disabled
                        label="E-Mail"
                        value={user.email}
                        variant="outlined"
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="edituser-select-role">Rolle</InputLabel>
                    <Select
                        labelId="edituser-select-role"
                        label="Rolle"
                        value={role ?? ""}
                        onChange={handleChangeRole}
                    >
                        {roles.map(r => (
                            <MenuItem key={r.id} value={r.id}>
                                {r.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Abbrechen</Button>
                <Button onClick={handleSaveUser} disabled={valid == false}>
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditUserModal
