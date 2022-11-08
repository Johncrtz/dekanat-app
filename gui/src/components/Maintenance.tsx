import ConstructionIcon from "@mui/icons-material/Construction"
import { useTheme, Container, Paper, Stack, Typography } from "@mui/material"

export const Maintenance = () => {
    const theme = useTheme()
    return (
        <Container
            component={Paper}
            sx={{
                maxWidth: "300px",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                bgcolor: theme.palette.primary.light,
            }}
        >
            <Stack
                direction="column"
                sx={{
                    alignItems: "center",
                    py: 10,
                    boxSizing: "border-box",
                }}
            >
                <Typography
                    sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        mb: 5,
                        letterSpacing: "1px",
                        fontSize: "2rem",
                        color: "#fff",
                    }}
                >
                    Comming Soon
                </Typography>
                <ConstructionIcon
                    sx={{
                        mb: 4,
                        fontSize: "100px",
                        color: "#fff",
                    }}
                />
                <Typography
                    sx={{
                        color: "#fff",
                    }}
                >
                    This feature is currently under construction and will be
                    released in a future version.
                </Typography>
            </Stack>
        </Container>
    )
}
export default Maintenance
