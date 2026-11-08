import React, { useState } from 'react';
import { SignInButton } from '@clerk/clerk-react';
import './Landing.css';
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronDown,
    FileText,
    Layers3,
    Play,
    Sparkles,
    WandSparkles,
} from 'lucide-react';

const examples = [
    {
        label: 'Question',
        source: 'Q.1: In a group of 60 students, 35 study Mathematics, 30 study Physics, and 25 study Chemistry. Also, 15 study Mathematics and Physics, 12 study Physics and Chemistry, and 10 study Mathematics and Chemistry. These pairwise counts include the 5 students who study all three subjects. How many students study exactly one subject?\n\nA) 26  B) 31  C) 36  D) 41',
        question: 'In a group of 60 students, 35 study Mathematics, 30 study Physics, and 25 study Chemistry. Also, 15 study Mathematics and Physics, 12 study Physics and Chemistry, and 10 study Mathematics and Chemistry. These pairwise counts include the 5 students who study all three subjects. How many study exactly one subject?',
        answers: ['26', '31', '36', '41'],
        eyebrow: 'Q.1',
    },
    {
        label: 'Shared passage',
        source: 'Study the chart below. Annual income and expenditure (in lakh rupees):\n\n2021: 80 / 64\n2022: 100 / 80\n2023: 120 / 90\n2024: 150 / 120\n2025: 180 / 144\n\nQ: In which year was profit as a percentage of expenditure highest?',
        context: 'Income and expenditure · ₹ lakh',
        question: 'In which year was profit as a percentage of expenditure highest?',
        answers: ['2022', '2023', '2024', '2025'],
        eyebrow: 'Q.24',
    },
    {
        label: 'With notation',
        source: 'Q.4: The value of (1 + i)², where i² = −1, is:\n\nA) 2  B) −2  C) 2i  D) 1 + 2i',
        question: 'The value of (1 + i)², where i² = −1, is:',
        answers: ['2', '−2', '2i', '1 + 2i'],
        eyebrow: 'Q.4',
    },
];

const faqs = [
    {
        question: 'What can I turn into slides?',
        answer: 'Paste question banks, quizzes, or lesson material. The generator organizes questions and answer choices into a consistent slide deck, including questions that share a passage or data set.',
    },
    {
        question: 'Can I review and edit the slides?',
        answer: 'Yes. Review the generated questions in the editor, make changes, and choose a visual theme before exporting.',
    },
    {
        question: 'How do I get started?',
        answer: 'Sign in, paste your content into the generator, review the formatted questions, and export when the deck is ready.',
    },
];

export default function Landing() {
    const [activeExample, setActiveExample] = useState(0);
    const example = examples[activeExample];
    const changeExample = (offset) => {
        setActiveExample((current) => (current + offset + examples.length) % examples.length);
    };

    return (
        <div className="landing-page">
            <main>
                <section className="lp-hero">
                    <div className="lp-wrap lp-hero-grid">
                        <div className="lp-copy">
                            <div className="lp-kicker"><Sparkles size={14} aria-hidden="true" /> Question banks, beautifully organized</div>
                            <h1 className="lp-title">From raw questions to <em>classroom-ready</em> slides.</h1>
                            <p className="lp-lede">Turn a pasted question bank into a clear, consistent slide deck. Review the formatting, make edits, and export when it’s ready to teach.</p>
                            <div className="lp-actions">
                                <SignInButton mode="modal">
                                    <button className="lp-btn lp-btn-primary" type="button">Create your first deck <ArrowRight size={17} aria-hidden="true" /></button>
                                </SignInButton>
                                <a className="lp-btn lp-btn-quiet" href="#how-it-works"><Play size={15} aria-hidden="true" /> See how it works</a>
                            </div>
                            <div className="lp-note"><Check size={14} aria-hidden="true" /> Free to use after signing in</div>
                            <div className="lp-trustline" aria-label="Supported content types">
                                <span><Check size={14} aria-hidden="true" /> Multiple choice</span>
                                <span><Check size={14} aria-hidden="true" /> Shared passages</span>
                                <span><Check size={14} aria-hidden="true" /> Math notation</span>
                            </div>
                        </div>

                        <div className="lp-demo" aria-label="Interactive slide formatting preview">
                            <div className="lp-windowbar" aria-hidden="true">
                                <i className="lp-dot" /><i className="lp-dot" /><i className="lp-dot" />
                                <span className="lp-windowlabel">Your content → a clean slide</span>
                            </div>
                            <div className="lp-demo-grid">
                                <div className="lp-source">
                                    <div className="lp-source-head"><FileText size={14} aria-hidden="true" /> Pasted content</div>
                                    <div className="lp-source-text" aria-live="polite">{example.source}</div>
                                </div>
                                <div className="lp-slide" aria-live="polite">
                                    <div className="lp-slide-top"><span>{example.eyebrow}</span><i className="lp-slide-rule" /></div>
                                    {example.context && <div className="lp-context">{example.context}<br />2021&nbsp;&nbsp; 80 / 64 &nbsp; · &nbsp; 2022&nbsp;&nbsp; 100 / 80 &nbsp; · &nbsp; 2023&nbsp;&nbsp; 120 / 90 &nbsp; · &nbsp; 2024&nbsp;&nbsp; 150 / 120 &nbsp; · &nbsp; 2025&nbsp;&nbsp; 180 / 144</div>}
                                    <h2 className="lp-question">{example.question}</h2>
                                    <div className="lp-answers">
                                        {example.answers.map((answer, index) => (
                                            <div className="lp-answer" key={`${answer}-${index}`}>
                                                <span className="lp-answer-letter">{String.fromCharCode(65 + index)}</span>{answer}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="lp-demo-controls">
                                <div className="lp-tabs" role="group" aria-label="Choose a question preview">
                                    {examples.map((item, index) => (
                                        <button className="lp-tab" type="button" key={item.label} aria-pressed={activeExample === index} onClick={() => setActiveExample(index)}>{item.label}</button>
                                    ))}
                                </div>
                                <div className="lp-arrows">
                                    <button className="lp-icon-btn" type="button" aria-label="Previous example" onClick={() => changeExample(-1)}><ArrowLeft size={15} /></button>
                                    <button className="lp-icon-btn" type="button" aria-label="Next example" onClick={() => changeExample(1)}><ArrowRight size={15} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="lp-section" id="how-it-works">
                    <div className="lp-wrap">
                        <div className="lp-section-head">
                            <div className="lp-eyebrow">A simpler way to build a deck</div>
                            <h2 className="lp-h2">Spend less time formatting.</h2>
                            <p className="lp-section-copy">Keep your attention on the material. SlideGen takes care of turning the raw text into a presentation you can review.</p>
                        </div>
                        <div className="lp-steps">
                            <article className="lp-step"><div className="lp-step-num">01</div><h3>Paste your material</h3><p>Bring a question list, a quiz, or a longer set with shared instructions and reference information.</p></article>
                            <article className="lp-step"><div className="lp-step-num">02</div><h3>Review the slides</h3><p>Questions and answer choices are organized into individual slides. Check the result and adjust the content in the editor.</p></article>
                            <article className="lp-step"><div className="lp-step-num">03</div><h3>Choose a theme and export</h3><p>Pick a visual style and export your deck for presenting or sharing with learners.</p></article>
                        </div>
                    </div>
                </section>

                <section className="lp-section lp-section-soft" id="features">
                    <div className="lp-wrap">
                        <div className="lp-section-head">
                            <div className="lp-eyebrow">Made for real question sets</div>
                            <h2 className="lp-h2">Details stay readable.</h2>
                            <p className="lp-section-copy">From a short quiz to questions that depend on the same passage, the deck is laid out to be easy to present.</p>
                        </div>
                        <div className="lp-features">
                            <article className="lp-feature"><div className="lp-feature-icon"><Layers3 size={18} /></div><h3>Consistent layout</h3><p>Keep question numbers, prompts, and choices aligned from slide to slide.</p></article>
                            <article className="lp-feature"><div className="lp-feature-icon"><FileText size={18} /></div><h3>Shared context</h3><p>Keep a common passage or data reference with the questions that use it.</p></article>
                            <article className="lp-feature"><div className="lp-feature-icon"><WandSparkles size={18} /></div><h3>Editable output</h3><p>Review and refine generated content before you export the final deck.</p></article>
                            <article className="lp-feature"><div className="lp-feature-icon"><Sparkles size={18} /></div><h3>Math-friendly text</h3><p>Preserve familiar symbols and notation in questions and answer choices.</p></article>
                        </div>
                        <div className="lp-export-band">
                            <div className="lp-export-copy"><div className="lp-feature-icon"><ArrowDown size={18} /></div><div><strong>Ready for your next lesson</strong><span>Generate, review, and export your presentation from one workspace.</span></div></div>
                            <SignInButton mode="modal"><button className="lp-btn lp-btn-primary" type="button">Start creating <ArrowRight size={16} /></button></SignInButton>
                        </div>
                    </div>
                </section>

                <section className="lp-section" id="faq">
                    <div className="lp-wrap">
                        <div className="lp-section-head">
                            <div className="lp-eyebrow">Questions, answered</div>
                            <h2 className="lp-h2">Good to know.</h2>
                        </div>
                        <div className="lp-faq">
                            {faqs.map((faq) => (
                                <details key={faq.question}>
                                    <summary>{faq.question}<ChevronDown size={18} aria-hidden="true" /></summary>
                                    <p>{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="lp-wrap" style={{ paddingBottom: 34 }}>
                    <div className="lp-cta">
                        <div className="lp-cta-inner">
                            <div className="lp-eyebrow">Your next deck starts here</div>
                            <h2 className="lp-h2">Bring your questions. We’ll help with the slides.</h2>
                            <p>Sign in to turn your raw material into a clear, editable presentation, ready for a final review.</p>
                            <SignInButton mode="modal"><button className="lp-btn lp-btn-primary" type="button">Create a presentation <ArrowRight size={16} /></button></SignInButton>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="lp-footer">
                <div className="lp-wrap lp-footer-inner">
                    <div className="lp-brand"><Sparkles size={17} aria-hidden="true" /> SlideGen Pro</div>
                    <span>Make more room for teaching.</span>
                </div>
            </footer>
        </div>
    );
}
