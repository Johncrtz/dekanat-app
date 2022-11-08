import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material"
import { useRouter } from "next/router"
import { localeDateString, MONTHS } from "utils/date"
import { ReleaseProps } from "./Release"
import { releases } from "public/releases"
const byDate = (a: ReleaseProps, b: ReleaseProps) =>
    b.date.getTime() - a.date.getTime()

export const ReleaseList: React.FC = props => {
    return (
        <List
            sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
            }}
        >
            {releases.sort(byDate).map((release, index, array) => (
                <ReleaseListItem
                    key={release.date.getTime()}
                    release={release}
                    index={array.length - index}
                />
            ))}
        </List>
    )
}

const ReleaseListItem: React.FC<{ release: ReleaseProps; index: number }> = ({
    release: props,
    index,
}) => {
    const router = useRouter()

    return (
        <ListItem
            onClick={() => router.push("/release/" + props.version)}
            sx={{
                cursor: "pointer",
                "&:hover": {
                    bgcolor: "#eee",
                },
            }}
        >
            <ListItemAvatar>
                <Avatar>{index}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={props.title}
                secondary={localeDateString(props.date)}
            />
        </ListItem>
    )
}
