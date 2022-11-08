import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"

export const LoadingSkeleton = () => (
    <Stack spacing={1}>
        <Skeleton variant="text" />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={118} />
    </Stack>
)

export default LoadingSkeleton
