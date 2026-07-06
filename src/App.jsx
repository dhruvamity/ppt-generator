import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import Templates from './pages/Templates';
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

export default function App() {
    return (
        <ErrorBoundary>
            <Router>
                <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
                    <TopNavBar />
                    
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/generator" element={<Generator />} />
                        <Route path="/templates" element={<Templates />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    
                    <Toaster position="bottom-right" />
                </div>
            </Router>
        </ErrorBoundary>
    );
}
