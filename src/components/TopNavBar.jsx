import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Search } from 'lucide-react';

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
                
                {/* Navigation Links */}
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
                    <button className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant hover:border-primary transition-colors ml-2">
                        <img 
                            alt="Educator Profile Settings" 
                            className="w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQaikCn_LmHISBsAIBCAy7hy6Tt7eDWtvSjQbsvGnF8Fcsutw6lcsjUsk2sGY1KRg7KXJZ_vb7axHfNp9LJn9Phy2aQDKJ1Ftx-vkiyzrG1evBXz-udP5g8Sr2KFP14TlPb60lak5EE2XCENVzgTCyG8z0B6mJSYebdro3kXNnTXRna_BMYj43PMvgWrj27nYTBJCE2XtVHWluBlk2bmlj233rblGsy-EVvy-uxk24FivD8YGc1I-_sQ"
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
}
