import os
import re
import json
from io import BytesIO
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from lxml import etree
import latex2mathml.converter
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from google import genai
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = FastAPI(title="SlideGen Pro Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

THEMES = {
    'dark-neon': {
        'bgColor': '05050F', 'cyan': '00E5FF', 'purple': '7C3AED',
        'gold': 'FFD700', 'tealDecor': '008080', 'bgCard': '0A0A1F', 'textWhite': 'FFFFFF',
        'textBlack': '000000', 'decorPurple': '7C3AED'
    },
    'clean-light': {
        'bgColor': 'F8F9FF', 'cyan': '2563EB', 'purple': '0D9488',
        'gold': 'F59E0B', 'tealDecor': '86F2E4', 'bgCard': 'FFFFFF', 'textWhite': '0B1C30',
        'textBlack': 'FFFFFF', 'decorPurple': '0D9488'
    },
    'minimalist-blue': {
        'bgColor': '0F172A', 'cyan': '38BDF8', 'purple': '818CF8',
        'gold': '94A3B8', 'tealDecor': '1E293B', 'bgCard': '1E293B', 'textWhite': 'F8FAFC',
        'textBlack': '0F172A', 'decorPurple': '818CF8'
    },
    'retro-terminal': {
        'bgColor': '001A00', 'cyan': '00FF00', 'purple': '008800',
        'gold': '00FF44', 'tealDecor': '003300', 'bgCard': '002200', 'textWhite': '00FF00',
        'textBlack': '000000', 'decorPurple': '005500'
    },
    'academic-classic': {
        'bgColor': 'FDFBF7', 'cyan': '800020', 'purple': '002147',
        'gold': 'D4AF37', 'tealDecor': 'E8E3D2', 'bgCard': 'FFFFFF', 'textWhite': '2C2C2C',
        'textBlack': 'FFFFFF', 'decorPurple': '002147'
    },
    'sunset-orange': {
        'bgColor': '1A1A1A', 'cyan': 'FF4500', 'purple': 'FF8C00',
        'gold': 'FFD700', 'tealDecor': '2D2D2D', 'bgCard': '242424', 'textWhite': 'F5F5F5',
        'textBlack': '000000', 'decorPurple': '4A2511'
    }
}

class Config(BaseModel):
    mainTitle1: str
    mainTitle2: str
    pill1: str
    pill2: str
    footer: str

class Option(BaseModel):
    label: str
    text: str

class SlideData(BaseModel):
    badge: str
    tag: str
    qText: str
    options: List[Option]

class GenerateRequest(BaseModel):
    config: Config
    activeSlides: List[SlideData]
    themeId: str
    layoutId: str

class AIParsingRequest(BaseModel):
    rawText: str

# Load the XSLT transformer once
XSLT_PATH = os.path.join(os.path.dirname(__file__), 'MML2OMML.XSL')
try:
    xslt_doc = etree.parse(XSLT_PATH)
    xslt_transformer = etree.XSLT(xslt_doc)
except Exception as e:
    print(f"Warning: Could not load {XSLT_PATH}: {e}")
    xslt_transformer = None

def hex_to_rgb(hex_str: str) -> RGBColor:
    hex_str = hex_str.lstrip('#')
    return RGBColor(int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16))

def inject_omml_math(paragraph, latex_str: str):
    """Converts latex_str to OMML and appends it to the python-pptx paragraph."""
    if not xslt_transformer:
        run = paragraph.add_run()
        run.text = latex_str
        return
        
    try:
        mathml = latex2mathml.converter.convert(latex_str)
        mathml_doc = etree.fromstring(mathml.encode('utf-8'))
        omml_doc = xslt_transformer(mathml_doc)
        omml_root = omml_doc.getroot()
        
        # Inject the transformed OMML directly into the paragraph's underlying XML
        paragraph._p.append(omml_root)
    except Exception as e:
        print(f"OMML Injection failed for '{latex_str}': {e}")
        run = paragraph.add_run()
        run.text = latex_str

def add_mixed_content(slide, text: str, start_x: float, start_y: float, width: float, color: str, font_size: int = 14) -> float:
    """Adds a text box, parsing out $...$ or $$...$$ as native OMML math."""
    if not text:
        return start_y
        
    theme_color = hex_to_rgb(color)
    
    # Calculate approximate height
    chars_per_line = int(width / 0.09)
    lines = 0
    for line in text.split('\n'):
        lines += max(1, len(line) // chars_per_line)
    
    # 1.5 line spacing multiplier approximate
    text_height = max(0.2, lines * (font_size * 0.018 * 1.5))
    
    txBox = slide.shapes.add_textbox(Inches(start_x), Inches(start_y), Inches(width), Inches(text_height))
    tf = txBox.text_frame
    tf.margin_top = 0
    tf.margin_left = 0
    tf.margin_bottom = 0
    tf.margin_right = 0
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.line_spacing = 1.5
    
    # Split text by $...$ or $$...$$
    # This regex captures both inline and block math and keeps the delimiters
    parts = re.split(r'(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)', text)
    
    for part in parts:
        if not part:
            continue
        if part.startswith('$$') and part.endswith('$$'):
            inject_omml_math(p, part[2:-2])
        elif part.startswith('$') and part.endswith('$'):
            inject_omml_math(p, part[1:-1])
        else:
            run = p.add_run()
            run.text = part
            run.font.name = 'Arial'
            run.font.size = Pt(font_size)
            run.font.color.rgb = theme_color

    return start_y + text_height + 0.05

def add_rect(slide, x, y, w, h, color):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = hex_to_rgb(color)
    shape.line.fill.background()
    return shape

def add_round_rect(slide, x, y, w, h, color, border_color=None):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = hex_to_rgb(color)
    if border_color:
        shape.line.color.rgb = hex_to_rgb(border_color)
        shape.line.width = Pt(1)
    else:
        shape.line.fill.background()
    # Adjust corner radius slightly if possible (python-pptx uses adjustments)
    try:
        shape.adjustments[0] = 0.2
    except:
        pass
    return shape

def add_ellipse(slide, x, y, w, h, color, transparency=0.8):
    shape = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x), Inches(y), Inches(w), Inches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = hex_to_rgb(color)
    shape.line.fill.background()
    # Transparency requires direct oxml manipulation in python-pptx, skipping for simplicity or basic implementation
    return shape

def add_text_basic(slide, text, x, y, w, h, color, font_size, bold=False, align=PP_ALIGN.LEFT, font_name='Arial'):
    txBox = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = txBox.text_frame
    tf.margin_top = 0
    tf.margin_left = 0
    tf.margin_bottom = 0
    tf.margin_right = 0
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.name = font_name
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.color.rgb = hex_to_rgb(color)
    return txBox

def render_global_decorations(slide, theme):
    # Ellipses (transparency is hard in raw python-pptx without deep oxml, we'll draw them as light versions)
    # Bottom ribbon
    add_rect(slide, 0, 5.5, 10, 0.125, theme['gold'])
    # Logo
    add_text_basic(slide, "SLIDEGEN PRO", 0.3, 5.2, 3.0, 0.25, theme['cyan'], 10, bold=True)

def build_modern_sidebar_title(slide, config, theme):
    render_global_decorations(slide, theme)
    add_rect(slide, 0, 0, 0.05, 5.625, theme['cyan'])
    add_rect(slide, 0.05, 0, 0.05, 5.625, theme['purple'])
    
    # Title
    add_text_basic(slide, f"{config.mainTitle1} {config.mainTitle2}", 1.2, 1.5, 8, 1.5, theme['cyan'], 54, bold=True)
    
    add_rect(slide, 1.2, 3.0, 6.5, 0.04, theme['gold'])
    
    add_round_rect(slide, 1.2, 3.4, 2.8, 0.5, theme['cyan'])
    add_text_basic(slide, config.pill1, 1.2, 3.4, 2.8, 0.5, theme['textBlack'], 16, bold=True, align=PP_ALIGN.CENTER)
    
    add_round_rect(slide, 4.4, 3.4, 2.8, 0.5, theme['bgColor'], border_color=theme['purple'])
    add_text_basic(slide, config.pill2, 4.4, 3.4, 2.8, 0.5, theme['purple'], 16, bold=True, align=PP_ALIGN.CENTER)
    
    add_text_basic(slide, config.footer, 1.2, 4.2, 8, 0.5, theme['textWhite'], 16)

def build_classic_header_title(slide, config, theme):
    render_global_decorations(slide, theme)
    add_rect(slide, 0, 0, 10, 2, theme['purple'])
    add_rect(slide, 0, 1.9, 10, 0.1, theme['gold'])
    
    add_text_basic(slide, f"{config.mainTitle1} {config.mainTitle2}", 0.5, 0.3, 9, 1.2, theme['textBlack'], 45, bold=True, align=PP_ALIGN.CENTER)
    
    add_round_rect(slide, 2, 2.8, 2.8, 0.5, theme['cyan'])
    add_text_basic(slide, config.pill1, 2, 2.8, 2.8, 0.5, theme['textBlack'], 16, bold=True, align=PP_ALIGN.CENTER)
    
    add_round_rect(slide, 5.2, 2.8, 2.8, 0.5, theme['purple'])
    add_text_basic(slide, config.pill2, 5.2, 2.8, 2.8, 0.5, theme['textBlack'], 16, bold=True, align=PP_ALIGN.CENTER)
    
    add_text_basic(slide, config.footer, 0.5, 4.5, 9, 0.5, theme['textWhite'], 16, align=PP_ALIGN.CENTER)

def build_split_focus_title(slide, config, theme):
    render_global_decorations(slide, theme)
    add_rect(slide, 0, 0, 4.5, 5.625, theme['purple'])
    add_rect(slide, 4.5, 0, 0.05, 5.625, theme['gold'])
    
    add_round_rect(slide, 0.8, 2.0, 2.8, 0.5, theme['cyan'])
    add_text_basic(slide, config.pill1, 0.8, 2.0, 2.8, 0.5, theme['textBlack'], 16, bold=True, align=PP_ALIGN.CENTER)
    
    add_round_rect(slide, 0.8, 2.8, 2.8, 0.5, theme['gold'])
    add_text_basic(slide, config.pill2, 0.8, 2.8, 2.8, 0.5, theme['textBlack'], 16, bold=True, align=PP_ALIGN.CENTER)
    
    add_text_basic(slide, f"{config.mainTitle1}\n{config.mainTitle2}", 5, 1.5, 4.5, 2, theme['textWhite'], 49, bold=True)
    add_text_basic(slide, config.footer, 5, 4.5, 4.5, 0.5, theme['textWhite'], 14)

def render_options_grid(slide, q: SlideData, options_color: str, q_end_y: float, start_x: float, content_width: float):
    if not q.options:
        return
        
    options_y = q_end_y + 0.3
    
    total_chars = sum(len(opt.text) for opt in q.options)
    
    if total_chars < 60 and len(q.options) == 4:
        # 4 columns grid format to take exactly 100% width
        cols = 4
        col_width = content_width / cols
        for i, opt in enumerate(q.options):
            opt_x = start_x + (i % cols) * col_width
            opt_y = options_y
            add_mixed_content(slide, f"({opt.label}) {opt.text}", opt_x, opt_y, col_width - 0.1, options_color, 14)
    else:
        # 2 columns grid format
        cols = 2
        col_width = content_width / cols
        for i, opt in enumerate(q.options):
            opt_x = start_x + (i % cols) * col_width
            opt_y = options_y + (i // cols) * 0.6
            add_mixed_content(slide, f"({opt.label}) {opt.text}", opt_x, opt_y, col_width - 0.2, options_color, 14)

def build_modern_sidebar_question(slide, q: SlideData, theme):
    render_global_decorations(slide, theme)
    add_rect(slide, 0, 0, 0.05, 5.625, theme['cyan'])
    add_rect(slide, 0.05, 0, 0.05, 5.625, theme['purple'])
    
    # Badge
    add_round_rect(slide, 0.4, 0.2, 0.6, 0.25, theme['cyan'])
    add_text_basic(slide, q.badge, 0.4, 0.2, 0.6, 0.25, theme['textBlack'], 12, bold=True, align=PP_ALIGN.CENTER)
    
    # Tag bottom right
    add_round_rect(slide, 7.5, 5.1, 2.0, 0.25, theme['bgCard'], border_color=theme['purple'])
    add_text_basic(slide, q.tag.upper(), 7.5, 5.1, 2.0, 0.25, theme['purple'], 10, bold=True, align=PP_ALIGN.CENTER)
    
    start_x, start_y, content_width = 0.4, 0.6, 9.4
    q_end_y = add_mixed_content(slide, q.qText, start_x, start_y, content_width, theme['textWhite'], 14)
    render_options_grid(slide, q, theme['cyan'], q_end_y, start_x, content_width)

def build_classic_header_question(slide, q: SlideData, theme):
    render_global_decorations(slide, theme)
    add_rect(slide, 0, 0, 10, 0.05, theme['purple'])
    add_rect(slide, 0, 0.05, 10, 0.02, theme['gold'])
    
    add_round_rect(slide, 0.4, 0.2, 0.6, 0.25, theme['cyan'])
    add_text_basic(slide, q.badge, 0.4, 0.2, 0.6, 0.25, theme['textBlack'], 12, bold=True, align=PP_ALIGN.CENTER)
    
    add_round_rect(slide, 7.5, 5.1, 2.0, 0.25, theme['bgColor'], border_color=theme['purple'])
    add_text_basic(slide, q.tag.upper(), 7.5, 5.1, 2.0, 0.25, theme['purple'], 10, bold=True, align=PP_ALIGN.CENTER)
    
    start_x, start_y, content_width = 0.4, 0.6, 9.4
    q_end_y = add_mixed_content(slide, q.qText, start_x, start_y, content_width, theme['textWhite'], 14)
    render_options_grid(slide, q, theme['cyan'], q_end_y, start_x, content_width)

def build_split_focus_question(slide, q: SlideData, theme):
    render_global_decorations(slide, theme)
    add_rect(slide, 0, 0, 0.1, 5.625, theme['purple'])
    
    add_round_rect(slide, 0.4, 0.2, 0.6, 0.25, theme['cyan'])
    add_text_basic(slide, q.badge, 0.4, 0.2, 0.6, 0.25, theme['textBlack'], 12, bold=True, align=PP_ALIGN.CENTER)
    
    add_round_rect(slide, 7.5, 5.1, 2.0, 0.25, theme['bgColor'], border_color=theme['purple'])
    add_text_basic(slide, q.tag.upper(), 7.5, 5.1, 2.0, 0.25, theme['purple'], 10, bold=True, align=PP_ALIGN.CENTER)
    
    start_x, start_y, content_width = 0.4, 0.6, 9.4
    q_end_y = add_mixed_content(slide, q.qText, start_x, start_y, content_width, theme['textWhite'], 14)
    render_options_grid(slide, q, theme['gold'], q_end_y, start_x, content_width)


@app.post("/api/generate-pptx")
def generate_pptx(req: GenerateRequest):
    theme = THEMES.get(req.themeId, THEMES['dark-neon'])
    
    prs = Presentation()
    # 16:9 ratio
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(5.625)
    
    blank_layout = prs.slide_layouts[6] # completely blank
    
    # Title Slide
    title_slide = prs.slides.add_slide(blank_layout)
    # Background color isn't perfectly supported natively on slide master without deep oxml, 
    # so we add a full screen rect for background
    add_rect(title_slide, 0, 0, 10, 5.625, theme['bgColor'])
    
    if req.layoutId == 'classic-header':
        build_classic_header_title(title_slide, req.config, theme)
    elif req.layoutId == 'split-focus':
        build_split_focus_title(title_slide, req.config, theme)
    else:
        build_modern_sidebar_title(title_slide, req.config, theme)
        
    for q in req.activeSlides:
        q_slide = prs.slides.add_slide(blank_layout)
        add_rect(q_slide, 0, 0, 10, 5.625, theme['bgColor'])
        
        if req.layoutId == 'classic-header':
            build_classic_header_question(q_slide, q, theme)
        elif req.layoutId == 'split-focus':
            build_split_focus_question(q_slide, q, theme)
        else:
            build_modern_sidebar_question(q_slide, q, theme)
            
    f = BytesIO()
    prs.save(f)
    f.seek(0)
    
    filename = f"{req.config.mainTitle1}_{req.config.mainTitle2}_Presentation.pptx".replace(" ", "_")
    return StreamingResponse(
        f, 
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.post("/api/generate")
def generate_ai(req: AIParsingRequest):
    if not req.rawText or not req.rawText.strip():
        raise HTTPException(status_code=400, detail="No text provided.")
        
    api_key = os.getenv("VITE_GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API Key missing! You need to add VITE_GEMINI_API_KEY to your Environment Variables.")
        
    client = genai.Client(api_key=api_key)
    
    prompt = f"""You are an elite educational data formatter for a presentation generator. Parse the raw text into a valid JSON array of question objects.
Each object must have exactly these keys: "badge", "tag", "qText", "options".

- "badge": A short capitalized label (e.g. "Q.1", "EXP.13", "CS.1").
- "tag": A category string based on context headings (e.g. "Practice Question", "Worked Example", "Case Study"). Default to "Practice Question" if ambiguous.
- "qText": The question text as a string.
- "options": The extracted options as an array of objects, where each object has a "label" (e.g., "a", "b", "1") and "text" (the content). If no options exist, return an empty array [].

CRITICAL FORMATTING RULES TO PREVENT SLIDE OVERFLOW:

RULE 1 — SPACE ECONOMY (HIGHEST PRIORITY):
- Presentation slides have limited vertical space. DO NOT use excessive double newlines (\\n\\n).
- Use single newlines (\\n) to separate sub-parts or bullet points within qText to save space.

RULE 2 — MULTI-PART QUESTIONS:
If a question has "Part 1" and "Part 2" (or I/II, or Statement I/II), it is ONE question with TWO sub-parts.
- In "qText": Put both parts separated by a SINGLE newline (\\n).
- In "options": You MUST detect when there are TWO separate sets of (a)(b)(c)(d).
  If it has two separate sets, combine them logically or leave "options" empty and put them in "qText".

RULE 3 — COMPACT OPTIONS (GRID LAYOUT):
- Always extract options into the "options" array.
- E.g., if text has (A) 12 (B) 14, options should be [{{"label": "A", "text": "12"}}, {{"label": "B", "text": "14"}}]
- ONLY use this array structure. Do NOT return a string for options.

RULE 4 — MATHEMATICAL NOTATION:
- Preserve subscripts and superscripts as plain text: N₁ → "N1", 6⁶ → "6^6", x² → "x^2".
- Use ^ for exponents and simple notation for subscripts.

RULE 5 — ASSERTION (A) & REASON (R):
- Separate the Assertion text and Reason text with a single \\n in qText.

RULE 6 — CLEAN QUESTION TEXT:
- Do NOT include the original question number or label (like "Exp. 13:", "Case 1:", "Q.1") inside `qText`. Strip it completely. The `qText` should start directly with the actual question content.

RULE 7 — JSON SAFETY:
- Escape all newlines as \\n in JSON string values.
- Escape double quotes with backslash.
- Do NOT use actual unescaped line breaks inside JSON string values.

Raw text to format:
{req.rawText}

Respond ONLY with the JSON array. Do not include markdown wrappers like ```json."""

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        text = response.text
        text = re.sub(r'```json\s*', '', text, flags=re.IGNORECASE)
        text = re.sub(r'```\s*', '', text).strip()
        
        array_start = text.find('[')
        array_end = text.rfind(']')
        if array_start == -1 or array_end == -1:
            raise HTTPException(status_code=500, detail="AI did not return a valid JSON array.")
            
        json_string = text[array_start:array_end + 1]
        data = json.loads(json_string)
        
        if not isinstance(data, list) or len(data) == 0:
            raise HTTPException(status_code=500, detail="AI returned an empty or invalid array.")
            
        validated = []
        for i, item in enumerate(data):
            options = item.get('options', [])
            if not isinstance(options, list):
                options = []
            validated.append({
                "badge": f"Q.{i + 1}",
                "tag": item.get('tag', 'Practice Question'),
                "qText": item.get('qText', ''),
                "options": options
            })
            
        return validated
    except Exception as e:
        print(f"AI Formatting Error: {e}")
        raise HTTPException(status_code=500, detail=str(e) or "Failed to process text.")

if __name__ == "__main__":
    import uvicorn
    # Allow port to be configured by Render PORT env var, fallback to 8000
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
