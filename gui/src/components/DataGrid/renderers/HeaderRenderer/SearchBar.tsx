import SearchIcon from "@mui/icons-material/Search"
import { Box, InputAdornment, TextField } from "@mui/material"
import { useHeaderSearchField } from "context"
import React from "react"

export const SearchBar: React.FC = () => {
    const { open: headerOpen } = useHeaderSearchField()

    if (headerOpen === false) return null

    return (
        <Box
            sx={{
                width: "100%",
                height: "35px",
                display: "inline-flex",
                justifyContent: "center",
                alignContent: "flex-start",
                alignItems: "flex-start",
                overflow: "hidden",
            }}
        >
            <TextField
                sx={{
                    maxHeight: "20px",
                    width: "100%",
                }}
                size="small"
                disabled
                variant="outlined"
                value="Suche"
                margin="none"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
                inputProps={{
                    style: {
                        height: "30px",
                        padding: "0 14px",
                    },
                }}
            />
        </Box>
    )
}
