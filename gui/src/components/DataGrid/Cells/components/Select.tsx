import AddIcon from "@mui/icons-material/Add"
import CheckIcon from "@mui/icons-material/Check"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import {
    Box,
    Chip,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    MenuList,
    TextField,
} from "@mui/material"
import { useTheme } from "@mui/system"
import { useView } from "hooks/useView"
import { useMemo, useRef, useState } from "react"
import { FormatterProps } from "react-data-grid"
import { Row } from "types"
import { stringToColor } from "utils/stringToColor"
import Cell from "../abstract/Cell"

const ChipItem: React.FC<{
    label: string
    onDelete?: () => void
}> = ({ label, onDelete }) => {
    const color = stringToColor(label)
    const theme = useTheme()
    return (
        <Chip
            label={label}
            size="small"
            onDelete={onDelete}
            sx={{
                color: theme.palette.getContrastText(color),
                bgcolor: color,
                cursor: "pointer",
            }}
        />
    )
}

export class Select extends Cell {
    readonly brand = "select"
    label = "Auswahlliste"

    editor = () => null

    formatter = (props: FormatterProps<Row>) => {
        const {
            content,
            column: _column,
            row,
            key,
        } = this.destruct<string | null | undefined>(props)
        const isEmpty = content == null || content === ""

        const [hovering, setHovering] = useState<boolean>(false)
        const modalRef = useRef(null)
        const [open, setOpen] = useState<boolean>(false)
        const openModal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen(true)
        }
        const closeModal = () => setOpen(false)

        const [input, setInput] = useState<string>("")
        const changeOption = (value: string) => {
            props.onRowChange({
                ...row,
                [key]: value,
            })
            closeModal()
        }

        const { data } = useView()
        const list: string[] | null = useMemo(() => {
            if (data == null) return null

            const values = data.rows
                .map(row => row[_column.key] as string)
                .filter(value => typeof value === "string" && value.length > 0)
                .filter(item => item !== content)

            return [...new Set(values)]
        }, [_column.key, content, data])

        return (
            <>
                <Box
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "inline-flex",
                        justifyContent: "flex-start",
                        alignContent: "center",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                    }}
                    ref={modalRef}
                >
                    {isEmpty ? (
                        <>
                            {hovering && (
                                <IconButton size="small" onClick={openModal}>
                                    <AddIcon fontSize="small" />
                                </IconButton>
                            )}
                        </>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    flex: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                <ChipItem
                                    label={content}
                                    onDelete={
                                        hovering
                                            ? () => changeOption("")
                                            : undefined
                                    }
                                />
                            </Box>
                            {hovering && (
                                <IconButton size="small" onClick={openModal}>
                                    <KeyboardArrowDownIcon fontSize="small" />
                                </IconButton>
                            )}
                        </>
                    )}
                </Box>
                <Menu
                    elevation={0}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    open={open}
                    anchorEl={modalRef.current}
                    onClose={closeModal}
                    PaperProps={{
                        sx: {
                            boxShadow: "10px 10px 20px 0px rgba(0,0,0,0.2)",
                        },
                    }}
                >
                    <MenuItem>
                        <TextField
                            label="Option hinzufügen"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") changeOption(input)
                            }}
                        />
                        <IconButton
                            size="small"
                            sx={{ ml: 1 }}
                            onClick={() => changeOption(input)}
                        >
                            <CheckIcon fontSize="small" color="primary" />
                        </IconButton>
                    </MenuItem>
                    <Divider />
                    <MenuList
                        sx={{
                            maxHeight: "200px",
                            overflowY: "scroll",
                        }}
                    >
                        {list?.map(item => (
                            <MenuItem
                                key={item}
                                data-value={item}
                                onClick={e =>
                                    changeOption(
                                        e.currentTarget.dataset[
                                            "value"
                                        ] as string
                                    )
                                }
                            >
                                <ChipItem label={item} />
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </>
        )
    }
}
