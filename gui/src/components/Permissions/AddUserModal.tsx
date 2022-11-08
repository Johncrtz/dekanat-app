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
import { isValidEMailAddress } from "utils/isValidEMailAddress"
import { User } from "@backend/permissions"
import { useRoles } from "hooks/useRoles"

type AddUserModalProps = {
    open: boolean
    onClose: () => void
    onHandleCreateUser: (
        user: Omit<User, "id">,
        password: string
    ) => Promise<void>
}

const AddUserModal: React.FC<AddUserModalProps> = props => {
    const { roles } = useRoles()
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [role, setRole] = useState<number | null>(roles ? roles[0].id : null)
    const [valid, setValid] = useState<boolean>(false)

    useEffect(() => {
        if (isValidEMailAddress(email) && password.length >= 8 && role != null)
            setValid(true)
        else setValid(false)
    }, [email, password, role])

    if (!roles || roles.length === 0) return null

    const handleChangeRole = (e: SelectChangeEvent<string | number>) => {
        if (typeof e.target.value === "string") return
        else setRole(e.target.value)
    }

    const handleSaveUser = async () => {
        await props.onHandleCreateUser(
            {
                email,
                role: roles[role!],
            },
            password
        )
        props.onClose()
    }
    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
            <DialogTitle>Neuen Benutzer erstellen</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    {/* Name */}
                    <TextField
                        label="E-Mail"
                        value={email}
                        variant="outlined"
                        onChange={e => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <TextField
                        label="Passwort"
                        type="password"
                        value={password}
                        variant="outlined"
                        onChange={e => setPassword(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="adduser-select-role">Rolle</InputLabel>
                    <Select
                        labelId="adduser-select-role"
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
                <Button onClick={() => props.onClose()}>Abbrechen</Button>
                <Button onClick={handleSaveUser} disabled={valid == false}>
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddUserModal
