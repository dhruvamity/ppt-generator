import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Search } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';

export default function TopNavBar() {
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 bg-surface border-b border-outline-variant">
            <div className="flex items-center gap-gutter w-full max-w-container-max mx-auto">
                {/* Brand Logo */}
                <Link to="/" className="font-headline-md text-[24px] font-bold text-primary flex items-center gap-2">
                    <Sparkles size={24} />
                    SlideGen Pro
                </Link>
                
                {/* Navigation Links - Only show when Signed In */}
                <SignedIn>
                    <div className="hidden md:flex items-center gap-stack-lg ml-8 font-body-md h-full">
                        <Link 
                            to="/dashboard" 
                            className={`h-full flex items-center mt-1 font-bold pb-1 border-b-2 ${location.pathname === '/dashboard' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary transition-colors'}`}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/generator" 
                            className={`h-full flex items-center mt-1 font-bold pb-1 border-b-2 ${location.pathname === '/generator' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary transition-colors'}`}
                        >
                            Generator
                        </Link>
                        <Link to="/templates" className={`h-full flex items-center mt-1 font-bold pb-1 border-b-2 ${location.pathname === '/templates' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary transition-colors'}`}>
                            Templates
                        </Link>
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
                        
                        <Link to="/generator" className="font-label-md text-[14px] bg-primary text-on-primary hover:opacity-90 px-4 py-2 rounded-lg transition-opacity">
                            Create Slide
                        </Link>
                        
                        {/* Profile */}
                        <div className="ml-2 flex items-center">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </SignedIn>

                <SignedOut>
                    <div className="ml-auto flex items-center">
                        <SignInButton mode="modal">
                            <button className="font-label-md text-[14px] bg-primary text-on-primary hover:opacity-90 px-4 py-2 rounded-lg transition-opacity border-0 cursor-pointer">
                                Sign In
                            </button>
                        </SignInButton>
                    </div>
                </SignedOut>
            </div>
        </nav>
    );
}
