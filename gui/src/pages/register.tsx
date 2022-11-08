import MetaTitle from "components/MetaTitle"
import { LoginRegisterPaper } from "components/LoginRegisterPaper"
import { Box } from "@mui/material"
import type { NextPage } from "next"
import React from "react"

const Register: NextPage = () => {
    const handleRegister = () => {
        alert("not implemented")
    }

    return (
        <>
            <MetaTitle title="Registrieren" />
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <LoginRegisterPaper
                    mode="register"
                    handleAction={handleRegister}
                    disabled
                    loading={false}
                ></LoginRegisterPaper>
            </Box>
        </>
    )
}

export default Register
