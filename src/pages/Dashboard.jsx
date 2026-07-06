import React, { useState } from 'react';
import { Plus, Grid, Star, Clock, Folder, PlusCircle, Frown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ThemeBuilderModal from '../components/Dashboard/ThemeBuilderModal';

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { recentDecks, savedThemes, clearGeneratorState, loadDeck } = useStore();

    const handleNewPresentation = () => {
        clearGeneratorState();
        navigate('/generator');
    };

    const handleLoadDeck = (deck) => {
        loadDeck(deck);
        navigate('/generator');
    };

    return (
        <main className="flex-1 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop pt-24 pb-12 flex flex-col md:flex-row gap-gutter">
            {/* Sidebar */}
            <aside className="w-64 hidden md:flex flex-col gap-stack-lg shrink-0 border-r border-outline-variant pr-gutter h-[calc(100vh-8rem)] sticky top-24">
                <div className="flex flex-col gap-stack-sm">
                    <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">My Workspace</h3>
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-surface-container-low text-primary rounded-lg font-label-md text-label-md transition-colors">
                        <Grid size={18} className="fill-primary" />
                        All Decks
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg font-label-md text-label-md transition-colors">
                        <Star size={18} />
                        Starred
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg font-label-md text-label-md transition-colors">
                        <Clock size={18} />
                        Recent
                    </Link>
                </div>
                <div className="flex flex-col gap-stack-sm mt-4">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Folders</h3>
                        <button 
                            onClick={() => {
                                const name = window.prompt("Enter new folder name:");
                                if (name && name.trim()) {
                                    useStore.getState().addFolder(name.trim());
                                }
                            }}
                            className="text-outline hover:text-primary transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    {useStore(state => state.folders).map((folder, idx) => (
                        <Link key={idx} to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg font-label-md text-label-md transition-colors">
                            <Folder size={18} className={idx % 2 === 0 ? "text-secondary fill-secondary" : "text-tertiary fill-tertiary"} />
                            {folder}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col gap-stack-sm mt-auto pb-4">
                    <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">Quick Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded font-label-sm text-label-sm cursor-pointer hover:bg-surface-dim transition-colors">#Quiz</span>
                        <span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded font-label-sm text-label-sm cursor-pointer hover:bg-surface-dim transition-colors">#Lecture</span>
                        <span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded font-label-sm text-label-sm cursor-pointer hover:bg-surface-dim transition-colors">#Midterm</span>
                    </div>
                </div>
            </aside>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-stack-lg min-w-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="font-headline-lg text-[32px] font-semibold text-on-surface mb-1">Welcome back, Professor Smith.</h1>
                        <p className="font-body-md text-on-surface-variant">You have {recentDecks.length} presentations available.</p>
                    </div>
                    <button onClick={handleNewPresentation} className="flex items-center gap-2 bg-primary text-on-primary font-label-md px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm shadow-primary/20">
                        <Plus size={18} />
                        Start New Project
                    </button>
                </div>
                
                <section className="flex flex-col gap-stack-md">
                    <div className="flex justify-between items-center">
                        <h2 className="font-headline-md text-xl font-semibold text-on-surface">Recent Decks</h2>
                        <Link to="/dashboard" className="font-label-md text-primary hover:underline">View All</Link>
                    </div>
                    
                    {recentDecks.length === 0 ? (
                        <div className="bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-on-surface-variant">
                            <Folder size={48} className="mb-4 opacity-50" />
                            <h3 className="font-headline-sm text-lg font-semibold mb-1">No Recent Decks</h3>
                            <p className="font-body-md mb-4 text-center">You haven't generated any presentations yet.</p>
                            <button onClick={handleNewPresentation} className="font-label-md text-primary hover:underline">Create your first slide deck</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                            {recentDecks.map((deck) => (
                                <div key={deck.id} onClick={() => handleLoadDeck(deck)} className="group bg-surface border border-outline-variant rounded-xl overflow-hidden hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-150 cursor-pointer flex flex-col">
                                    <div className="w-full aspect-video relative overflow-hidden bg-surface-container-low flex items-center justify-center text-outline">
                                        <Folder size={48} className="opacity-20" />
                                        <div className="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded font-label-sm text-xs font-bold text-on-surface border border-outline-variant/50">
                                            {deck.slidesCount} Slides
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col gap-1 border-t border-outline-variant">
                                        <h3 className="font-label-md font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{deck.title || "Untitled Deck"}</h3>
                                        <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-xs">
                                            <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                            <span>Generated</span>
                                            <span className="text-outline mx-1">•</span>
                                            <span>{new Date(deck.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                
                <section className="flex flex-col gap-stack-md mt-4">
                    <h2 className="font-headline-md text-xl font-semibold text-on-surface">My Custom Themes</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-gutter">
                        <button onClick={() => setIsModalOpen(true)} className="aspect-[4/3] bg-surface-container-low border border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:text-primary hover:border-primary hover:bg-surface transition-all cursor-pointer">
                            <PlusCircle size={24} />
                            <span className="font-label-md text-sm font-semibold">New Theme</span>
                        </button>
                        
                        {savedThemes.length === 0 ? (
                            <div className="col-span-2 sm:col-span-1 aspect-[4/3] rounded-xl flex items-center justify-center text-on-surface-variant font-body-sm text-sm border border-outline-variant bg-surface-container-lowest">
                                No custom themes
                            </div>
                        ) : (
                            savedThemes.map((theme, i) => (
                                <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant cursor-pointer">
                                    <div className="absolute inset-0 bg-surface-container"></div>
                                    <div className="absolute inset-x-4 top-4 h-2 rounded-full opacity-80" style={{ backgroundColor: `#${theme.cyan}` }}></div>
                                    <div className="absolute bottom-0 w-full p-3 bg-surface border-t border-outline-variant transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out">
                                        <span className="font-label-md text-sm font-semibold text-on-surface block truncate">{theme.name}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
            
            <ThemeBuilderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}
