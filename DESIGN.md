---
name: Slide Generator Pro
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for **Slide Generator Pro**, a productivity-focused SaaS platform for educators. The brand personality is rooted in **Reliability, Efficiency, and Clarity**. It aims to evoke a sense of professional competence and calm, reducing the "decision fatigue" often experienced by time-poor teachers.

The design style follows a **Corporate Modern** aesthetic with a heavy emphasis on **Minimalism**. It utilizes generous whitespace to separate complex educational content, high-fidelity iconography for quick scanning, and a systematic approach to density that allows for high information throughput without overwhelming the user. The interface is purposefully "quiet" to let the educator's content remain the focal point.

## Colors
The palette is built on a foundation of professional trust. 
- **Primary Blue (#2563EB)**: Used for high-priority actions like "Generate Slides" or "Export." It signals stability and function.
- **Secondary Teal (#0D9488)**: Used for secondary paths, success states, and lesson-planning accents. It provides a calming counterpoint to the primary blue.
- **Neutral Grays**: A sophisticated slate ramp used for borders, secondary text, and surfaces to maintain a clean, airy feel.

The **Light Mode** (Default) utilizes a "Paper White" background with light gray strokes (#E2E8F0) to define sections. The **Dark Mode** (Premium) shifts to a deep navy foundation (#0F172A) with increased contrast for text to ensure legibility during late-night grading sessions.

## Typography
The typography system uses a pairing of **Geist** for headings and UI labels to provide a technical, precise feel, and **Inter** for body copy to ensure maximum readability for educational content. 

The hierarchy is strictly enforced to aid "scanning." Educators should be able to identify the slide title, main points, and speaker notes instantly through clear weight and size distinctions. For mobile devices, display and large headline sizes are aggressively scaled down to maintain layout integrity without sacrificing the "clean" aesthetic.

## Layout & Spacing
This design system utilizes a **Fixed Grid** for desktop views (max-width 1280px) to ensure the slide editing interface remains centered and balanced. A 12-column system is used for dashboard layouts, while the editor uses a specialized three-pane layout (Navigation | Canvas | Properties).

**Spacing Rhythm:**
- **Desktop:** 40px outer margins with 24px gutters.
- **Tablet:** 24px margins, fluid columns.
- **Mobile:** 16px margins, single-column stack.

Whitespace is used as a functional tool to group related controls (e.g., slide settings) and separate distinct tasks (e.g., slide list vs. current slide edit).

## Elevation & Depth
To maintain a high-fidelity, professional appearance, depth is conveyed through **Tonal Layers** and **Ambient Shadows**. 

1.  **Level 0 (Base):** The main background.
2.  **Level 1 (Card):** Used for slide thumbnails and content blocks. These use a 1px neutral-200 border and no shadow to keep the UI flat and fast.
3.  **Level 2 (Active/Floating):** Used for active toolbars and dropdown menus. These feature an extra-diffused, low-opacity shadow (`y: 4px, blur: 20px, color: rgba(0,0,0,0.05)`) to suggest they sit above the workspace.
4.  **Level 3 (Modals):** High-contrast overlays with a background blur (12px) on the underlying content to focus the educator's attention on the task at hand.

## Shapes
The design system uses a **Soft (1)** roundedness profile (0.25rem/4px). This choice reflects a professional and modern sensibility that is more approachable than sharp corners but more serious than highly rounded "bubbly" designs.

- **Standard Elements:** 4px radius (Buttons, Input fields, Chips).
- **Large Elements:** 8px radius (Cards, Modals).
- **Interactive States:** Subtle 1px borders are paired with these radii to define the interactive hit-boxes clearly.

## Components
- **Buttons:** Primary buttons use the Primary Blue with white text. Secondary buttons use a subtle ghost style with a Slate-200 border. Transitions must be instant (150ms) to reinforce the "fast" brand promise.
- **Chips/Badges:** Used for "Question Types" (e.g., Multiple Choice, True/False). These use the Secondary Teal with 10% opacity backgrounds to remain visible but not distracting.
- **Inputs:** Clean, outlined fields with Inter-Regular text. Active states use a 2px Primary Blue focus ring with a 2px offset.
- **Cards (Slide Thumbnails):** A 16:9 aspect ratio container with a subtle border. When selected, the border thickens and changes to Primary Blue.
- **Distraction-Free Editor:** A "Zen Mode" toggle that collapses all sidebars, leaving only the slide canvas and a floating minimal toolbar.
- **Status Indicators:** Small, circular dots for "Synced" (Green) or "Saving" (Amber) status, positioned in the top-right utility bar.