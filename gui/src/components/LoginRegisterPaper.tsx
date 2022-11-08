import React from "react"
import {
    Paper as MUIPaper,
    Box,
    Stack,
    Typography,
    Button,
    CircularProgress,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Image from "next/image"
import BGImage from "public/login-bg.jpg"
import Link, { CombinedLinkProps } from "components/Link"

type PaperProps = {
    mode: "login" | "register"
    handleAction: () => void
    disabled: boolean
    loading: boolean
    children?: React.ReactNode
}

export const LoginRegisterPaper: React.FC<PaperProps> = props => {
    const theme = useTheme()
    const linkStyle: CombinedLinkProps["muiLinkProps"] = {
        sx: {
            textDecoration: "none",
            color: theme.palette.primary.main,
        },
    }
    return (
        <MUIPaper
            sx={{
                // ratio: 1,4
                height: "700px",
                width: "980px",
                overflow: "hidden",
                boxShadow: 10,
            }}
        >
            <Stack
                direction="row"
                sx={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        height: "100%",
                        width: "50%",
                        position: "relative",
                    }}
                >
                    <style jsx global>{`
                        .login-page-bg-img {
                            filter: brightness(80%);
                        }
                    `}</style>
                    <Image
                        src={BGImage}
                        alt="Hintergrund Bild"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="20% 50%"
                        placeholder="blur"
                        className="login-page-bg-img"
                    />
                    <Typography
                        variant="h2"
                        sx={{
                            position: "absolute",
                            top: "30%",
                            left: "10%",
                            transform: "translateY(-50%)",
                            color: "white",
                            fontWeight: 900,
                        }}
                    >
                        Fakultät für{"\n"}Mathematik{"\n"}Informatik.
                    </Typography>
                </Box>
                <Box
                    sx={{
                        height: "100%",
                        width: "50%",
                        px: 10,
                        py: 6,
                    }}
                >
                    <Stack
                        direction="column"
                        sx={{
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                height: "85%",
                                width: "100%",
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: theme.typography.fontWeightBold,
                                }}
                            >
                                {props.mode === "login"
                                    ? "Login"
                                    : "Registrieren"}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: theme.typography.caption,
                                    mt: 1,
                                }}
                            >
                                {props.mode === "register" ? (
                                    <>
                                        Du hast bereits ein Benutzerkonto?{" "}
                                        <Link
                                            muiLinkProps={linkStyle}
                                            href="/login"
                                        >
                                            Melde dich an
                                        </Link>
                                        !
                                    </>
                                ) : (
                                    <>
                                        Du hast noch kein Benutzerkonto?{" "}
                                        <Link
                                            muiLinkProps={linkStyle}
                                            href="/register"
                                        >
                                            Erstelle dein Benutzerkonto
                                        </Link>{" "}
                                        in wenigen Schritten!
                                    </>
                                )}
                            </Typography>

                            <Box
                                sx={{
                                    mt: 5,
                                    mb: 2,
                                }}
                            >
                                {props.loading ? (
                                    <CircularProgress />
                                ) : (
                                    props.children
                                )}
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "right",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    disabled={props.disabled}
                                    onClick={props.handleAction}
                                >
                                    {props.mode === "login"
                                        ? "Login"
                                        : "Registrieren"}
                                </Button>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                height: "15%",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignContent: "flex-end",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: theme.typography.caption,
                                    mb: 2,
                                }}
                            >
                                {props.mode === "login"
                                    ? "Login"
                                    : "Registrieren"}{" "}
                                mit Universitäts-Account
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => {}}
                                disabled
                            >
                                Uni-Zugang
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Stack>
        </MUIPaper>
    )
}
