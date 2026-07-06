import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-background text-on-background p-8">
                    <AlertTriangle size={64} className="text-error mb-6" />
                    <h1 className="text-4xl font-headline-lg font-bold mb-4">Something went wrong.</h1>
                    <p className="text-on-surface-variant font-body-md mb-8 max-w-lg text-center">
                        An unexpected error occurred in the component tree. This is usually caused by an undefined state variable or a broken render function.
                    </p>
                    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 w-full max-w-2xl overflow-auto text-sm font-mono text-error">
                        {this.state.error?.toString()}
                    </div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-8 bg-primary text-on-primary font-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
