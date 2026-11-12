import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Search, Menu, X } from 'lucide-react';
import { useAuth, useSession, UserButton, SignInButton } from '@clerk/clerk-react';

const LINKS = [['/dashboard', 'Dashboard'], ['/generator', 'Generator'], ['/templates', 'Templates'], ['/thumbnails', 'Thumbnails']];

export default function TopNavBar() {
    const location = useLocation();
    const { isLoaded, isSignedIn } = useAuth();
    const { isLoaded: isSessionLoaded, session } = useSession();
    const authLoaded = isLoaded && isSessionLoaded;
    const isPending = session?.status === 'pending';
    const [open, setOpen] = useState(false);
    useEffect(() => { setOpen(false); }, [location.pathname]);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface border-b border-outline-variant">
            <div className="flex items-center gap-gutter w-full max-w-container-max mx-auto">
                {/* Brand Logo */}
                <Link to="/" className="font-headline-md text-[24px] font-bold text-primary flex items-center gap-2">
                    <Sparkles size={24} />
                    Deckful
                </Link>
                
                {/* Navigation Links - Only show when Signed In */}
                {authLoaded && isSignedIn && (
                    <>
                        <div className="hidden md:flex items-center gap-stack-lg ml-8 font-body-md h-full">
                            {LINKS.map(([to, name]) => <Link key={to} to={to} className={`h-full flex items-center mt-1 font-bold pb-1 border-b-2 ${location.pathname === to ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary transition-colors'}`}>{name}</Link>)}
                        </div>

                        <div className="flex items-center gap-stack-md ml-auto">
                            {/* Search Bar */}
                            <div className="hidden lg:flex items-center bg-surface-container-low border border-outline-variant rounded-full px-4 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                <Search size={16} className="text-outline mr-2" />
                                <input
                                    className="bg-transparent border-none outline-none font-body-md text-sm text-on-surface placeholder:text-outline w-48"
                                    placeholder="Search slides..."
                                    type="text"
                                />
                            </div>

                            <Link to="/generator" className="hidden sm:inline-flex font-label-md text-[14px] bg-primary text-on-primary hover:opacity-90 px-4 py-2 rounded-lg transition-opacity">
                                Create Slide
                            </Link>

                            {/* Profile */}
                            <div className="ml-2 flex items-center">
                                <UserButton afterSignOutUrl="/" />
                            </div>

                            <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} className="md:hidden p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary">
                                {open ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>

                        {open && <div id="mobile-nav" className="md:hidden absolute left-0 right-0 top-16 bg-surface border-b border-outline-variant shadow-md flex flex-col p-2">
                            {LINKS.map(([to, name]) => <Link key={to} to={to} className={`px-4 py-3 rounded-lg font-bold ${location.pathname === to ? 'text-primary bg-surface-container-low' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>{name}</Link>)}
                            <Link to="/generator" className="m-2 text-center font-label-md text-[14px] bg-primary text-on-primary px-4 py-2 rounded-lg">Create Slide</Link>
                        </div>}
                    </>
                )}

                {authLoaded && !isSignedIn && !isPending && (
                    <div className="ml-auto flex items-center">
                        <SignInButton mode="modal">
                            <button className="font-label-md text-[14px] bg-primary text-on-primary hover:opacity-90 px-4 py-2 rounded-lg transition-opacity border-0 cursor-pointer">
                                Sign In
                            </button>
                        </SignInButton>
                    </div>
                )}
            </div>
        </nav>
    );
}
