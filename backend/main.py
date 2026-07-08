import os
import re
import json
from io import BytesIO
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
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



def hex_to_rgb(hex_str: str) -> RGBColor:
    hex_str = hex_str.lstrip('#')
    return RGBColor(int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16))



def format_unicode_math(text: str) -> str:
    if not text:
        return text

    # 1. Defensively repair escape character corruption (\t and \f eating backslashes)
    text = text.replace('\t', '')
    text = text.replace('riangle', '∆')
    text = text.replace('\f', '')
    text = text.replace('rac{', '\\frac{')

    # 2. Strip out LaTeX math mode wrappers to prevent regex failures
    text = text.replace('$', '')

    # 3. Unicode Maps (Safe Dictionary approach)
    sup_map = {"0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾", "n": "ⁿ", "x": "ˣ", "y": "ʸ"}
    sub_map = {"0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉", "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎"}

    def to_sup(s):
        return "".join(sup_map.get(c, c) for c in s)
    def to_sub(s):
        return "".join(sub_map.get(c, c) for c in s)

    # 4. Convert Fractions: \frac{a}{b}
    def frac_repl(m):
        num = to_sup(m.group(1))
        den = to_sub(m.group(2))
        return f"{num}/{den}"
    text = re.sub(r'\\frac\{([^{}]+)\}\{([^{}]+)\}', frac_repl, text)
    # Run twice to catch nested fractions
    text = re.sub(r'\\frac\{([^{}]+)\}\{([^{}]+)\}', frac_repl, text)

    # 5. Convert Square Roots: \sqrt{a}
    def sqrt_repl(m):
        val = m.group(1)
        if val.isdigit():
            return f"√{val}"
        return f"√({val})"
    text = re.sub(r'\\sqrt\{([^{}]+)\}', sqrt_repl, text)
    text = text.replace(r'\sqrt', '√')

    # 6. Convert Exponents: ^2 or ^{2}
    def exp_repl(m):
        val = m.group(1) or m.group(2)
        return to_sup(val)
    text = re.sub(r'\^\{([^{}]+)\}|\^([a-zA-Z0-9])', exp_repl, text)

    # 7. Convert Standard Math Symbols
    syms = {
        r'\circ': '°',
        r'\angle': '∠',
        r'\triangle': '∆',
        r'\pi': 'π',
        r'\le': '≤',
        r'\ge': '≥',
        r'\cdot': '·'
    }
    for k, v in syms.items():
        text = text.replace(k, v)

    return text

def add_mixed_content(slide, text: str, start_x: float, start_y: float, width: float, color: str, font_size: int = 14) -> float:
    if not text:
        return start_y
        
    formatted_text = format_unicode_math(text)
    theme_color = hex_to_rgb(color)
    
    chars_per_line = width / 0.11
    lines = sum(max(1, int((len(line) + chars_per_line - 1) // chars_per_line)) for line in formatted_text.split('\n'))
    text_height = lines * (font_size * 0.025)
    
    txBox = slide.shapes.add_textbox(Inches(start_x), Inches(start_y), Inches(width), Inches(text_height))
    tf = txBox.text_frame
    tf.margin_top = tf.margin_left = tf.margin_bottom = tf.margin_right = 0
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.line_spacing = 1.5
    
    # CRITICAL: Append a single run. Do NOT loop or split by '$'.
    run = p.add_run()
    run.text = formatted_text
    run.font.name = 'Arial'
    run.font.size = Pt(font_size)
    run.font.color.rgb = theme_color

    return start_y + text_height

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
    cols = 4 if (total_chars < 60 and len(q.options) == 4) else 2
    rows = 1 if cols == 4 else ((len(q.options) + 1) // 2)
    
    # Use a table to perfectly distribute options across the width
    table_shape = slide.shapes.add_table(rows, cols, Inches(start_x), Inches(options_y), Inches(content_width), Inches(0.5))
    table = table_shape.table
    
    # Attempt to remove visible borders by clearing fills (if supported by theme)
    for r in range(rows):
        for c in range(cols):
            cell = table.cell(r, c)
            cell.fill.background()
            # Remove padding
            cell.margin_left = 0
            cell.margin_right = 0
            cell.margin_top = Inches(0.05)
            cell.margin_bottom = Inches(0.05)
            
    for i, opt in enumerate(q.options):
        row_idx = i // cols
        col_idx = i % cols
        cell = table.cell(row_idx, col_idx)
        
        p = cell.text_frame.paragraphs[0]
        p.line_spacing = 1.5
        
        # Apply formatting here!
        formatted_opt = format_unicode_math(f"({opt.label}) {opt.text}")
        run = p.add_run()
        run.text = formatted_opt
        
        run.font.name = 'Arial'
        run.font.size = Pt(14)
        run.font.color.rgb = hex_to_rgb(options_color)

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

import traceback

@app.post("/api/generate")
def generate_ai(req: AIParsingRequest):
    try:
        if not req.rawText or not req.rawText.strip():
            raise HTTPException(status_code=400, detail="No text provided.")
            
        api_key = os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API Key missing! Please add VITE_GEMINI_API_KEY to your Render environment variables.")
            
        client = genai.Client(api_key=api_key)
        
        prompt = f"""You are an elite educational data formatter. Parse the raw text into a valid JSON array of question objects.
Each object must have exactly these keys: "badge", "tag", "qText", "options".

- "badge": A short capitalized label (e.g. "Q.1").
- "tag": A category string based on context headings.
- "qText": The question text as a string.
- "options": The extracted options as an array of objects: [{{"label": "A", "text": "value"}}]. If no options exist, return [].

CRITICAL FORMATTING RULES:

RULE 1 — MANDATORY OPTIONS EXTRACTION:
- You MUST extract the choices (e.g., a, b, c, d or 1, 2, 3, 4) into the `options` array.
- Even if the options are on the SAME LINE as the question in the raw text, you MUST split them out into the `options` array and REMOVE them from `qText`. 

RULE 2 — MATHEMATICAL NOTATION:
- Standardize all fractions as \\frac{{a}}{{b}} (e.g. \\frac{{625}}{{36}}). 
- Standardize all square roots as \\sqrt{{a}} (e.g. \\sqrt{{3}} or \\sqrt{{34}}).
- Standardize all exponents with carets: x^{{2}} or x^2.
- Output symbols naturally or as LaTeX: \\angle or ∠, \\triangle or ∆, \\circ or °.
- Do NOT output XML, MathML, or OMML. Only use inline pseudo-LaTeX.
- Fix any broken OCR text. For example, if the raw text says "50\\frac{{0}}{{\\sqrt{{3}}}}", correct it to "\\frac{{500}}{{\\sqrt{{3}}}}".

RULE 3 — CLEAN QUESTION TEXT:
- Strip original question numbers (like "Q.3:", "Case 1:").
- Assign the 'badge' sequentially (Q.1, Q.2) based on their order in the text.

Raw text to format:
{req.rawText}

Respond ONLY with the JSON array. Do not include markdown wrappers like ```json."""

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
            
            qText = item.get('qText', '')
            cleaned_options = []
            for opt in options:
                if isinstance(opt, dict):
                    cleaned_options.append({
                        "label": opt.get("label", ""),
                        "text": opt.get("text", "")
                    })
                    
            validated.append({
                "badge": f"Q.{i + 1}",
                "tag": item.get('tag', 'Practice Question'),
                "qText": qText,
                "options": cleaned_options
            })
            
        return validated
    except Exception as e:
        print(f"AI Formatting Error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e) or "Failed to process text.")

if __name__ == "__main__":
    import uvicorn
    # Allow port to be configured by Render PORT env var, fallback to 8000
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
