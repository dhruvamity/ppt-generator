export const THEMES = {
    'modern-neon': {
        name: 'Cyberpunk Neon', isDefault: true, bgColor: '110F1A', cyan: '00C6D4', purple: '7E32C6',
        gold: 'C4961A', magenta: 'CC00FF', watermark: '2B2043', tealDecor: '00C6D4', 
        bgCard: '110F1A', textWhite: 'FFFFFF', textBlack: '000000', decorPurple: '7E32C6'
    },
    'signal-studio': {
        name: 'Signal Studio', teaching: true, illustration: 'signal', description: 'A bright, contemporary data-inspired look with quiet graph details at the edge.',
        bgColor: 'F4F8FB', textWhite: '1B2B3B', textBlack: 'F4F8FB', cyan: '147D92',
        purple: '147D92', gold: '147D92', bgCard: 'F4F8FB', rule: 'D7E4EA'
    },
    'orbit-lab': {
        name: 'Orbit Lab', teaching: true, illustration: 'orbit', description: 'A deep space palette with subtle orbital line art around the solving area.',
        bgColor: '11172B', textWhite: 'F4F6FD', textBlack: '11172B', cyan: '78D6F2',
        purple: '78D6F2', gold: '78D6F2', bgCard: '11172B', rule: '303B57'
    },
    'prism-flow': {
        name: 'Prism Flow', teaching: true, illustration: 'prism', description: 'Soft violet and aqua gradients add energy while keeping equations easy to read.',
        bgColor: 'FBF9FF', textWhite: '2C2940', textBlack: 'FBF9FF', cyan: '7056C7',
        purple: '7056C7', gold: '7056C7', bgCard: 'FBF9FF', rule: 'E6E0F0'
    },
    'lecture-paper': {
        name: 'Lecture Paper', teaching: true, description: 'Crisp white paper with a quiet blue accent.',
        bgColor: 'FFFFFF', textWhite: '172B4D', textBlack: 'FFFFFF', cyan: '215DB0',
        purple: '215DB0', gold: '215DB0', bgCard: 'FFFFFF', rule: 'DCE4EE'
    },
    'chalk-study': {
        name: 'Chalk Study', teaching: true, description: 'A calm green board for step-by-step teaching.',
        bgColor: '153A34', textWhite: 'F4F8EF', textBlack: '153A34', cyan: 'BCE3CD',
        purple: 'BCE3CD', gold: 'BCE3CD', bgCard: '153A34', rule: '386056'
    },
    'ivory-notes': {
        name: 'Ivory Notes', teaching: true, description: 'Warm paper tones for extended practice sessions.',
        bgColor: 'FAF6EC', textWhite: '302D29', textBlack: 'FAF6EC', cyan: '86502E',
        purple: '86502E', gold: '86502E', bgCard: 'FAF6EC', rule: 'DED6C7'
    },
    'midnight-focus': {
        name: 'Midnight Focus', teaching: true, description: 'High-contrast navy with room for working.',
        bgColor: '132034', textWhite: 'F2F5FA', textBlack: '132034', cyan: 'A9C9F2',
        purple: 'A9C9F2', gold: 'A9C9F2', bgCard: '132034', rule: '34465E'
    },
    'graph-paper': {
        name: 'Graph Paper', teaching: true, illustration: 'grid', description: 'Squared paper with a plotted parabola and straight line in the margin. The working area stays plain.',
        bgColor: 'F7FAFD', textWhite: '1C2A3A', textBlack: 'F7FAFD', cyan: '2B5FB3',
        purple: '2B5FB3', gold: '2B5FB3', bgCard: 'F7FAFD', rule: 'D3DFEC'
    },
    'geometry-set': {
        name: 'Geometry Set', teaching: true, illustration: 'geometry', description: 'A circle theorem, protractor and labelled triangle on warm paper, kept clear of the question.',
        bgColor: 'FFFCF7', textWhite: '2B2521', textBlack: 'FFFCF7', cyan: 'B8532A',
        purple: 'B8532A', gold: '6B7F8F', bgCard: 'FFFCF7', rule: 'EBDFD0'
    },
    'formula-board': {
        name: 'Formula Board', teaching: true, illustration: 'formula', description: 'A dark slate board with faint sigma, integral and pi notation beside bright amber headings.',
        bgColor: '1B2130', textWhite: 'F4F1EA', textBlack: '1B2130', cyan: 'F2B75C',
        purple: 'F2B75C', gold: '8FA6C9', bgCard: '1B2130', rule: '3A4457'
    },
    'number-line': {
        name: 'Number Line', teaching: true, illustration: 'numberline', description: 'A labelled integer line with jump arcs. Suited to integers, fractions and early algebra.',
        bgColor: 'F4F8F5', textWhite: '1E2B25', textBlack: 'F4F8F5', cyan: '2E7D5B',
        purple: '2E7D5B', gold: 'D9822B', bgCard: 'F4F8F5', rule: 'D2E1D7'
    },
    'fraction-tiles': {
        name: 'Fraction Tiles', teaching: true, illustration: 'fractions', description: 'Equivalent-fraction bars, a quartered circle and counters for visual learners.',
        bgColor: 'FFFDF8', textWhite: '24303B', textBlack: 'FFFDF8', cyan: '3B6FD4',
        purple: '3B6FD4', gold: 'F2A541', bgCard: 'FFFDF8', rule: 'E5E3DC'
    },
    'trig-wave': {
        name: 'Trig Wave', teaching: true, illustration: 'wave', description: 'A unit circle and flowing sine and cosine curves on deep teal for trigonometry and functions.',
        bgColor: '0F2A2C', textWhite: 'ECF7F5', textBlack: '0F2A2C', cyan: '7FE3C8',
        purple: '7FE3C8', gold: 'F7C873', bgCard: '0F2A2C', rule: '2C4A4B'
    },
    'venn-logic': {
        name: 'Venn Logic', teaching: true, illustration: 'venn', description: 'Three-set Venn, a truth table and logic symbols in the margin. For LR and reasoning sets.',
        bgColor: 'F5F3FF', textWhite: '1E1B4B', textBlack: 'F5F3FF', cyan: '6D28D9',
        purple: '6D28D9', gold: 'F59E0B', bgCard: 'F5F3FF', rule: 'DDD6FE'
    },
    'di-charts': {
        name: 'DI Charts', teaching: true, illustration: 'bars', description: 'Bar, line and pie charts with a small data table. Built for data interpretation caselets.',
        bgColor: 'FFFFFF', textWhite: '0F2D36', textBlack: 'FFFFFF', cyan: '0E7490',
        purple: '0E7490', gold: 'F97316', bgCard: 'FFFFFF', rule: 'CFE3E8'
    },
    'factor-tree': {
        name: 'Factor Tree', teaching: true, illustration: 'factortree', description: 'A factor tree, division ladder and the first primes on dark slate. For number systems.',
        bgColor: '0F172A', textWhite: 'F1F5F9', textBlack: '0F172A', cyan: '34D399',
        purple: '34D399', gold: 'FBBF24', bgCard: '0F172A', rule: '2D3A52'
    },
    'probability-dice': {
        name: 'Probability Dice', teaching: true, illustration: 'dice', description: 'Dice, a coin, a card, a spinner and a probability tree on warm paper.',
        bgColor: 'FFF7ED', textWhite: '3B2515', textBlack: 'FFF7ED', cyan: 'C2410C',
        purple: 'C2410C', gold: '1D4ED8', bgCard: 'FFF7ED', rule: 'F3DCC6'
    },
    'percent-profit': {
        name: 'Percent & Profit', teaching: true, illustration: 'percent', description: 'A big percent sign, ratio bar, discount tag and growth curve. For arithmetic drills.',
        bgColor: 'F0FDF4', textWhite: '14301F', textBlack: 'F0FDF4', cyan: '15803D',
        purple: '15803D', gold: 'DC2626', bgCard: 'F0FDF4', rule: 'CDE9D6'
    },
    'mensuration-solids': {
        name: 'Mensuration Solids', teaching: true, illustration: 'solids', description: 'Wireframe cuboid, cylinder, cone and sphere with their volume formulas.',
        bgColor: '1E1B4B', textWhite: 'EEF2FF', textBlack: '1E1B4B', cyan: '93C5FD',
        purple: '93C5FD', gold: 'FCD34D', bgCard: '1E1B4B', rule: '3B3A6E'
    },
    'speed-track': {
        name: 'Speed Track', teaching: true, illustration: 'speed', description: 'Stopwatch, running track, speedometer and a train line for time, speed and distance.',
        bgColor: 'FFFBEB', textWhite: '2A1F0A', textBlack: 'FFFBEB', cyan: 'B45309',
        purple: 'B45309', gold: '1F2937', bgCard: 'FFFBEB', rule: 'F1E3BE'
    },
    'chalkboard-frame': {
        name: 'Chalkboard Frame', teaching: true, design: 'chalkboard', description: 'A green board inside a wooden frame with a chalk tray. Questions sit in the clear centre.',
        bgColor: '2F5D50', textWhite: 'F7F3E8', textBlack: '2F5D50', cyan: 'FFE08A', purple: 'FFE08A', gold: 'FFE08A', bgCard: '2F5D50', rule: '4C7A6C'
    },
    'spiral-notebook': {
        name: 'Spiral Notebook', teaching: true, design: 'spiral', description: 'Spiral binding and a red margin on the left. Clean white page for the working.',
        bgColor: 'FFFFFF', textWhite: '1F2933', textBlack: 'FFFFFF', cyan: '2B6CB0', purple: '2B6CB0', gold: '2B6CB0', bgCard: 'FFFFFF', rule: 'DCE3EC'
    },
    'index-card': {
        name: 'Index Card', teaching: true, design: 'indexcard', description: 'A tabbed revision card with a paper clip on a slate desk. Great for formula recall.',
        bgColor: '3E5C76', textWhite: '1D1D1D', textBlack: 'FFFFFF', cyan: 'C0392B', purple: 'C0392B', gold: 'C0392B', bgCard: 'FFFDF7', rule: 'E6DFD0'
    },
    'omr-sheet': {
        name: 'OMR Sheet', teaching: true, design: 'omr', description: 'Answer-sheet bubbles down the right edge and a barcode header. Built for exam-style MCQs.',
        bgColor: 'FBFBF8', textWhite: '1A1A1A', textBlack: 'FFFFFF', cyan: 'D32F2F', purple: 'D32F2F', gold: 'D32F2F', bgCard: 'FBFBF8', rule: 'C7CED8'
    },
    'quant-clock': {
        name: 'Quant Clock', teaching: true, design: 'quantclock', description: 'The question number sits inside a stopwatch dial with a progress bar. Made for timed CAT drills.',
        bgColor: '14213D', textWhite: 'F4F6FB', textBlack: '14213D', cyan: 'FCA311', purple: 'FCA311', gold: 'FCA311', bgCard: '14213D', rule: '2C3E66'
    },
    'data-deck': {
        name: 'Data Deck', teaching: true, design: 'datadeck', description: 'Bar chart base and a doughnut corner for data interpretation sets.',
        bgColor: 'FFFFFF', textWhite: '1B2A41', textBlack: 'FFFFFF', cyan: '0F766E', purple: '0F766E', gold: 'F59E0B', bgCard: 'FFFFFF', rule: 'D9E2EC'
    },
    'abacus-rail': {
        name: 'Abacus Rail', teaching: true, design: 'abacus', description: 'A terracotta band of abacus beads across the top. Warm paper below for arithmetic.',
        bgColor: 'FDF6E3', textWhite: '3B2F2F', textBlack: 'FFF4E6', cyan: 'C8553D', purple: 'C8553D', gold: 'C8553D', bgCard: 'FDF6E3', rule: 'E8D9BF'
    },
    'tangram-corner': {
        name: 'Tangram Corner', teaching: true, design: 'tangram', description: 'Seven bright tangram pieces tucked in the corner of a dark slide.',
        bgColor: '101418', textWhite: 'F5F7FA', textBlack: '101418', cyan: 'F4A261', purple: 'F4A261', gold: 'F4A261', bgCard: '101418', rule: '2A3038'
    },
    'ticket-stub': {
        name: 'Ticket Stub', teaching: true, design: 'ticket', description: 'A perforated red stub holds the question number sideways, like an exam entry pass.',
        bgColor: 'FFF8E7', textWhite: '1D1D1D', textBlack: 'FFF8E7', cyan: 'E63946', purple: 'E63946', gold: 'E63946', bgCard: 'FFF8E7', rule: 'E8DCC5'
    },
    'night-drill': {
        name: 'Night Drill', teaching: true, design: 'nightdrill', description: 'Black with an acid-yellow band and a huge sideways question number. For speed rounds.',
        bgColor: '0B0B0F', textWhite: 'F2F2F2', textBlack: '0B0B0F', cyan: 'D7FF3F', purple: 'D7FF3F', gold: 'D7FF3F', bgCard: '0B0B0F', rule: '2A2A33'
    },
    'sudoku-grid': {
        name: 'Sudoku Grid', teaching: true, design: 'sudoku', description: 'A part-filled sudoku in the corner for logic and reasoning sessions.',
        bgColor: 'F6F7FB', textWhite: '1E1B2E', textBlack: 'FFFFFF', cyan: '5B21B6', purple: '5B21B6', gold: '5B21B6', bgCard: 'F6F7FB', rule: 'D9DCE6'
    },
    'blueprint': {
        name: 'Blueprint Architect', bgColor: '0B192C', cyan: '00FFCC', orange: 'FF6B00',
        textWhite: 'FFFFFF', textBlack: '000000', bgCard: '0B192C'
    },
    'aurora': {
        name: 'Aurora Glassmorphism', bgColor: '09090B', blueOrb: '3B82F6', pinkOrb: 'EC4899', 
        dot: '27272A', textWhite: 'FFFFFF', textBlack: '000000', bgCard: '09090B'
    },
    'neobrutalism': {
        name: 'Neo-Brutalism', bgColor: 'FAFAFA', acidGreen: 'BAFF29', pink: 'FF3366', 
        black: '000000', textWhite: 'FAFAFA', textBlack: '000000', bgCard: 'FAFAFA'
    },
    'dark-neon': {
        name: 'Dark Neon', bgColor: '05050F', cyan: '00E5FF', purple: '7C3AED',
        gold: 'FFD700', tealDecor: '008080', bgCard: '0A0A1F', textWhite: 'FFFFFF',
        textBlack: '000000', decorPurple: '7C3AED'
    },
    'clean-light': {
        name: 'Clean Light', bgColor: 'F8F9FF', cyan: '2563EB', purple: '0D9488',
        gold: 'F59E0B', tealDecor: '86F2E4', bgCard: 'FFFFFF', textWhite: '0B1C30',
        textBlack: 'FFFFFF', decorPurple: '0D9488'
    },
    'minimalist-blue': {
        name: 'Minimalist Blue', bgColor: '0F172A', cyan: '38BDF8', purple: '818CF8',
        gold: '94A3B8', tealDecor: '1E293B', bgCard: '1E293B', textWhite: 'F8FAFC',
        textBlack: '0F172A', decorPurple: '818CF8'
    },
    'retro-terminal': {
        name: 'Retro Terminal', bgColor: '001A00', cyan: '00FF00', purple: '008800',
        gold: '00FF44', tealDecor: '003300', bgCard: '002200', textWhite: '00FF00',
        textBlack: '000000', decorPurple: '005500'
    },
    'academic-classic': {
        name: 'Academic Classic', bgColor: 'FDFBF7', cyan: '800020', purple: '002147',
        gold: 'D4AF37', tealDecor: 'E8E3D2', bgCard: 'FFFFFF', textWhite: '2C2C2C',
        textBlack: 'FFFFFF', decorPurple: '002147'
    },
    'sunset-orange': {
        name: 'Sunset Orange', bgColor: '1A1A1A', cyan: 'FF4500', purple: 'FF8C00',
        gold: 'FFD700', tealDecor: '2D2D2D', bgCard: '242424', textWhite: 'F5F5F5',
        textBlack: '000000', decorPurple: '4A2511'
    }
};
