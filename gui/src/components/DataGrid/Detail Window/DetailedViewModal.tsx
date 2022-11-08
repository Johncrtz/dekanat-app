import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
} from "@mui/material"
import type { TransitionProps } from "@mui/material/transitions"
import React from "react"
import { CalculatedColumn } from "react-data-grid"
import { Row } from "../../../types"

/* eslint-disable */
const PopupTransition = React.forwardRef(
    (
        props: TransitionProps & {
            children: React.ReactElement<any, any>
        },
        ref: React.Ref<unknown>
    ) => <Slide direction="up" ref={ref} {...props} />
)
/* eslint-enable */

type DetailedViewModalProps = {
    open: boolean
    data: {
        row: Row
        column: CalculatedColumn<Row>
    }
    onCloseHandler: () => void
}

export const DetailedViewModal: React.FC<DetailedViewModalProps> = props => {
    return (
        <Dialog
            open={props.open}
            TransitionComponent={PopupTransition}
            aria-describedby="row-detailed-view"
            fullWidth={true}
            maxWidth="xs"
            onClose={props.onCloseHandler}
        >
            <DialogTitle sx={{ textTransform: "uppercase" }}>
                <>Detail-Ansicht für Zeile {props.data.row.__id__}</>
            </DialogTitle>

            <DialogContent>
                <ul>
                    {Object.entries(props.data.row).map(([key, value], i) => (
                        <li key={i}>
                            <>
                                {key}: {value}
                            </>
                        </li>
                    ))}
                </ul>
            </DialogContent>

            <DialogActions sx={{ flexWrap: "wrap" }}>
                <Button onClick={props.onCloseHandler}>Schließen</Button>
                <Button>Speichern</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DetailedViewModal
