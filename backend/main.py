import os
import re
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
        
    options_y = q_end_y + (14 * 0.018 * 2.0)
    
    total_chars = sum(len(opt.text) for opt in q.options)
    cols = 4 if total_chars < 50 else 2
    col_width = content_width / cols
    
    for i, opt in enumerate(q.options):
        opt_x = start_x + (i % cols) * col_width
        opt_y = options_y + (i // cols) * 0.6
        add_text_basic(slide, f"({opt.label})", opt_x, opt_y, 0.35, 0.25, options_color, 14, bold=True)
        add_mixed_content(slide, opt.text, opt_x + 0.35, opt_y, col_width - 0.4, options_color, 14)

def build_modern_sidebar_question(slide, q: SlideData, theme):
    render_global_decorations(slide, theme)
    add_rect(slide, 0, 0, 0.05, 5.625, theme['cyan'])
    add_rect(slide, 0.05, 0, 0.05, 5.625, theme['purple'])
    
    # Badge
    add_round_rect(slide, 0.15, 0.1, 0.6, 0.25, theme['cyan'])
    add_text_basic(slide, q.badge, 0.15, 0.1, 0.6, 0.25, theme['textBlack'], 12, bold=True, align=PP_ALIGN.CENTER)
    
    # Tag bottom right
    add_round_rect(slide, 7.5, 5.1, 2.0, 0.25, theme['bgCard'], border_color=theme['purple'])
    add_text_basic(slide, q.tag.upper(), 7.5, 5.1, 2.0, 0.25, theme['purple'], 10, bold=True, align=PP_ALIGN.CENTER)
    
    start_x, start_y, content_width = 0.15, 0.5, 9.7
    q_end_y = add_mixed_content(slide, q.qText, start_x, start_y, content_width, theme['textWhite'], 14)
    render_options_grid(slide, q, theme['cyan'], q_end_y, start_x, content_width)

def build_classic_header_question(slide, q: SlideData, theme):
    render_global_decorations(slide, theme)
    add_rect(slide, 0, 0, 10, 0.05, theme['purple'])
    add_rect(slide, 0, 0.05, 10, 0.02, theme['gold'])
    
    add_round_rect(slide, 0.1, 0.1, 0.6, 0.25, theme['cyan'])
    add_text_basic(slide, q.badge, 0.1, 0.1, 0.6, 0.25, theme['textBlack'], 12, bold=True, align=PP_ALIGN.CENTER)
    
    add_round_rect(slide, 7.5, 5.1, 2.0, 0.25, theme['bgColor'], border_color=theme['purple'])
    add_text_basic(slide, q.tag.upper(), 7.5, 5.1, 2.0, 0.25, theme['purple'], 10, bold=True, align=PP_ALIGN.CENTER)
    
    start_x, start_y, content_width = 0.15, 0.5, 9.7
    q_end_y = add_mixed_content(slide, q.qText, start_x, start_y, content_width, theme['textWhite'], 14)
    render_options_grid(slide, q, theme['cyan'], q_end_y, start_x, content_width)

def build_split_focus_question(slide, q: SlideData, theme):
    render_global_decorations(slide, theme)
    add_rect(slide, 0, 0, 0.1, 5.625, theme['purple'])
    
    add_round_rect(slide, 0.15, 0.1, 0.6, 0.25, theme['cyan'])
    add_text_basic(slide, q.badge, 0.15, 0.1, 0.6, 0.25, theme['textBlack'], 12, bold=True, align=PP_ALIGN.CENTER)
    
    add_round_rect(slide, 7.5, 5.1, 2.0, 0.25, theme['bgColor'], border_color=theme['purple'])
    add_text_basic(slide, q.tag.upper(), 7.5, 5.1, 2.0, 0.25, theme['purple'], 10, bold=True, align=PP_ALIGN.CENTER)
    
    start_x, start_y, content_width = 0.15, 0.5, 9.7
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

if __name__ == "__main__":
    import uvicorn
    # Allow port to be configured by Render PORT env var, fallback to 8000
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
