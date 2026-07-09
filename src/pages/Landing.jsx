import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowDown } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';

export default function Landing() {
    return (
        <>
            <main className="flex-grow pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
                {/* Hero Section */}
                <section className="flex flex-col items-center text-center mt-12 md:mt-24 mb-32 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 mb-8 font-label-md text-label-md text-primary">
                        <Sparkles size={16} />
                        <span>AI-Powered Slide Generation for Educators</span>
                    </div>
                    <h1 className="font-display-lg text-display-lg text-on-surface max-w-4xl mb-6 tracking-tight">
                        Turn Messy Question Banks into <span className="text-primary relative inline-block">Polished Slides<svg className="absolute -bottom-2 left-0 w-full text-secondary-fixed-dim/50 z-[-1]" preserveAspectRatio="none" viewBox="0 0 100 20"><path d="M0 10 Q 50 20 100 10 L 100 20 L 0 20 Z" fill="currentColor"></path></svg></span> Instantly.
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
                        Built for educators. Paste your disorganized text, let AI parse the questions, and export to PowerPoint in one click. Stop formatting and start teaching.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-on-surface-variant font-label-md text-label-md mb-8">
                        <div className="flex -space-x-2">
                            <img className="w-8 h-8 rounded-full border-2 border-surface object-cover" alt="Teacher" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-nhTYZjw--qryCBiTvc7ne1jskiYkYLZYV4DprH9R-sTjY3tPIXblEJgHdU3Shn3iEl-gOLJaB6Z7Ae4_KnTr6Cnh3ZjB-wONYotQYPpfRi6KlAGMPoczbQud3ERLTAHbGt2rgEyRpPNn6_4anY1o98-d9s4r6YLuOe2USiSkP70LFxVqfL54uHpBoQTro9Zi4_H9Q925TDu1ZZZHhP2HnJ4xq-TTcHCfkrzEJVyThiQwgnxYCaPUag" />
                            <img className="w-8 h-8 rounded-full border-2 border-surface object-cover" alt="Professor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1GwXmqemlzIxEoGUGn5Ijf6xhdBxSij6IxCT4GHxoCA7COopsQVDz3rtXhKF6mTvbTueu53TUvq4Vm6ZXEp33wG6Wy6YjvTQunzylhEgJNFErpyL2wL7NBxJYF1MiT9XRTZCG7x6Fk5YmHnWiktE6-OXN8w8AcAhHWKk3JyyFomw6TbeEkdHujhBVIEomyxVhxI97MIpxIv1x3_YRTZy09OthWeGNFJ5x7vMK0-dPJvo6hDsLCgnNuw" />
                            <img className="w-8 h-8 rounded-full border-2 border-surface object-cover" alt="Tutor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCgSw_8rf51gUBskNtJwLqcmI1WOwTcp_RfOHJMNKLwlmMoRXIJjIcIsHgbhCQKadw5YyviFAwMr0mYTxXashUXX_LPkN4OViyGnmvsB4Zmct-iicWfC5li5mgx_WNR9rZati4L45dikdZIkTLhkKpCV8FPNyPdUDScRNrGa5IAOwLFhjvKL7koBY8xsR2LIl4NK0EZBxV-PZ0mfAwhD9GndYtVo6Cu38fFwRgNUNbTN8Dlr8HGtCgqg" />
                        </div>
                        <span>Used by <strong>10,000+</strong> tutors and teachers.</span>
                    </div>
                </section>
                
                {/* Interactive Demo Section */}
                <section className="mb-32 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-white/70 backdrop-blur-md rounded-[24px] p-2 md:p-8 relative max-w-4xl mx-auto shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-surface-variant">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-tertiary-fixed-dim/20 rounded-full blur-xl z-[-1]"></div>
                        <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm flex flex-col md:flex-row">
                            <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-outline-variant bg-surface">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-outline">description</span>
                                        Paste Raw Content
                                    </label>
                                    <SignInButton mode="modal">
                                        <button className="text-primary text-label-sm font-label-sm hover:underline bg-transparent border-0 cursor-pointer p-0">Start Generating</button>
                                    </SignInButton>
                                </div>
                                <textarea readOnly className="w-full h-64 md:h-80 resize-none border-0 focus:ring-0 bg-transparent text-body-md font-body-md text-on-surface-variant placeholder:text-outline-variant p-0" placeholder="Paste your messy quiz questions, reading notes, or lesson outlines here..." value={"Q1: what is photosynthesis??? a) breathing b) making food c) sleeping d) running. ans is b.\n\n2. true/false... mitochondria is powerhouse of cell. (true)"}></textarea>
                            </div>
                            <div className="flex-1 p-6 bg-surface-container-low flex flex-col justify-center items-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-surface-container to-surface-variant opacity-50 z-0"></div>
                                <div className="relative z-10 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <Sparkles className="text-primary" size={32} />
                                    </div>
                                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Ready to Transform?</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-[250px]">Click below to see the magic happen instantly.</p>
                                    <SignInButton mode="modal">
                                        <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 border-0 cursor-pointer">
                                            Try it out
                                            <ArrowRight size={18} />
                                        </button>
                                    </SignInButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Showcase Section */}
                <section className="animate-fade-in-up mb-32" style={{ animationDelay: '0.3s' }}>
                    <div className="text-center mb-16">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">See the Difference</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">From unstructured chaos to classroom-ready clarity in seconds.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-error-container text-on-error-container font-label-sm text-label-sm px-3 py-1 rounded-bl-lg">Raw Text</div>
                            <div className="font-mono text-sm text-outline leading-relaxed mt-4 opacity-70">
                                Q1: what is photosynthesis??? a) breathing b) making food c) sleeping d) running. ans is b.<br/><br/>
                                2. true/false... mitochondria is powerhouse of cell. (true)<br/><br/>
                                3) list 3 types of rocks. igneous, sedimentary, metamorphic.
                            </div>
                        </div>
                        <div className="hidden md:flex justify-center -mx-4 z-10 relative">
                            <ArrowRight size={40} className="text-outline-variant bg-background rounded-full p-2 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-sm border border-outline-variant" />
                        </div>
                        <div className="md:hidden flex justify-center py-2">
                            <ArrowDown size={32} className="text-outline-variant" />
                        </div>
                        <div className="bg-surface rounded-2xl p-2 border border-primary/20 shadow-lg relative aspect-video flex flex-col overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-primary-container text-primary font-label-sm text-label-sm px-3 py-1 rounded-bl-lg z-20">Polished Slide</div>
                            <div className="flex-1 bg-white rounded-xl border border-surface-variant m-2 p-6 flex flex-col justify-center relative overflow-hidden shadow-sm">
                                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-surface-variant rounded-full opacity-50"></div>
                                <h4 className="font-headline-md text-[20px] text-on-surface mb-4 relative z-10">1. What is Photosynthesis?</h4>
                                <ul className="space-y-3 relative z-10">
                                    <li className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-body-md text-body-md"><div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-outline">A</div> Breathing</li>
                                    <li className="flex items-center gap-3 p-3 rounded-lg border-2 border-secondary/50 bg-secondary-container/20 text-on-secondary-container font-body-md text-body-md font-medium"><div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">B</div> Making Food</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-surface dark:bg-on-background border-t border-outline-variant dark:border-outline w-full py-8 px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-stack-md mt-auto">
                <div className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-bold">
                    SlideGen Pro
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">
                    © 2026 SlideGen Pro. Empowering educators worldwide.
                </div>
            </footer>
        </>
    );
}
