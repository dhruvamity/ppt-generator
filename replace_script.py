import re

with open('backend/main.py', 'r') as f:
    code = f.read()

# 1. Remove XML/LaTeX Dependencies
code = code.replace('from lxml import etree\nimport latex2mathml.converter\n', '')

# Remove XSLT_PATH block
xslt_block = """# Load the XSLT transformer once
XSLT_PATH = os.path.join(os.path.dirname(__file__), 'MML2OMML.XSL')
try:
    xslt_doc = etree.parse(XSLT_PATH)
    xslt_transformer = etree.XSLT(xslt_doc)
except Exception as e:
    print(f"Warning: Could not load {XSLT_PATH}: {e}")
    xslt_transformer = None"""
code = code.replace(xslt_block, '')

# Add Unicode Formatters and remove inject_omml_math, populate_paragraph, add_mixed_content
code_repl1 = '''def format_unicode_math(text: str) -> str:
    if not text:
        return text
    # Convert fractions (e.g. 625/36 -> ⁶²⁵/₃₆)
    sup = str.maketrans("0123456789", "⁰¹²³⁴⁵⁶⁷⁸⁹")
    sub = str.maketrans("0123456789", "₀₁₂₃₄₅₆₇₈₉")
    
    def frac_repl(match):
        num = match.group(1).translate(sup)
        den = match.group(2).translate(sub)
        return f"{num}/{den}"
        
    text = re.sub(r'\\b(\\d+)/(\\d+)\\b', frac_repl, text)
    
    # Convert exponents (e.g. x^2 -> x²)
    def exp_repl(match):
        return match.group(1) + match.group(2).translate(sup)
        
    text = re.sub(r'([a-zA-Z0-9])\\^(\\d+)', exp_repl, text)
    return text

def add_mixed_content(slide, text: str, start_x: float, start_y: float, width: float, color: str, font_size: int = 14) -> float:
    if not text:
        return start_y
        
    formatted_text = format_unicode_math(text)
    theme_color = hex_to_rgb(color)
    
    # Estimate height (Arial 14pt averages 0.11 inches per char)
    chars_per_line = width / 0.11
    lines = sum(max(1, int((len(line) + chars_per_line - 1) // chars_per_line)) for line in formatted_text.split('\\n'))
    text_height = lines * (font_size * 0.025)
    
    txBox = slide.shapes.add_textbox(Inches(start_x), Inches(start_y), Inches(width), Inches(text_height))
    tf = txBox.text_frame
    tf.margin_top = tf.margin_left = tf.margin_bottom = tf.margin_right = 0
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.line_spacing = 1.5
    run = p.add_run()
    run.text = formatted_text
    run.font.name = 'Arial'
    run.font.size = Pt(font_size)
    run.font.color.rgb = theme_color

    return start_y + text_height

def add_rect('''
code = re.sub(
    r'def inject_omml_math\(.*?\ndef add_rect\(',
    lambda m: code_repl1,
    code, flags=re.DOTALL
)

# Force Horizontal Table Spreading
code_repl2 = '''def render_options_grid(slide, q: SlideData, options_color: str, q_end_y: float, start_x: float, content_width: float):
    if not q.options:
        return
        
    options_y = max(q_end_y + 0.3, 2.2) # Prevent overlap with title area
    total_chars = sum(len(opt.text) for opt in q.options)
    cols = 4 if (total_chars < 60 and len(q.options) == 4) else 2
    rows = 1 if cols == 4 else ((len(q.options) + 1) // 2)
    
    table_shape = slide.shapes.add_table(rows, cols, Inches(start_x), Inches(options_y), Inches(content_width), Inches(0.5))
    table = table_shape.table
    
    for r in range(rows):
        for c in range(cols):
            cell = table.cell(r, c)
            cell.fill.background()
            cell.margin_top = cell.margin_bottom = Inches(0.05)
            cell.margin_left = cell.margin_right = 0
            
    for i, opt in enumerate(q.options):
        row_idx, col_idx = i // cols, i % cols
        cell = table.cell(row_idx, col_idx)
        p = cell.text_frame.paragraphs[0]
        p.line_spacing = 1.5
        
        # CRITICAL: Spread options across the entire width
        if cols == 4:
            if col_idx == 0: p.alignment = PP_ALIGN.LEFT
            elif col_idx == 3: p.alignment = PP_ALIGN.RIGHT
            else: p.alignment = PP_ALIGN.CENTER
        else:
            p.alignment = PP_ALIGN.LEFT
            
        formatted_opt = format_unicode_math(f"({opt.label}) {opt.text}")
        run = p.add_run()
        run.text = formatted_opt
        run.font.name = 'Arial'
        run.font.size = Pt(14)
        run.font.color.rgb = hex_to_rgb(options_color)'''
code = re.sub(
    r'def render_options_grid\(.*?\n            \n    for i, opt in enumerate\(q.options\):\n        row_idx, col_idx = i // cols, i % cols\n        cell = table.cell\(row_idx, col_idx\)\n        p = cell.text_frame.paragraphs\[0\]\n        p.line_spacing = 1.5.*?run\.font\.color\.rgb = hex_to_rgb\(options_color\)',
    lambda m: code_repl2,
    code, flags=re.DOTALL
)

# Overhaul AI prompt
new_prompt = '''prompt = f"""You are an elite educational data formatter. Parse the raw text into a valid JSON array of question objects.
Each object must have exactly these keys: "badge", "tag", "qText", "options".

- "badge": A short capitalized label (e.g. "Q.1").
- "tag": A category string based on context headings.
- "qText": The question text as a string.
- "options": The extracted options as an array of objects: [{{"label": "A", "text": "value"}}]. If no options exist, return [].

CRITICAL FORMATTING RULES:

RULE 1 — MANDATORY OPTIONS EXTRACTION:
- You MUST extract the choices (e.g., a, b, c, d or 1, 2, 3, 4) into the `options` array.
- Even if the options are on the SAME LINE as the question in the raw text, you MUST split them out into the `options` array and REMOVE them from `qText`. 

RULE 2 — UNICODE MATH (NO LATEX):
- DO NOT use LaTeX (no $ signs, no \\\\frac, no \\\\triangle, no \\\\angle).
- Use standard readable Unicode symbols. Convert "triangle" to ∆, "angle" to ∠, "degrees" to °.
- Write exponents naturally using ^ (e.g. x^2).
- Write fractions naturally using a slash (e.g. 625/36).
- Example: "In ∆ ABC, ∠ BOC = 130°"

RULE 3 — CLEAN QUESTION TEXT:
- Strip original question numbers (like "Q.3:", "Case 1:").
- Assign the 'badge' sequentially (Q.1, Q.2) based on their order in the text.

Raw text to format:
{req.rawText}

Respond ONLY with the JSON array. Do not include markdown wrappers like ```json."""'''
code = re.sub(r'prompt = f"""You are an elite educational data formatter for a presentation generator.*?```json\."""', lambda m: new_prompt, code, flags=re.DOTALL)

with open('backend/main.py', 'w') as f:
    f.write(code)

