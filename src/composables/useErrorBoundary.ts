import { ref, onErrorCaptured } from 'vue'

interface ErrorInfo {
    message: string
    stack?: string
    component?: string
    timestamp: string
}

export function useErrorBoundary() {
    const error = ref<ErrorInfo | null>(null)
    const errorCount = ref(0)

    const onError = (err: Error, component?: string) => {
        errorCount.value++
        error.value = {
            message: err.message,
            stack: err.stack,
            component,
            timestamp: new Date().toISOString(),
        }

        // Log to console in development
        if (import.meta.env.DEV) {
            console.error('[ErrorBoundary]', error.value)
        }

        return false
    }

    const clearError = () => {
        error.value = null
    }

    const resetErrorCount = () => {
        errorCount.value = 0
    }

    return {
        error,
        errorCount,
        onError,
        clearError,
        resetErrorCount,
    }
}
