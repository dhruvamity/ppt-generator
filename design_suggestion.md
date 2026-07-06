Landing Page - Slide Generator Pro

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SlideGen Pro - Instant Slide Generator for Educators</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:wght@100..900&display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "error": "#ba1a1a",
                      "on-surface": "#0b1c30",
                      "secondary": "#006a61",
                      "on-primary-fixed": "#00174b",
                      "on-surface-variant": "#434655",
                      "surface-container-low": "#eff4ff",
                      "outline": "#737686",
                      "on-error": "#ffffff",
                      "surface-dim": "#cbdbf5",
                      "outline-variant": "#c3c6d7",
                      "primary-container": "#2563eb",
                      "on-tertiary-fixed-variant": "#653e00",
                      "surface-container-highest": "#d3e4fe",
                      "on-tertiary-fixed": "#2a1700",
                      "surface-bright": "#f8f9ff",
                      "on-secondary-fixed": "#00201d",
                      "inverse-surface": "#213145",
                      "tertiary-fixed-dim": "#ffb95f",
                      "primary-fixed": "#dbe1ff",
                      "surface-variant": "#d3e4fe",
                      "secondary-fixed-dim": "#6bd8cb",
                      "error-container": "#ffdad6",
                      "on-tertiary-container": "#ffeedd",
                      "on-primary": "#ffffff",
                      "tertiary": "#784b00",
                      "on-secondary": "#ffffff",
                      "surface": "#f8f9ff",
                      "surface-container-lowest": "#ffffff",
                      "inverse-on-surface": "#eaf1ff",
                      "surface-tint": "#0053db",
                      "primary": "#004ac6",
                      "tertiary-fixed": "#ffddb8",
                      "on-error-container": "#93000a",
                      "on-secondary-container": "#006f66",
                      "secondary-container": "#86f2e4",
                      "primary-fixed-dim": "#b4c5ff",
                      "on-primary-fixed-variant": "#003ea8",
                      "on-secondary-fixed-variant": "#005049",
                      "on-primary-container": "#eeefff",
                      "on-tertiary": "#ffffff",
                      "tertiary-container": "#996100",
                      "on-background": "#0b1c30",
                      "inverse-primary": "#b4c5ff",
                      "surface-container": "#e5eeff",
                      "surface-container-high": "#dce9ff",
                      "secondary-fixed": "#89f5e7",
                      "background": "#f8f9ff"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "spacing": {
                      "container-max": "1280px",
                      "stack-sm": "8px",
                      "unit": "4px",
                      "gutter": "24px",
                      "margin-mobile": "16px",
                      "margin-desktop": "40px",
                      "stack-md": "16px",
                      "stack-lg": "32px"
              },
              "fontFamily": {
                      "headline-md": ["Geist"],
                      "label-md": ["Geist"],
                      "body-md": ["Inter"],
                      "body-lg": ["Inter"],
                      "label-sm": ["Geist"],
                      "headline-lg-mobile": ["Geist"],
                      "display-lg": ["Geist"],
                      "headline-lg": ["Geist"]
              },
              "fontSize": {
                      "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                      "label-md": ["14px", {"lineHeight": "1.4", "letterSpacing": "0.01em", "fontWeight": "500"}],
                      "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
                      "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                      "label-sm": ["12px", {"lineHeight": "1.2", "fontWeight": "600"}],
                      "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "600"}],
                      "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                      "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600"}]
              }
            }
          }
        }
    </script>
<style>
        @layer utilities {
            .glass-panel {
                @apply bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.05)];
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
<!-- Ambient Background Elements -->
<div class="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
<div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed-dim/30 blur-[120px]"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-fixed-dim/20 blur-[150px]"></div>
</div>
<!-- TopNavBar -->
<nav class="bg-surface dark:bg-on-background border-b border-outline-variant dark:border-outline fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 mx-auto">
<div class="flex items-center gap-gutter">
<span class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">SlideGen Pro</span>
<div class="hidden md:flex gap-stack-md font-body-md text-body-md">
<a class="text-primary dark:text-primary-fixed font-bold border-b-2 border-primary dark:border-primary-fixed pb-1 hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Dashboard</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Templates</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Library</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Documentation</a>
</div>
</div>
<div class="flex items-center gap-stack-sm">
<button class="font-label-md text-label-md text-on-surface-variant hover:bg-surface-variant px-4 py-2 rounded-lg transition-colors hidden sm:block">Pro Plan</button>
<button class="font-label-md text-label-md bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-all shadow-sm">Create Slide</button>
<div class="w-8 h-8 rounded-full bg-surface-variant ml-2 border border-outline-variant overflow-hidden">
<img alt="Educator Profile Settings" class="w-full h-full object-cover" data-alt="A minimal, flat-design avatar profile image suitable for an educator persona. Modern vector style, soft blue tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzD2GgU9btckpE7mM4hJ6T2ux5EtLe59BCzjKrPAGLvUkTAULfNNFy9Gc-xIL6wcpywG3m-EZdKiUb76PNURQAdJ9pSYnSrxigBTBPIoZNgIROQXmEJv7zhpe6qjTenW8M_MeZGEsVdT7GjmYJO5mUOjXctA4vt0SigY35UDhmzNAkCMcLFEUORdSpvWEN-E-1KJrTuqsMIoMXXcsYEn0X6E9X209Pj4IqBdwmGwWU5gr1SnWiyA6D9Q"/>
</div>
</div>
</nav>
<!-- Main Content -->
<main class="flex-grow pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
<!-- Hero Section -->
<section class="flex flex-col items-center text-center mt-12 md:mt-24 mb-32 fade-in-up" style="animation-delay: 0.1s;">
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 mb-8 font-label-md text-label-md text-primary">
<span class="material-symbols-outlined text-[16px]">auto_awesome</span>
<span>AI-Powered Slide Generation for Educators</span>
</div>
<h1 class="font-display-lg text-display-lg text-on-surface max-w-4xl mb-6 tracking-tight">
                Turn Messy Question Banks into <span class="text-primary relative inline-block">Polished Slides<svg class="absolute -bottom-2 left-0 w-full text-secondary-fixed-dim/50 z-[-1]" preserveaspectratio="none" viewbox="0 0 100 20"><path d="M0 10 Q 50 20 100 10 L 100 20 L 0 20 Z" fill="currentColor"></path></svg></span> Instantly.
            </h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
                Built for educators. Paste your disorganized text, let AI parse the questions, and export to PowerPoint in one click. Stop formatting and start teaching.
            </p>
<div class="flex flex-col sm:flex-row items-center gap-4 text-on-surface-variant font-label-md text-label-md mb-8">
<div class="flex -space-x-2">
<img class="w-8 h-8 rounded-full border-2 border-surface" data-alt="Small round avatar portrait of a smiling teacher, professional lighting, corporate modern style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-nhTYZjw--qryCBiTvc7ne1jskiYkYLZYV4DprH9R-sTjY3tPIXblEJgHdU3Shn3iEl-gOLJaB6Z7Ae4_KnTr6Cnh3ZjB-wONYotQYPpfRi6KlAGMPoczbQud3ERLTAHbGt2rgEyRpPNn6_4anY1o98-d9s4r6YLuOe2USiSkP70LFxVqfL54uHpBoQTro9Zi4_H9Q925TDu1ZZZHhP2HnJ4xq-TTcHCfkrzEJVyThiQwgnxYCaPUag"/>
<img class="w-8 h-8 rounded-full border-2 border-surface" data-alt="Small round avatar portrait of a college professor, professional lighting, corporate modern style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1GwXmqemlzIxEoGUGn5Ijf6xhdBxSij6IxCT4GHxoCA7COopsQVDz3rtXhKF6mTvbTueu53TUvq4Vm6ZXEp33wG6Wy6YjvTQunzylhEgJNFErpyL2wL7NBxJYF1MiT9XRTZCG7x6Fk5YmHnWiktE6-OXN8w8AcAhHWKk3JyyFomw6TbeEkdHujhBVIEomyxVhxI97MIpxIv1x3_YRTZy09OthWeGNFJ5x7vMK0-dPJvo6hDsLCgnNuw"/>
<img class="w-8 h-8 rounded-full border-2 border-surface" data-alt="Small round avatar portrait of a high school tutor, professional lighting, corporate modern style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCgSw_8rf51gUBskNtJwLqcmI1WOwTcp_RfOHJMNKLwlmMoRXIJjIcIsHgbhCQKadw5YyviFAwMr0mYTxXashUXX_LPkN4OViyGnmvsB4Zmct-iicWfC5li5mgx_WNR9rZati4L45dikdZIkTLhkKpCV8FPNyPdUDScRNrGa5IAOwLFhjvKL7koBY8xsR2LIl4NK0EZBxV-PZ0mfAwhD9GndYtVo6Cu38fFwRgNUNbTN8Dlr8HGtCgqg"/>
</div>
<span>Used by <strong>10,000+</strong> tutors and teachers.</span>
</div>
</section>
<!-- Interactive Demo Section -->
<section class="mb-32 fade-in-up" style="animation-delay: 0.2s;">
<div class="glass-panel rounded-[24px] p-2 md:p-8 relative max-w-4xl mx-auto shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-surface-variant">
<div class="absolute -top-4 -right-4 w-24 h-24 bg-tertiary-fixed-dim/20 rounded-full blur-xl z-[-1]"></div>
<div class="bg-surface rounded-xl overflow-hidden border border-outline-variant shadow-sm flex flex-col md:flex-row">
<!-- Input Area -->
<div class="flex-1 p-6 border-b md:border-b-0 md:border-r border-outline-variant bg-surface">
<div class="flex justify-between items-center mb-4">
<label class="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2">
<span class="material-symbols-outlined text-outline">description</span>
                                Paste Raw Content
                            </label>
<button class="text-primary text-label-sm font-label-sm hover:underline">Load Example</button>
</div>
<textarea class="w-full h-64 md:h-80 resize-none border-0 focus:ring-0 bg-transparent text-body-md font-body-md text-on-surface-variant placeholder:text-outline-variant p-0" placeholder="Paste your messy quiz questions, reading notes, or lesson outlines here..."></textarea>
</div>
<!-- Output Area (Preview) -->
<div class="flex-1 p-6 bg-surface-container-low flex flex-col justify-center items-center relative overflow-hidden group">
<div class="absolute inset-0 bg-gradient-to-br from-surface-container to-surface-variant opacity-50 z-0"></div>
<div class="relative z-10 text-center flex flex-col items-center">
<div class="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
<span class="material-symbols-outlined text-primary text-3xl">magic_button</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">Ready to Transform?</h3>
<p class="font-body-md text-body-md text-on-surface-variant mb-6 max-w-[250px]">Click below to see the magic happen instantly.</p>
<button class="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                                Generate Free Sample
                                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
</section>
<!-- Showcase Section (Bento Grid) -->
<section class="fade-in-up mb-32" style="animation-delay: 0.3s;">
<div class="text-center mb-16">
<h2 class="font-headline-lg text-headline-lg text-on-surface mb-4">See the Difference</h2>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">From unstructured chaos to classroom-ready clarity in seconds.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
<!-- Before -->
<div class="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden">
<div class="absolute top-0 right-0 bg-error-container text-on-error-container font-label-sm text-label-sm px-3 py-1 rounded-bl-lg">Raw Text</div>
<div class="font-mono text-sm text-outline leading-relaxed mt-4 opacity-70">
                        Q1: what is photosynthesis??? a) breathing b) making food c) sleeping d) running. ans is b.<br/><br/>
                        2. true/false... mitochondria is powerhouse of cell. (true)<br/><br/>
                        3) list 3 types of rocks. igneous, sedimentary, metamorphic.
                    </div>
</div>
<div class="hidden md:flex justify-center -mx-4 z-10 relative">
<span class="material-symbols-outlined text-4xl text-outline-variant bg-background rounded-full p-2 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-sm border border-outline-variant">arrow_forward</span>
</div>
<div class="md:hidden flex justify-center py-2">
<span class="material-symbols-outlined text-3xl text-outline-variant">arrow_downward</span>
</div>
<!-- After -->
<div class="bg-surface rounded-2xl p-2 border border-primary/20 shadow-lg relative aspect-video flex flex-col overflow-hidden group">
<div class="absolute top-0 right-0 bg-primary-container text-primary font-label-sm text-label-sm px-3 py-1 rounded-bl-lg z-20">Polished Slide</div>
<div class="flex-1 bg-white rounded-xl border border-surface-variant m-2 p-6 flex flex-col justify-center relative overflow-hidden shadow-sm">
<!-- Abstract minimal slide design -->
<div class="absolute top-0 left-0 w-2 h-full bg-primary"></div>
<div class="absolute -right-8 -bottom-8 w-32 h-32 bg-surface-variant rounded-full opacity-50"></div>
<h4 class="font-headline-md text-headline-md text-on-surface mb-4">1. What is Photosynthesis?</h4>
<ul class="space-y-3">
<li class="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-body-md text-body-md"><div class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-outline">A</div> Breathing</li>
<li class="flex items-center gap-3 p-3 rounded-lg border-2 border-secondary/50 bg-secondary-container/20 text-on-secondary-container font-body-md text-body-md font-medium"><div class="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">B</div> Making Food</li>
<li class="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-body-md text-body-md"><div class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-outline">C</div> Sleeping</li>
</ul>
</div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-surface dark:bg-on-background border-t border-outline-variant dark:border-outline w-full py-8 px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-stack-md mt-auto">
<div class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined text-primary">school</span>
            SlideGen Pro
        </div>
<div class="flex flex-wrap justify-center gap-stack-lg font-label-sm text-label-sm">
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed underline transition-opacity duration-200" href="#">Privacy Policy</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed underline transition-opacity duration-200" href="#">Terms of Service</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed underline transition-opacity duration-200" href="#">Contact Support</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed underline transition-opacity duration-200" href="#">API Status</a>
</div>
<div class="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant">
            © 2024 SlideGen Pro. Empowering educators worldwide.
        </div>
</footer>
</body></html>



Dashboard - My Projects
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SlideGen Pro - Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "error": "#ba1a1a",
                      "on-surface": "#0b1c30",
                      "secondary": "#006a61",
                      "on-primary-fixed": "#00174b",
                      "on-surface-variant": "#434655",
                      "surface-container-low": "#eff4ff",
                      "outline": "#737686",
                      "on-error": "#ffffff",
                      "surface-dim": "#cbdbf5",
                      "outline-variant": "#c3c6d7",
                      "primary-container": "#2563eb",
                      "on-tertiary-fixed-variant": "#653e00",
                      "surface-container-highest": "#d3e4fe",
                      "on-tertiary-fixed": "#2a1700",
                      "surface-bright": "#f8f9ff",
                      "on-secondary-fixed": "#00201d",
                      "inverse-surface": "#213145",
                      "tertiary-fixed-dim": "#ffb95f",
                      "primary-fixed": "#dbe1ff",
                      "surface-variant": "#d3e4fe",
                      "secondary-fixed-dim": "#6bd8cb",
                      "error-container": "#ffdad6",
                      "on-tertiary-container": "#ffeedd",
                      "on-primary": "#ffffff",
                      "tertiary": "#784b00",
                      "on-secondary": "#ffffff",
                      "surface": "#f8f9ff",
                      "surface-container-lowest": "#ffffff",
                      "inverse-on-surface": "#eaf1ff",
                      "surface-tint": "#0053db",
                      "primary": "#004ac6",
                      "tertiary-fixed": "#ffddb8",
                      "on-error-container": "#93000a",
                      "on-secondary-container": "#006f66",
                      "secondary-container": "#86f2e4",
                      "primary-fixed-dim": "#b4c5ff",
                      "on-primary-fixed-variant": "#003ea8",
                      "on-secondary-fixed-variant": "#005049",
                      "on-primary-container": "#eeefff",
                      "on-tertiary": "#ffffff",
                      "tertiary-container": "#996100",
                      "on-background": "#0b1c30",
                      "inverse-primary": "#b4c5ff",
                      "surface-container": "#e5eeff",
                      "surface-container-high": "#dce9ff",
                      "secondary-fixed": "#89f5e7",
                      "background": "#f8f9ff"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "spacing": {
                      "container-max": "1280px",
                      "stack-sm": "8px",
                      "unit": "4px",
                      "gutter": "24px",
                      "margin-mobile": "16px",
                      "margin-desktop": "40px",
                      "stack-md": "16px",
                      "stack-lg": "32px"
              },
              "fontFamily": {
                      "headline-md": ["Geist"],
                      "label-md": ["Geist"],
                      "body-md": ["Inter"],
                      "body-lg": ["Inter"],
                      "label-sm": ["Geist"],
                      "headline-lg-mobile": ["Geist"],
                      "display-lg": ["Geist"],
                      "headline-lg": ["Geist"]
              },
              "fontSize": {
                      "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                      "label-md": ["14px", {"lineHeight": "1.4", "letterSpacing": "0.01em", "fontWeight": "500"}],
                      "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
                      "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                      "label-sm": ["12px", {"lineHeight": "1.2", "fontWeight": "600"}],
                      "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "600"}],
                      "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                      "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600"}]
              }
            }
          }
        }
    </script>
</head>
<body class="bg-background text-on-background font-body-md text-body-md min-h-screen flex flex-col antialiased">
<!-- TopNavBar Shared Component -->
<nav class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 max-w-container-max mx-auto bg-surface border-b border-outline-variant">
<div class="flex items-center gap-gutter">
<!-- Brand Logo -->
<a class="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2" href="#">
<span class="material-symbols-outlined" data-icon="auto_awesome" data-weight="fill" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
                SlideGen Pro
            </a>
<!-- Navigation Links -->
<div class="hidden md:flex items-center gap-stack-lg ml-8 font-body-md text-body-md h-full">
<a class="text-primary font-bold border-b-2 border-primary pb-1 h-full flex items-center mt-1" href="#">Dashboard</a>
<a class="text-on-surface-variant hover:text-primary transition-colors h-full flex items-center" href="#">Templates</a>
<a class="text-on-surface-variant hover:text-primary transition-colors h-full flex items-center" href="#">Library</a>
<a class="text-on-surface-variant hover:text-primary transition-colors h-full flex items-center" href="#">Documentation</a>
</div>
</div>
<div class="flex items-center gap-stack-md">
<!-- Search Bar (on_right) -->
<div class="hidden lg:flex items-center bg-surface-container-low border border-outline-variant rounded-full px-4 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
<span class="material-symbols-outlined text-outline text-sm mr-2" data-icon="search">search</span>
<input class="bg-transparent border-none outline-none font-body-md text-body-md text-on-surface placeholder:text-outline text-sm w-48" placeholder="Search slides..." type="text"/>
</div>
<button class="font-label-md text-label-md bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors">Pro Plan</button>
<button class="font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 px-4 py-2 rounded-lg transition-opacity">Create Slide</button>
<!-- Profile -->
<button class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant hover:border-primary transition-colors ml-2">
<img alt="Educator Profile Settings" class="w-full h-full object-cover" data-alt="A professional headshot of an educator used as a profile picture. The image is brightly lit, crisp, and clean, fitting the SlideGen Pro minimal corporate aesthetic. The subject is smiling slightly against a neutral light grey background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQaikCn_LmHISBsAIBCAy7hy6Tt7eDWtvSjQbsvGnF8Fcsutw6lcsjUsk2sGY1KRg7KXJZ_vb7axHfNp9LJn9Phy2aQDKJ1Ftx-vkiyzrG1evBXz-udP5g8Sr2KFP14TlPb60lak5EE2XCENVzgTCyG8z0B6mJSYebdro3kXNnTXRna_BMYj43PMvgWrj27nYTBJCE2XtVHWluBlk2bmlj233rblGsy-EVvy-uxk24FivD8YGc1I-_sQ"/>
</button>
</div>
</nav>
<!-- Main Layout -->
<main class="flex-1 max-w-container-max mx-auto w-full px-margin-desktop pt-24 pb-12 flex gap-gutter mt-16">
<!-- Sidebar (Folders/Tags) -->
<aside class="w-64 hidden md:flex flex-col gap-stack-lg shrink-0 border-r border-outline-variant pr-gutter h-[calc(100vh-8rem)] sticky top-24">
<!-- Organization -->
<div class="flex flex-col gap-stack-sm">
<h3 class="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">My Workspace</h3>
<a class="flex items-center gap-3 px-3 py-2 bg-surface-container-low text-primary rounded-lg font-label-md text-label-md transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="grid_view" data-weight="fill" style="font-variation-settings: 'FILL' 1;">grid_view</span>
                    All Decks
                </a>
<a class="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg font-label-md text-label-md transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="star">star</span>
                    Starred
                </a>
<a class="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg font-label-md text-label-md transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="schedule">schedule</span>
                    Recent
                </a>
</div>
<!-- Folders -->
<div class="flex flex-col gap-stack-sm mt-4">
<div class="flex justify-between items-center mb-2 px-1">
<h3 class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Folders</h3>
<button class="text-outline hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm" data-icon="add">add</span></button>
</div>
<a class="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg font-label-md text-label-md transition-colors" href="#">
<span class="material-symbols-outlined text-secondary" data-icon="folder" data-weight="fill" style="font-variation-settings: 'FILL' 1;">folder</span>
                    Biology 101
                </a>
<a class="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg font-label-md text-label-md transition-colors" href="#">
<span class="material-symbols-outlined text-tertiary" data-icon="folder" data-weight="fill" style="font-variation-settings: 'FILL' 1;">folder</span>
                    SAT Math Prep
                </a>
<a class="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg font-label-md text-label-md transition-colors" href="#">
<span class="material-symbols-outlined text-outline" data-icon="folder">folder</span>
                    World History
                </a>
</div>
<!-- Tags -->
<div class="flex flex-col gap-stack-sm mt-auto pb-4">
<h3 class="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2">Quick Tags</h3>
<div class="flex flex-wrap gap-2">
<span class="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded font-label-sm text-label-sm cursor-pointer hover:bg-surface-dim transition-colors">#Quiz</span>
<span class="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded font-label-sm text-label-sm cursor-pointer hover:bg-surface-dim transition-colors">#Lecture</span>
<span class="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded font-label-sm text-label-sm cursor-pointer hover:bg-surface-dim transition-colors">#Midterm</span>
</div>
</div>
</aside>
<!-- Main Content Area -->
<div class="flex-1 flex flex-col gap-stack-lg min-w-0">
<!-- Header Section -->
<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
<div>
<h1 class="font-headline-lg text-headline-lg text-on-surface mb-1">Welcome back, Professor Smith.</h1>
<p class="font-body-md text-body-md text-on-surface-variant">You have 3 presentations scheduled for this week.</p>
</div>
<button class="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm shadow-primary/20">
<span class="material-symbols-outlined" data-icon="add">add</span>
                    Start New Project
                </button>
</div>
<!-- Recent Decks Section -->
<section class="flex flex-col gap-stack-md">
<div class="flex justify-between items-center">
<h2 class="font-headline-md text-headline-md text-on-surface text-xl">Recent Decks</h2>
<a class="font-label-md text-label-md text-primary hover:underline" href="#">View All</a>
</div>
<!-- Deck Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
<!-- Card 1 -->
<div class="group bg-surface border border-outline-variant rounded-xl overflow-hidden hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-150 cursor-pointer flex flex-col">
<div class="w-full aspect-video relative overflow-hidden bg-surface-container-low">
<div class="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300" data-alt="A clean, modern title slide for a biology presentation featuring microscopic cellular structures in a minimalist vector style. The design uses a crisp white background with accents of SlideGen Pro's primary blue and secondary teal. The overall aesthetic is highly professional, legible, and educational." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAL6p8vgqnvi5zkD2CPspNGzc2roxUnk_8D_n2RlWb87B08A92ZuUUJIdjoIVlys8ZJoHPyNjlvj2tLY5zvt67F2dOxGNLYsVQz0JP2mbNbo-ey3CY333_MZjFVV5oDLPHZZnuoBf-GbB5B-NX5W75KgGhbnwusjiOPGb-t4vh1_G2diJo3Uh3ZBg5Ot-ACZVY-6BU491YhoFk7Xr1Xe2t2Jw7XNBqu6j_RIKT-8xWefYXKYnppCC1tWA')"></div>
<div class="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded font-label-sm text-label-sm text-on-surface border border-outline-variant/50">12 Slides</div>
</div>
<div class="p-4 flex flex-col gap-1 border-t border-outline-variant">
<h3 class="font-label-md text-label-md text-on-surface font-semibold truncate group-hover:text-primary transition-colors">Biology 101 Quiz</h3>
<div class="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span>Synced</span>
<span class="text-outline mx-1">•</span>
<span>Edited 2 hours ago</span>
</div>
</div>
</div>
<!-- Card 2 -->
<div class="group bg-surface border border-outline-variant rounded-xl overflow-hidden hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-150 cursor-pointer flex flex-col">
<div class="w-full aspect-video relative overflow-hidden bg-surface-container-low">
<div class="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300" data-alt="A highly organized presentation slide displaying geometric shapes and algebraic formulas. The layout is structured on a strict grid with generous whitespace, characteristic of the SlideGen Pro corporate modern style. The color palette relies on high-contrast black text on pristine white, with subtle blue tonal layers for depth." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmidf84A2eGzeAMSHro63dqmM5TuX6ljfQEzF5tvmFXS4RGYINdulAXYQ2T3EWhEYGqNiegF4wRSvpWO-YIBAmsfSGyaqvKYALho93NGVkm7zqH3UWgZ3rL3F5pCr_AE4THWROH4ychDZEIJotXHEBF29aoXpe-EyOSy0IHcYkebKRzqMauXd7ghDzzs4DM_91B2M61iXowuoJzh0fh5N7cnayb2YOqIJkS0LIlYZpY7woxGiZfbwYBA')"></div>
<div class="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded font-label-sm text-label-sm text-on-surface border border-outline-variant/50">45 Slides</div>
</div>
<div class="p-4 flex flex-col gap-1 border-t border-outline-variant">
<h3 class="font-label-md text-label-md text-on-surface font-semibold truncate group-hover:text-primary transition-colors">SAT Math Prep - Geometry</h3>
<div class="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span>Synced</span>
<span class="text-outline mx-1">•</span>
<span>Edited yesterday</span>
</div>
</div>
</div>
<!-- Card 3 -->
<div class="group bg-surface border border-outline-variant rounded-xl overflow-hidden hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-150 cursor-pointer flex flex-col">
<div class="w-full aspect-video relative overflow-hidden bg-surface-container-low">
<div class="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300" data-alt="A minimalist educational slide design featuring a stylized, abstract map of the world. The aesthetic is clean and uncluttered, suitable for a fast-paced lecture. The visual utilizes the SlideGen Pro design system with flat surface layers and ambient shadows, emphasizing clarity and efficiency over ornamentation." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZ4vidg35wbvGrIWSREq0GMaXReuwE4g8dvcdgKLohvoGFkDHCZcQ7B9i2tasifqmY90Ug0QJEzOe_2Fk7pMfeKyV9TGrEFdlP8p0gdpLPuFIy2ZhrojEo8tPXNxTLDelY3feYqwHP-p_Z1S9U7BnbgSK3ul-FJ6WmOW_MY2X2fcGALtqoSb4LcYOamzQOz5gaGc6UeTlvPppZSXDXCOnRaC72FrKaGljm4_pbDQo-4ZAaZy7C6jbiFQ')"></div>
<div class="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded font-label-sm text-label-sm text-on-surface border border-outline-variant/50">28 Slides</div>
</div>
<div class="p-4 flex flex-col gap-1 border-t border-outline-variant">
<h3 class="font-label-md text-label-md text-on-surface font-semibold truncate group-hover:text-primary transition-colors">World History: Chapter 4</h3>
<div class="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
<span class="w-2 h-2 rounded-full bg-outline"></span>
<span>Draft</span>
<span class="text-outline mx-1">•</span>
<span>Edited 3 days ago</span>
</div>
</div>
</div>
</div>
</section>
<!-- Custom Themes Section -->
<section class="flex flex-col gap-stack-md mt-4">
<h2 class="font-headline-md text-headline-md text-on-surface text-xl">My Custom Themes</h2>
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-gutter">
<!-- Create New Theme Card -->
<div class="aspect-[4/3] bg-surface-container-low border border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:text-primary hover:border-primary hover:bg-surface transition-all cursor-pointer">
<span class="material-symbols-outlined text-3xl" data-icon="add_circle">add_circle</span>
<span class="font-label-md text-label-md">New Theme</span>
</div>
<!-- Theme 1 -->
<div class="group relative aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant cursor-pointer">
<div class="absolute inset-0 bg-gradient-to-br from-surface to-surface-container-highest"></div>
<div class="absolute inset-x-4 top-4 h-2 bg-primary rounded-full opacity-80"></div>
<div class="absolute inset-x-4 top-8 h-2 w-1/2 bg-on-surface rounded-full opacity-20"></div>
<div class="absolute bottom-0 w-full p-3 bg-surface border-t border-outline-variant transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out">
<span class="font-label-md text-label-md text-on-surface block truncate">Minimal Corporate</span>
</div>
</div>
<!-- Theme 2 -->
<div class="group relative aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant cursor-pointer">
<div class="absolute inset-0 bg-gradient-to-br from-[#1a202c] to-[#2d3748]"></div>
<div class="absolute inset-x-4 top-4 h-2 bg-secondary-fixed-dim rounded-full opacity-80"></div>
<div class="absolute inset-x-4 top-8 h-2 w-2/3 bg-white rounded-full opacity-20"></div>
<div class="absolute bottom-0 w-full p-3 bg-surface border-t border-outline-variant transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out">
<span class="font-label-md text-label-md text-on-surface block truncate">Dark Mode Academic</span>
</div>
</div>
</div>
</section>
</div>
</main>
</body></html>

AI Generator - Paste Content

<!DOCTYPE html>

<html class="h-full" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SlideGen Pro - Generator</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "error": "#ba1a1a",
                      "on-surface": "#0b1c30",
                      "secondary": "#006a61",
                      "on-primary-fixed": "#00174b",
                      "on-surface-variant": "#434655",
                      "surface-container-low": "#eff4ff",
                      "outline": "#737686",
                      "on-error": "#ffffff",
                      "surface-dim": "#cbdbf5",
                      "outline-variant": "#c3c6d7",
                      "primary-container": "#2563eb",
                      "on-tertiary-fixed-variant": "#653e00",
                      "surface-container-highest": "#d3e4fe",
                      "on-tertiary-fixed": "#2a1700",
                      "surface-bright": "#f8f9ff",
                      "on-secondary-fixed": "#00201d",
                      "inverse-surface": "#213145",
                      "tertiary-fixed-dim": "#ffb95f",
                      "primary-fixed": "#dbe1ff",
                      "surface-variant": "#d3e4fe",
                      "secondary-fixed-dim": "#6bd8cb",
                      "error-container": "#ffdad6",
                      "on-tertiary-container": "#ffeedd",
                      "on-primary": "#ffffff",
                      "tertiary": "#784b00",
                      "on-secondary": "#ffffff",
                      "surface": "#f8f9ff",
                      "surface-container-lowest": "#ffffff",
                      "inverse-on-surface": "#eaf1ff",
                      "surface-tint": "#0053db",
                      "primary": "#004ac6",
                      "tertiary-fixed": "#ffddb8",
                      "on-error-container": "#93000a",
                      "on-secondary-container": "#006f66",
                      "secondary-container": "#86f2e4",
                      "primary-fixed-dim": "#b4c5ff",
                      "on-primary-fixed-variant": "#003ea8",
                      "on-secondary-fixed-variant": "#005049",
                      "on-primary-container": "#eeefff",
                      "on-tertiary": "#ffffff",
                      "tertiary-container": "#996100",
                      "on-background": "#0b1c30",
                      "inverse-primary": "#b4c5ff",
                      "surface-container": "#e5eeff",
                      "surface-container-high": "#dce9ff",
                      "secondary-fixed": "#89f5e7",
                      "background": "#f8f9ff"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "spacing": {
                      "container-max": "1280px",
                      "stack-sm": "8px",
                      "unit": "4px",
                      "gutter": "24px",
                      "margin-mobile": "16px",
                      "margin-desktop": "40px",
                      "stack-md": "16px",
                      "stack-lg": "32px"
              },
              "fontFamily": {
                      "headline-md": [
                              "Geist"
                      ],
                      "label-md": [
                              "Geist"
                      ],
                      "body-md": [
                              "Inter"
                      ],
                      "body-lg": [
                              "Inter"
                      ],
                      "label-sm": [
                              "Geist"
                      ],
                      "headline-lg-mobile": [
                              "Geist"
                      ],
                      "display-lg": [
                              "Geist"
                      ],
                      "headline-lg": [
                              "Geist"
                      ]
              },
              "fontSize": {
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "1.3",
                                      "fontWeight": "600"
                              }
                      ],
                      "label-md": [
                              "14px",
                              {
                                      "lineHeight": "1.4",
                                      "letterSpacing": "0.01em",
                                      "fontWeight": "500"
                              }
                      ],
                      "body-md": [
                              "16px",
                              {
                                      "lineHeight": "1.5",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-lg": [
                              "18px",
                              {
                                      "lineHeight": "1.6",
                                      "fontWeight": "400"
                              }
                      ],
                      "label-sm": [
                              "12px",
                              {
                                      "lineHeight": "1.2",
                                      "fontWeight": "600"
                              }
                      ],
                      "headline-lg-mobile": [
                              "24px",
                              {
                                      "lineHeight": "1.2",
                                      "fontWeight": "600"
                              }
                      ],
                      "display-lg": [
                              "48px",
                              {
                                      "lineHeight": "1.1",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "700"
                              }
                      ],
                      "headline-lg": [
                              "32px",
                              {
                                      "lineHeight": "1.2",
                                      "letterSpacing": "-0.01em",
                                      "fontWeight": "600"
                              }
                      ]
              }
      },
          },
        }
    </script>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@500;600;700&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
        }
        
        textarea {
            resize: none;
        }
    </style>
</head>
<body class="bg-background text-on-background h-full font-body-md overflow-hidden flex flex-col">
<!-- TopNavBar -->
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 max-w-container-max mx-auto bg-surface dark:bg-on-background border-b border-outline-variant dark:border-outline">
<div class="flex items-center gap-stack-lg">
<h1 class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">SlideGen Pro</h1>
<nav class="hidden md:flex gap-stack-md font-body-md text-body-md">
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Dashboard</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Templates</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Library</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Documentation</a>
</nav>
</div>
<div class="flex items-center gap-stack-md">
<button class="font-label-md text-label-md text-primary dark:text-primary-fixed hover:text-primary-container transition-colors">Pro Plan</button>
<button class="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-2 px-4 rounded-lg transition-colors">Create Slide</button>
<div class="w-8 h-8 rounded-full bg-surface-variant overflow-hidden cursor-pointer ml-stack-sm">
<img alt="Educator Profile Settings" class="w-full h-full object-cover" data-alt="A professional headshot portrait of a smiling educator wearing a crisp blue shirt, set against a bright, modern office background. High-key lighting emphasizing clarity and competence in a corporate minimal style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDU90HGoQQbNYujHXpioywBgjF0Lpwpim7Ijmj2GbejZPpCpwvCZWzUJNyoOru1JvNacJYjzg_Ae1jT37GK9bD2nn8MaUeXDMlWV4LgGrC6p85jtuR2IEwd-kaZlED2QGco5n0vNgVBjGBIHqEmGx53QpAxv5g83HdMs_0P3k4-c2o6OMaH2B20Q0s0_Zu-yosP2Ye2ytePubDz3eWa4etiprAnA6ywdQ_yFEKcr_8AuEXl6VeZwDSkg"/>
</div>
</div>
</header>
<div class="flex flex-1 pt-16 h-full overflow-hidden">
<!-- SideNavBar -->
<aside class="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex-col border-r border-outline-variant dark:border-outline bg-surface-container-low dark:bg-inverse-surface z-40 pb-stack-md">
<div class="p-gutter flex items-center gap-stack-md border-b border-outline-variant/50">
<div class="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined" data-icon="auto_awesome" data-weight="fill" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
</div>
<div>
<h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">AI Editor</h2>
<p class="font-label-sm text-label-sm text-on-surface-variant">Zen Mode Active</p>
</div>
</div>
<nav class="flex-1 overflow-y-auto py-stack-md flex flex-col gap-unit">
<a class="flex items-center gap-stack-md p-3 mx-2 bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container rounded-xl font-label-md text-label-md scale-95 duration-100" href="#">
<span class="material-symbols-outlined" data-icon="auto_awesome" data-weight="fill" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
                    Generator
                </a>
<a class="flex items-center gap-stack-md p-3 mx-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-xl transition-all font-label-md text-label-md" href="#">
<span class="material-symbols-outlined" data-icon="palette">palette</span>
                    Themes
                </a>
<a class="flex items-center gap-stack-md p-3 mx-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-xl transition-all font-label-md text-label-md" href="#">
<span class="material-symbols-outlined" data-icon="perm_media">perm_media</span>
                    Media Library
                </a>
<a class="flex items-center gap-stack-md p-3 mx-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-xl transition-all font-label-md text-label-md" href="#">
<span class="material-symbols-outlined" data-icon="description">description</span>
                    Notes
                </a>
<a class="flex items-center gap-stack-md p-3 mx-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-xl transition-all font-label-md text-label-md" href="#">
<span class="material-symbols-outlined" data-icon="history">history</span>
                    History
                </a>
</nav>
<div class="px-gutter mt-auto pt-stack-md flex flex-col gap-stack-md border-t border-outline-variant/50">
<a class="flex items-center gap-stack-md px-2 py-2 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="settings">settings</span>
                    Settings
                </a>
<a class="flex items-center gap-stack-md px-2 py-2 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#">
<span class="material-symbols-outlined text-[20px]" data-icon="help">help</span>
                    Support
                </a>
<button class="w-full bg-surface-variant hover:bg-surface-container-highest text-primary font-label-md text-label-md py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-stack-sm mt-stack-sm">
<span class="material-symbols-outlined text-[18px]" data-icon="ios_share">ios_share</span>
                    Export Slides
                </button>
</div>
</aside>
<!-- Main Workspace -->
<main class="flex-1 md:ml-64 flex flex-col lg:flex-row h-full overflow-hidden bg-background">
<!-- Central Area (Editor) -->
<div class="flex-1 flex flex-col h-full relative p-gutter lg:p-margin-desktop overflow-hidden border-r border-outline-variant/30">
<div class="flex-1 bg-surface rounded-2xl border border-outline-variant shadow-sm flex flex-col overflow-hidden relative">
<div class="flex items-center justify-between p-stack-md border-b border-outline-variant/50 bg-surface-container-lowest">
<div class="flex items-center gap-stack-sm text-on-surface-variant">
<span class="material-symbols-outlined text-[20px]">edit_document</span>
<span class="font-label-md text-label-md">Raw Content Input</span>
</div>
<div class="flex items-center gap-stack-sm">
<div class="w-2 h-2 rounded-full bg-secondary"></div>
<span class="font-label-sm text-label-sm text-on-surface-variant">Auto-saving</span>
</div>
</div>
<textarea class="flex-1 w-full p-gutter lg:p-margin-desktop bg-transparent border-none focus:ring-0 font-body-lg text-body-lg text-on-surface placeholder-on-surface-variant/50 leading-relaxed outline-none" placeholder="Paste your raw questions, messy notes, or curriculum snippets here..."></textarea>
<!-- Floating Parse Control inside editor area for context -->
<div class="absolute bottom-stack-lg left-1/2 -translate-x-1/2 flex flex-col items-center gap-stack-sm pointer-events-none">
<div class="bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/50 shadow-sm flex items-center gap-2 pointer-events-auto">
<span class="material-symbols-outlined text-secondary text-[16px]">lightbulb</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">Pro Tip: AI handles typos and weird formatting automatically.</span>
</div>
<button class="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-3 px-6 rounded-full shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 pointer-events-auto flex items-center gap-stack-sm">
<span class="material-symbols-outlined" data-icon="psychiatry" data-weight="fill" style="font-variation-settings: 'FILL' 1;">psychiatry</span>
                            Parse Questions
                        </button>
</div>
</div>
</div>
<!-- Configuration Sidebar (Right) -->
<aside class="w-full lg:w-[320px] bg-surface flex-shrink-0 h-full overflow-y-auto p-gutter border-l border-outline-variant/30 hidden lg:block">
<div class="mb-stack-lg flex items-center gap-stack-sm text-on-surface">
<span class="material-symbols-outlined" data-icon="tune">tune</span>
<h3 class="font-headline-sm text-headline-sm font-semibold">Presentation Setup</h3>
</div>
<div class="flex flex-col gap-stack-md">
<!-- Slide Title -->
<div class="flex flex-col gap-stack-sm">
<label class="font-label-md text-label-md text-on-surface" for="slideTitle">Slide Title</label>
<input class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" id="slideTitle" placeholder="e.g. Chapter 4 Quiz" type="text"/>
</div>
<!-- Slide Subtitle -->
<div class="flex flex-col gap-stack-sm">
<label class="font-label-md text-label-md text-on-surface" for="slideSubtitle">Subtitle (Optional)</label>
<input class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" id="slideSubtitle" placeholder="e.g. History &amp; Geography" type="text"/>
</div>
<!-- Footer Text -->
<div class="flex flex-col gap-stack-sm mt-stack-md">
<label class="font-label-md text-label-md text-on-surface flex items-center gap-2" for="footerText">
                            Footer Text
                            <span class="material-symbols-outlined text-[14px] text-on-surface-variant cursor-help" title="Appears at the bottom of generated slides">info</span>
</label>
<input class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" id="footerText" placeholder="e.g. Ms. Smith | Fall 2024" type="text"/>
</div>
<div class="mt-stack-lg pt-stack-md border-t border-outline-variant/50">
<div class="bg-surface-container-low rounded-xl p-stack-md">
<h4 class="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-stack-sm">Style Preview</h4>
<div class="aspect-video bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col justify-center items-center p-4 relative overflow-hidden shadow-sm">
<div class="w-full h-2 bg-primary/20 rounded-full mb-2 w-3/4"></div>
<div class="w-full h-1 bg-on-surface-variant/20 rounded-full w-1/2"></div>
<div class="absolute bottom-2 left-2 text-[8px] text-on-surface-variant/50 font-mono">Ms. Smith | Fall 2024</div>
</div>
</div>
</div>
</div>
</aside>
</main>
</div>
</body></html>

Review & Export Slides
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SlideGen Pro - Generator Workspace</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "error": "#ba1a1a",
                      "on-surface": "#0b1c30",
                      "secondary": "#006a61",
                      "on-primary-fixed": "#00174b",
                      "on-surface-variant": "#434655",
                      "surface-container-low": "#eff4ff",
                      "outline": "#737686",
                      "on-error": "#ffffff",
                      "surface-dim": "#cbdbf5",
                      "outline-variant": "#c3c6d7",
                      "primary-container": "#2563eb",
                      "on-tertiary-fixed-variant": "#653e00",
                      "surface-container-highest": "#d3e4fe",
                      "on-tertiary-fixed": "#2a1700",
                      "surface-bright": "#f8f9ff",
                      "on-secondary-fixed": "#00201d",
                      "inverse-surface": "#213145",
                      "tertiary-fixed-dim": "#ffb95f",
                      "primary-fixed": "#dbe1ff",
                      "surface-variant": "#d3e4fe",
                      "secondary-fixed-dim": "#6bd8cb",
                      "error-container": "#ffdad6",
                      "on-tertiary-container": "#ffeedd",
                      "on-primary": "#ffffff",
                      "tertiary": "#784b00",
                      "on-secondary": "#ffffff",
                      "surface": "#f8f9ff",
                      "surface-container-lowest": "#ffffff",
                      "inverse-on-surface": "#eaf1ff",
                      "surface-tint": "#0053db",
                      "primary": "#004ac6",
                      "tertiary-fixed": "#ffddb8",
                      "on-error-container": "#93000a",
                      "on-secondary-container": "#006f66",
                      "secondary-container": "#86f2e4",
                      "primary-fixed-dim": "#b4c5ff",
                      "on-primary-fixed-variant": "#003ea8",
                      "on-secondary-fixed-variant": "#005049",
                      "on-primary-container": "#eeefff",
                      "on-tertiary": "#ffffff",
                      "tertiary-container": "#996100",
                      "on-background": "#0b1c30",
                      "inverse-primary": "#b4c5ff",
                      "surface-container": "#e5eeff",
                      "surface-container-high": "#dce9ff",
                      "secondary-fixed": "#89f5e7",
                      "background": "#f8f9ff"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "spacing": {
                      "container-max": "1280px",
                      "stack-sm": "8px",
                      "unit": "4px",
                      "gutter": "24px",
                      "margin-mobile": "16px",
                      "margin-desktop": "40px",
                      "stack-md": "16px",
                      "stack-lg": "32px"
              },
              "fontFamily": {
                      "headline-md": [
                              "Geist"
                      ],
                      "label-md": [
                              "Geist"
                      ],
                      "body-md": [
                              "Inter"
                      ],
                      "body-lg": [
                              "Inter"
                      ],
                      "label-sm": [
                              "Geist"
                      ],
                      "headline-lg-mobile": [
                              "Geist"
                      ],
                      "display-lg": [
                              "Geist"
                      ],
                      "headline-lg": [
                              "Geist"
                      ]
              },
              "fontSize": {
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "1.3",
                                      "fontWeight": "600"
                              }
                      ],
                      "label-md": [
                              "14px",
                              {
                                      "lineHeight": "1.4",
                                      "letterSpacing": "0.01em",
                                      "fontWeight": "500"
                              }
                      ],
                      "body-md": [
                              "16px",
                              {
                                      "lineHeight": "1.5",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-lg": [
                              "18px",
                              {
                                      "lineHeight": "1.6",
                                      "fontWeight": "400"
                              }
                      ],
                      "label-sm": [
                              "12px",
                              {
                                      "lineHeight": "1.2",
                                      "fontWeight": "600"
                              }
                      ],
                      "headline-lg-mobile": [
                              "24px",
                              {
                                      "lineHeight": "1.2",
                                      "fontWeight": "600"
                              }
                      ],
                      "display-lg": [
                              "48px",
                              {
                                      "lineHeight": "1.1",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "700"
                              }
                      ],
                      "headline-lg": [
                              "32px",
                              {
                                      "lineHeight": "1.2",
                                      "letterSpacing": "-0.01em",
                                      "fontWeight": "600"
                              }
                      ]
              }
      },
          },
        }
      </script>
</head>
<body class="bg-background text-on-background font-body-md text-body-md overflow-x-hidden min-h-screen pt-16 md:pl-64">
<!-- TopNavBar -->
<nav class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto bg-surface dark:bg-on-background border-b border-outline-variant dark:border-outline">
<div class="flex items-center gap-gutter">
<span class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">SlideGen Pro</span>
<div class="hidden md:flex gap-stack-md ml-gutter">
<a class="font-label-md text-label-md text-primary dark:text-primary-fixed font-bold border-b-2 border-primary dark:border-primary-fixed pb-1 hover:text-primary dark:hover:text-primary-fixed transition-colors opacity-80 duration-150" href="#">Dashboard</a>
<a class="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Templates</a>
<a class="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Library</a>
<a class="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Documentation</a>
</div>
</div>
<div class="flex items-center gap-stack-md">
<div class="hidden md:flex relative text-on-surface-variant">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2">search</span>
<input class="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 transition-all" placeholder="Search..." type="text"/>
</div>
<button class="font-label-md text-label-md text-primary hover:text-primary-container transition-colors">Pro Plan</button>
<button class="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors">Create Slide</button>
<img alt="Educator Profile Settings" class="w-8 h-8 rounded-full border border-outline-variant object-cover ml-2" data-alt="A clean, professional headshot of a teacher smiling softly, shot against a bright, minimalist modern classroom background. The lighting is soft and even, highlighting a friendly and competent demeanor. The overall aesthetic aligns with a premium productivity tool, using light mode colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDm7cKbm2NmNBl_3Byf2AwLppHbRSk7oiJdjc8q-vkCj3GSWM4CYHzdeQsAT2RPlEc0f8Jwr7cpPe2eMBTzlHQzBcYgvoHV6mT9yJ7bKaGsm1f8P62A-xYPg9-BVIOewvNetcZtPvV29TDbN4XIhhFmyqlDNSTT7FdiRyB0m0ur8YWLVt0ajQKlfC--NZOH4XIV5YG8o3V92bxfC449O0PcKuUNN6avbfuxeJ8CVJ0CdAWZ6hRMVxg1Lg"/>
</div>
</nav>
<!-- SideNavBar (Desktop Only) -->
<aside class="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex-col border-r border-outline-variant dark:border-outline bg-surface-container-low dark:bg-inverse-surface z-40">
<div class="p-gutter pb-4 border-b border-outline-variant flex items-center gap-stack-sm">
<div class="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
<span class="material-symbols-outlined">workspace_premium</span>
</div>
<div class="flex flex-col overflow-hidden">
<span class="font-headline-sm text-headline-sm font-bold text-on-surface truncate">AI Editor</span>
<span class="text-label-sm text-on-surface-variant truncate">Zen Mode Active</span>
</div>
</div>
<div class="flex-1 overflow-y-auto py-stack-md flex flex-col gap-unit px-2">
<a class="flex items-center gap-stack-md px-4 py-3 bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container rounded-xl mx-2 scale-95 duration-100 font-label-md text-label-md" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
                Generator
            </a>
<a class="flex items-center gap-stack-md px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-xl mx-2 transition-all font-label-md text-label-md" href="#">
<span class="material-symbols-outlined">palette</span>
                Themes
            </a>
<a class="flex items-center gap-stack-md px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-xl mx-2 transition-all font-label-md text-label-md" href="#">
<span class="material-symbols-outlined">perm_media</span>
                Media Library
            </a>
<a class="flex items-center gap-stack-md px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-xl mx-2 transition-all font-label-md text-label-md" href="#">
<span class="material-symbols-outlined">description</span>
                Notes
            </a>
<a class="flex items-center gap-stack-md px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-xl mx-2 transition-all font-label-md text-label-md" href="#">
<span class="material-symbols-outlined">history</span>
                History
            </a>
</div>
<div class="p-gutter border-t border-outline-variant flex flex-col gap-stack-md">
<button class="w-full bg-surface text-primary border border-outline-variant hover:bg-surface-variant py-2 rounded-lg font-label-md transition-colors flex items-center justify-center gap-stack-sm">
<span class="material-symbols-outlined">file_download</span>
                Export Slides
            </button>
<div class="flex flex-col gap-unit px-2">
<a class="flex items-center gap-stack-md px-4 py-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-xl transition-all font-label-sm text-label-sm" href="#">
<span class="material-symbols-outlined text-[18px]">settings</span>
                    Settings
                </a>
<a class="flex items-center gap-stack-md px-4 py-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-xl transition-all font-label-sm text-label-sm" href="#">
<span class="material-symbols-outlined text-[18px]">help</span>
                    Support
                </a>
</div>
</div>
</aside>
<!-- Main Workspace Area -->
<main class="p-margin-mobile md:p-margin-desktop pb-32 flex flex-col xl:flex-row gap-gutter">
<!-- Left Column: Content Review -->
<div class="flex-1 flex flex-col gap-stack-lg max-w-3xl">
<div class="flex items-center justify-between border-b border-outline-variant pb-4">
<div>
<h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Review Content</h1>
<p class="text-body-md text-on-surface-variant mt-1">Review and edit the AI-generated questions before exporting.</p>
</div>
<div class="flex items-center gap-2 text-secondary bg-secondary/10 px-3 py-1 rounded-full text-label-sm font-label-sm">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
<span>All synced</span>
</div>
</div>
<!-- Question Cards List -->
<div class="flex flex-col gap-stack-md">
<!-- Card 1 -->
<div class="bg-surface rounded-xl border border-outline-variant p-gutter shadow-sm transition-shadow hover:shadow-md">
<div class="flex justify-between items-start mb-4">
<div class="flex gap-2">
<span class="bg-secondary/10 text-secondary px-2 py-1 rounded font-label-sm text-label-sm">Multiple Choice</span>
<span class="bg-surface-variant text-on-surface-variant px-2 py-1 rounded font-label-sm text-label-sm">Easy</span>
</div>
<div class="flex gap-2">
<button class="text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined">edit</span></button>
<button class="text-on-surface-variant hover:text-error transition-colors"><span class="material-symbols-outlined">delete</span></button>
</div>
</div>
<textarea class="w-full bg-transparent border-none text-body-lg font-body-lg text-on-surface focus:ring-0 p-0 mb-4 resize-none overflow-hidden" rows="2">What is the capital of France?</textarea>
<div class="flex flex-col gap-2">
<label class="flex items-center gap-3 p-3 rounded-lg border border-primary bg-primary/5 cursor-pointer">
<input checked="" class="text-primary focus:ring-primary w-4 h-4" name="q1" type="radio"/>
<span class="text-body-md text-on-surface">Paris</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-lg border border-outline-variant hover:bg-surface-variant cursor-pointer transition-colors">
<input class="text-primary focus:ring-primary w-4 h-4" name="q1" type="radio"/>
<span class="text-body-md text-on-surface">London</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-lg border border-outline-variant hover:bg-surface-variant cursor-pointer transition-colors">
<input class="text-primary focus:ring-primary w-4 h-4" name="q1" type="radio"/>
<span class="text-body-md text-on-surface">Berlin</span>
</label>
</div>
</div>
<!-- Card 2: True/False -->
<div class="bg-surface rounded-xl border border-outline-variant p-gutter shadow-sm transition-shadow hover:shadow-md">
<div class="flex justify-between items-start mb-4">
<div class="flex gap-2">
<span class="bg-tertiary-container/20 text-tertiary-container px-2 py-1 rounded font-label-sm text-label-sm">True/False</span>
<span class="bg-surface-variant text-on-surface-variant px-2 py-1 rounded font-label-sm text-label-sm">Medium</span>
</div>
<div class="flex gap-2">
<button class="text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined">edit</span></button>
<button class="text-on-surface-variant hover:text-error transition-colors"><span class="material-symbols-outlined">delete</span></button>
</div>
</div>
<textarea class="w-full bg-transparent border-none text-body-lg font-body-lg text-on-surface focus:ring-0 p-0 mb-4 resize-none overflow-hidden" rows="2">Water boils at 100 degrees Celsius at sea level.</textarea>
<div class="flex gap-4">
<label class="flex-1 flex items-center justify-center gap-3 p-3 rounded-lg border border-primary bg-primary/5 cursor-pointer">
<input checked="" class="text-primary focus:ring-primary w-4 h-4" name="q2" type="radio"/>
<span class="text-body-md font-label-md text-on-surface">True</span>
</label>
<label class="flex-1 flex items-center justify-center gap-3 p-3 rounded-lg border border-outline-variant hover:bg-surface-variant cursor-pointer transition-colors">
<input class="text-primary focus:ring-primary w-4 h-4" name="q2" type="radio"/>
<span class="text-body-md font-label-md text-on-surface">False</span>
</label>
</div>
</div>
<!-- Skeleton Loader for Generating Content -->
<div class="bg-surface rounded-xl border border-outline-variant p-gutter shadow-sm animate-pulse flex flex-col gap-4">
<div class="flex justify-between">
<div class="h-6 w-24 bg-surface-variant rounded"></div>
<div class="h-6 w-16 bg-surface-variant rounded"></div>
</div>
<div class="h-16 w-full bg-surface-variant rounded"></div>
<div class="h-12 w-full bg-surface-variant rounded"></div>
<div class="h-12 w-full bg-surface-variant rounded"></div>
</div>
</div>
<button class="w-full py-4 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 font-label-md">
<span class="material-symbols-outlined">add</span>
                Add Manual Question
            </button>
</div>
<!-- Right Column: Theme Selector & Settings -->
<aside class="w-full xl:w-80 flex flex-col gap-stack-lg shrink-0">
<div class="bg-surface rounded-xl border border-outline-variant p-gutter">
<h3 class="font-headline-md text-headline-md text-on-surface mb-4">Slide Theme</h3>
<div class="grid grid-cols-2 gap-stack-sm mb-6">
<!-- Theme: Neon Dark -->
<div class="flex flex-col gap-2 cursor-pointer group">
<div class="aspect-video rounded-lg border-2 border-transparent group-hover:border-primary-fixed-dim bg-inverse-surface overflow-hidden relative transition-all">
<div class="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-2 flex flex-col gap-1">
<div class="w-3/4 h-2 bg-[#0f3460] rounded"></div>
<div class="w-1/2 h-2 bg-[#e94560] rounded"></div>
</div>
</div>
<span class="text-label-sm font-label-sm text-center text-on-surface-variant">Neon Dark</span>
</div>
<!-- Theme: Academic Light (Active) -->
<div class="flex flex-col gap-2 cursor-pointer group">
<div class="aspect-video rounded-lg border-2 border-primary bg-surface-bright overflow-hidden relative shadow-sm transition-all">
<div class="absolute inset-0 p-2 flex flex-col gap-1 border-l-4 border-primary">
<div class="w-full h-2 bg-on-surface rounded"></div>
<div class="w-5/6 h-1 bg-outline-variant rounded mt-1"></div>
<div class="w-4/6 h-1 bg-outline-variant rounded"></div>
</div>
<div class="absolute top-1 right-1">
<span class="material-symbols-outlined text-[16px] text-primary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
</div>
<span class="text-label-sm font-label-sm text-center text-primary font-bold">Academic Light</span>
</div>
<!-- Theme: Chalkboard -->
<div class="flex flex-col gap-2 cursor-pointer group">
<div class="aspect-video rounded-lg border-2 border-outline-variant group-hover:border-primary-fixed-dim bg-[#2c3e50] overflow-hidden relative transition-all">
<div class="absolute inset-0 p-2 flex flex-col items-center justify-center gap-1 opacity-80">
<div class="w-3/4 h-1 border-b border-dashed border-white/50"></div>
<div class="w-1/2 h-1 border-b border-dashed border-white/50"></div>
</div>
</div>
<span class="text-label-sm font-label-sm text-center text-on-surface-variant">Chalkboard</span>
</div>
<!-- More Themes -->
<div class="flex flex-col gap-2 cursor-pointer group">
<div class="aspect-video rounded-lg border border-dashed border-outline-variant flex items-center justify-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-on-surface-variant">
<span class="material-symbols-outlined">grid_view</span>
</div>
<span class="text-label-sm font-label-sm text-center text-on-surface-variant">More...</span>
</div>
</div>
<div class="space-y-4 border-t border-outline-variant pt-4">
<h4 class="font-label-md text-label-md text-on-surface">Slide Layout Preferences</h4>
<label class="flex items-center gap-3">
<input checked="" class="rounded text-primary focus:ring-primary w-4 h-4 border-outline" type="checkbox"/>
<span class="text-body-md text-on-surface-variant">Include Title Slide</span>
</label>
<label class="flex items-center gap-3">
<input class="rounded text-primary focus:ring-primary w-4 h-4 border-outline" type="checkbox"/>
<span class="text-body-md text-on-surface-variant">Add Notes to Presenter View</span>
</label>
</div>
</div>
</aside>
</main>
<!-- Export Control (Bottom Bar) -->
<div class="fixed bottom-0 left-0 md:left-64 right-0 bg-surface border-t border-outline-variant p-4 flex justify-between items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
<div class="flex items-center gap-3 text-on-surface-variant">
<span class="material-symbols-outlined animate-spin" style="font-variation-settings: 'FILL' 1;">sync</span>
<span class="font-label-md text-label-md">Generating Slides (2/5)...</span>
</div>
<button class="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-8 py-3 rounded-lg shadow-sm transition-all flex items-center gap-2">
<span class="material-symbols-outlined">download</span>
            Download PPTX
        </button>
</div>
</body></html>