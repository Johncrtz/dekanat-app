import { Divider, Typography } from "@mui/material"
import { useUser } from "auth"
import MetaTitle from "components/MetaTitle"
import Link from "components/Link"
import type { NextPage } from "next"
import { ReleaseNotification } from "components/Release Notes/ReleaseNotification"

const Home: NextPage = () => {
    const { user } = useUser()

    return (
        <>
            <MetaTitle title="Startseite" />
            <Typography variant={"h4"}>Startseite</Typography>
            <Divider />
            <Typography sx={{ mt: 2 }}>
                {user?.isLoggedIn ? (
                    <>Hallo {user.username}!</>
                ) : (
                    <>
                        Melde dich an: <Link href="/login">anmelden</Link>
                    </>
                )}
            </Typography>

            {/* <ReleaseNotification /> */}
        </>
    )
}

export default Home
