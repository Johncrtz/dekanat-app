import { Divider, Typography, Box } from "@mui/material"
import Maintenance from "components/Maintenance"
import MetaTitle from "components/MetaTitle"
import type { NextPage } from "next"

const Dashboard: NextPage = () => {
    return (
        <>
            <MetaTitle title="Dashboard" />
            <Typography variant={"h4"}>Dashboard</Typography>
            <Divider />

            <Box sx={{ mt: 10 }}>
                <Maintenance />
            </Box>
        </>
    )
}

export default Dashboard
