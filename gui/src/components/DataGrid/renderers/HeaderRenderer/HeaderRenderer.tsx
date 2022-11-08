import { asView } from "@intutable/lazy-views/dist/selectable"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import KeyIcon from "@mui/icons-material/Key"
import LinkIcon from "@mui/icons-material/Link"
import LookupIcon from "@mui/icons-material/ManageSearch"
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material"
import { useAPI } from "context"
import { useColumn } from "hooks/useColumn"
import { useTable } from "hooks/useTable"
import { useTables } from "hooks/useTables"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import { HeaderRendererProps } from "react-data-grid"
import { Row } from "types"
import { ContextMenu } from "./ContextMenu"
import { PrefixIcon } from "./PrefixIcon"
import { SearchBar } from "./SearchBar"

export const HeaderRenderer: React.FC<HeaderRendererProps<Row>> = props => {
    const router = useRouter()

    const { data } = useTable()
    const { getTableColumn } = useColumn()
    const { project } = useAPI()
    const { tables } = useTables()

    const col = useMemo(
        () => (data ? getTableColumn(props.column) : null),
        [data, getTableColumn, props.column]
    )
    // column that represents a link to another table
    const isLinkCol = props.column._kind! === "link"
    const isLookupCol = props.column._kind! === "lookup"

    // const t = props.column.editorOptions?.renderFormatter
    // a user-facing primary column distinct from the table's real PK
    const isUserPrimary = col ? col.attributes.userPrimary === 1 : null

    const foreignTable = useMemo(() => {
        if (col == null) return null
        if (!data || !tables) return undefined
        const join = data.metadata.joins.find(j => j.id === col.joinId)
        if (!join) return undefined
        return tables.find(t => t.id === asView(join.foreignSource).id)
    }, [col, tables, data])

    const navigateToView = () =>
        router.push(`/project/${project!.id}/table/${foreignTable?.id}`)

    if (col == null) return null

    return (
        <Stack
            direction="column"
            sx={{
                width: "100%",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "35px",
                    display: "inline-flex",
                    justifyContent: "flex-start",
                    alignContent: "center",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                }}
            >
                {/* Prefix Icon Link Column */}
                <PrefixIcon
                    open={isLinkCol}
                    title={`(Verlinkte Spalte) Ursprung: Primärspalte aus Tabelle '${
                        foreignTable ? foreignTable.name : "Lädt..."
                    }'.`}
                    iconButtonProps={{
                        onClick: navigateToView,
                        disabled: foreignTable == null,
                    }}
                >
                    <LinkIcon
                        sx={{
                            fontSize: "90%",
                        }}
                    />
                </PrefixIcon>

                {/* Prefix Icon Primary Column */}
                <PrefixIcon
                    open={isUserPrimary === true}
                    title="(Primärspalte). Inhalt sollte einzigartig sein, z.B. ein Name oder eine ID-Nummer."
                >
                    <KeyIcon
                        sx={{
                            fontSize: "80%",
                        }}
                    />
                </PrefixIcon>

                {/* Prefix Icon Lookup Column */}
                <PrefixIcon open={isLookupCol} title="Lookup">
                    <LookupIcon
                        sx={{
                            fontSize: "90%",
                        }}
                    />
                </PrefixIcon>

                <Box
                    sx={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    <Tooltip title={props.column.name}>
                        <Typography
                            sx={{
                                fontWeight: "bold",
                            }}
                        >
                            {props.column.name}
                        </Typography>
                    </Tooltip>
                </Box>

                <Box>
                    <Tooltip title="Filter">
                        <IconButton size="small" edge="end" disabled>
                            <FilterAltIcon
                                sx={{
                                    fontSize: "80%",
                                }}
                            />
                        </IconButton>
                    </Tooltip>

                    <ContextMenu
                        colInfo={col}
                        foreignTable={foreignTable}
                        headerRendererProps={props}
                    />
                </Box>
            </Box>

            <SearchBar />
        </Stack>
    )
}

export const headerRenderer = (props: HeaderRendererProps<Row>) => (
    <HeaderRenderer {...props} />
)
