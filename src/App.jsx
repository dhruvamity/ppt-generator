import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
    TaskChooseOrganization,
    TaskResetPassword,
    TaskSetupMFA,
    useAuth,
    useSession,
} from '@clerk/clerk-react';
import TopNavBar from './components/TopNavBar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import Templates from './pages/Templates';
import ThumbnailStudio from './pages/ThumbnailStudio';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

function NotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[calc(100vh-4rem)] pt-16">
            <h1 className="text-6xl font-display-lg text-primary mb-4 font-bold">404</h1>
            <h2 className="text-2xl font-headline-md text-on-surface mb-4">Page Not Found</h2>
            <p className="text-on-surface-variant mb-8 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="bg-primary text-on-primary font-label-md px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                Return Home
            </Link>
        </div>
    );
}

function AuthLoading() {
    return (
        <main
            role="status"
            aria-live="polite"
            className="flex flex-1 items-center justify-center px-6 pt-16 text-on-surface-variant"
        >
            Restoring your session…
        </main>
    );
}

function ProtectedRoute({ children }) {
    const { isLoaded, isSignedIn } = useAuth();
    const { isLoaded: isSessionLoaded, session } = useSession();

    if (!isLoaded || !isSessionLoaded) return <AuthLoading />;
    if (session?.status === 'pending') return <Navigate to="/session-tasks" replace />;
    if (!isSignedIn) return <Navigate to="/" replace />;

    return children;
}

function HomeRoute() {
    const { isLoaded, isSignedIn } = useAuth();
    const { isLoaded: isSessionLoaded, session } = useSession();

    if (!isLoaded || !isSessionLoaded) return <AuthLoading />;
    if (session?.status === 'pending') return <Navigate to="/session-tasks" replace />;
    return isSignedIn ? <Navigate to="/dashboard" replace /> : <Landing />;
}

function SessionTasksRoute() {
    const { isLoaded, session } = useSession();

    if (!isLoaded) return <AuthLoading />;
    if (session?.status !== 'pending') {
        return <Navigate to={session ? '/dashboard' : '/'} replace />;
    }

    const taskProps = { redirectUrlComplete: '/dashboard' };
    const currentTask = session.currentTask?.key;

    return (
        <main className="flex flex-1 items-center justify-center px-6 pt-20 pb-12">
            {currentTask === 'choose-organization' && <TaskChooseOrganization {...taskProps} />}
            {currentTask === 'reset-password' && <TaskResetPassword {...taskProps} />}
            {currentTask === 'setup-mfa' && <TaskSetupMFA {...taskProps} />}
            {!currentTask && <AuthLoading />}
        </main>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <Router>
                <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
                    <TopNavBar />
                    
                    <Routes>
                        <Route path="/" element={<HomeRoute />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/generator" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
                        <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
                        <Route path="/thumbnails" element={<ProtectedRoute><ThumbnailStudio /></ProtectedRoute>} />
                        <Route path="/session-tasks" element={<SessionTasksRoute />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>

                    <footer className="mt-auto w-full px-6 py-3 text-right text-xs text-on-surface-variant/70">
                        Made With Love From Dhruv sir
                    </footer>

                    <Toaster position="bottom-right" />
                </div>
            </Router>
        </ErrorBoundary>
    );
}
