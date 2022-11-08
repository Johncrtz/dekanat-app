import React, { ErrorInfo } from "react"

type ErrorBoundaryProps = {
    /**
     * A fallback component that gets rendered when an error occurs.
     */
    fallback: React.ReactNode
    children: React.ReactNode
}

type ErrorBoundaryState = {
    hasError: boolean
    error: Error | null
}

// Note: Error boundaries currently have to be classes.
export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    /**
     * used to render a fallback UI after an error has been thrown.
     */
    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error,
        }
    }

    /**
     * used log error information
     */
    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[Error Boundary]:", error, errorInfo)
    }

    public render() {
        if (this.state.hasError) return this.props.fallback

        return this.props.children
    }
}

export default ErrorBoundary
