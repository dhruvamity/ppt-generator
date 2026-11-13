from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import re
import json
import urllib.request
from google import genai
from google.genai import types
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import razorpay
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

def get_jwks(issuer: str):
    url = f"{issuer}/.well-known/jwks.json"
    with urllib.request.urlopen(url) as response:
        return json.loads(response.read().decode())

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        unverified_header = jwt.get_unverified_header(token)
        unverified_claims = jwt.get_unverified_claims(token)
        issuer = unverified_claims.get("iss")
        if not issuer:
            raise HTTPException(status_code=401, detail="Invalid token issuer")
        
        jwks = get_jwks(issuer)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break
        
        if rsa_key:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=None,
                issuer=issuer
            )
            return payload
        else:
            print("Unable to find appropriate key in JWKS")
            raise HTTPException(status_code=401, detail="Unable to find appropriate key")
            
    except JWTError as e:
        print(f"Token verification failed: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Authentication error: {str(e)}")


def sanitize_math(text: str) -> str:
    """Normalize transport damage without rewriting correctly delimited LaTeX."""
    if not text or not isinstance(text, str):
        return text

    s = text.replace("\x0crac", r"\frac")
    s = re.sub(r'\\\(([\s\S]*?)\\\)', lambda m: '$' + m.group(1) + '$', s)
    s = re.sub(r'\\\[([\s\S]*?)\\\]', lambda m: '$' + m.group(1) + '$', s)
    s = s.replace('$$', '$')

    # Work only outside existing math. Removing an opening $ before a root or
    # altering matrix row separators changes valid source expressions.
    def wrap_naked_commands(source, pattern):
        parts = re.split(r'(?<!\\)(\$[\s\S]*?(?<!\\)\$)', source)
        for index in range(0, len(parts), 2):
            parts[index] = re.sub(pattern, lambda m: '$' + m.group(0) + '$', parts[index])
        return ''.join(parts)

    # A stray trailing delimiter after a complete expression is commonly pasted
    # as "$sqrt{2}$ units$". Drop that extra delimiter instead of swallowing units.
    dollars = list(re.finditer(r'(?<!\\)\$', s))
    if len(dollars) % 2 and len(dollars) >= 3 and s[dollars[-1].end():].strip() == '':
        s = s[:dollars[-1].start()] + s[dollars[-1].end():]

    patterns = (
        r'\\(?:d?frac){(?:[^{}]|{[^{}]*})*}{(?:[^{}]|{[^{}]*})*}',
        r'\\sqrt(?:\[[^\]]+\])?{(?:[^{}]|{[^{}]*})*}',
        r'\\(?:triangle|angle)\s*[A-Z]+',
        r'\\begin{[^}]+}[\s\S]*?\\end{[^}]+}',
    )
    # An unclosed expression is left for the formatter to repair; do not wrap
    # nested commands inside it and thereby introduce new mismatched delimiters.
    if len(re.findall(r'(?<!\\)\$', s)) % 2 == 0:
        for pattern in patterns:
            s = wrap_naked_commands(s, pattern)
    return s


class GenerateRequest(BaseModel):
    rawText: str

class OptionSchema(BaseModel):
    label: Optional[str] = None
    text: Optional[str] = None

class SlideSchema(BaseModel):
    badge: Optional[str] = None
    tag: Optional[str] = None
    qText: Optional[str] = None
    context: Optional[str] = None
    options: Optional[List[OptionSchema]] = None
    topic: Optional[str] = None
    answer: Optional[str] = None
    solution: Optional[str] = None

class BeamerRequest(BaseModel):
    slides: List[dict]


# Initialize Razorpay Client
razorpay_client = razorpay.Client(
    auth=(os.environ.get("RAZORPAY_KEY_ID", ""), os.environ.get("RAZORPAY_KEY_SECRET", ""))
)

@app.post("/api/create-razorpay-order")
async def create_order(user=Depends(verify_token)):
    user_id = user.get("sub") # Clerk User ID
    
    # Razorpay expects amounts in paise (multiply by 100)
    data = {
        "amount": 799 * 100, 
        "currency": "INR",
        "receipt": f"receipt_{user_id}",
        "notes": {
            "clerk_user_id": user_id # We need this for the webhook later!
        }
    }
    
    try:
        order = razorpay_client.order.create(data=data)
        return {"order_id": order["id"], "amount": order["amount"], "currency": "INR"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/webhooks/razorpay")
async def razorpay_webhook(request: Request):
    # Razorpay Webhook Secret (Set this up in Razorpay Dashboard)
    webhook_secret = os.environ.get("RAZORPAY_WEBHOOK_SECRET", "") 
    
    payload = await request.body()
    signature = request.headers.get("x-razorpay-signature")

    # 1. Verify the signature is authentic (Security Check)
    try:
        razorpay_client.utility.verify_webhook_signature(
            payload.decode('utf-8'), signature, webhook_secret
        )
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # 2. Parse the payload
    event_data = json.loads(payload)
    
    # 3. Handle successful payments
    if event_data.get('event') in ['payment.captured', 'order.paid']:
        payment_entity = event_data['payload']['payment']['entity']
        
        # Extract the Clerk User ID we passed in the notes earlier
        clerk_user_id = payment_entity.get('notes', {}).get('clerk_user_id')
        
        if clerk_user_id:
            # 4. Update Clerk User Metadata via Clerk REST API
            clerk_secret = os.environ.get("CLERK_SECRET_KEY")
            clerk_url = f"https://api.clerk.com/v1/users/{clerk_user_id}/metadata"
            
            async with httpx.AsyncClient() as client:
                await client.patch(
                    clerk_url,
                    headers={
                        "Authorization": f"Bearer {clerk_secret}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "public_metadata": {
                            "plan": "pro"
                        }
                    }
                )
    
    return {"status": "success"}

@app.post("/api/generate")
async def generate_slides(request: GenerateRequest, user=Depends(verify_token)):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing on backend")

    # JSON response schemas are only available on the Gemini Developer API's
    # v1beta endpoint; the SDK otherwise defaults to the stable v1 endpoint.
    client = genai.Client(
        api_key=api_key,
        http_options=types.HttpOptions(api_version="v1beta"),
    )
    
    # Some clipboard paths turn the two-character LaTeX sequence "\\f" into a
    # form-feed control character. Restore the common \frac corruption before
    # sending the source to the model so the numerator and denominator survive.
    source_text = request.rawText.replace("\x0crac", r"\frac")

    prompt = f"""You are an educational question formatter. Parse the source into a JSON array with one object per question.

CONTENT PRESERVATION:
1. Preserve every question in its original order, every answer choice, shared passage, chart description, table, and stated value from the source. Never drop or invent source material.
2. Put only the specific question prompt in `qText`; put material shared by related questions in `context` and repeat that context on every question that depends on it.
3. If a chart is transcribed as a table, retain its title, labels, units, and every value in a compact readable form. Preserve lists and numbered statements with line breaks.
4. If the source does not contain the context needed to answer a question, leave `context` empty. Do not guess missing data.
5. Do not include question numbers or labels such as "Q.1" or "MCQ" in `qText`; the application adds question numbers itself.

CRITICAL MATH RULES:
1. USE ONLY ONE PAIR OF DOLLAR SIGNS per equation/expression. Combine adjacent numbers and math!
   - BAD: 4($\\sqrt{{2}}$ - 1) cm
   - GOOD: $4(\\sqrt{{2}} - 1)$ cm
2. NEVER NEST DOLLAR SIGNS. DO NOT put $ inside fractions or roots!
   - BAD: $\\frac{{500}}{{$\\sqrt{{3}}$}}$
   - GOOD: $\\frac{{500}}{{\\sqrt{{3}}}}$
   - BAD: Area ($\\triangle$ADE)
   - GOOD: Area $(\\triangle ADE)$
3. NO SLASHES for fractions. ALWAYS use \\frac{{numerator}}{{denominator}}.
   - BAD: $1/2$
   - GOOD: $\\frac{{1}}{{2}}$
4. MATRICES & VECTORS: Format as proper LaTeX matrix using \\begin{{bmatrix}} ... \\end{{bmatrix}} for square brackets. 
   CRITICAL: Use \\cr instead of \\\\ for row breaks! JSON escaping breaks \\\\!
   - BAD: A = [2 -1, 3 4]
   - GOOD: $A = \\begin{{bmatrix}} 2 & -1 \\cr 3 & 4 \\end{{bmatrix}}$
5. ADVANCED MATH: Use proper LaTeX for integrals (\\int), derivatives (\\frac{{d}}{{dx}}), sums (\\sum), and limits (\\lim).

For each question, identify a concise subject topic (1-4 words) in `topic`, and a short question type such as "MCQ" in `tag`.

Extract all choices (1, 2, 3, 4) or (A, B, C, D) into the "options" array.

ANSWERS AND SOLUTIONS:
1. Only if the source states the correct answer (for example "Ans: (c)" or "Answer: 42"), put it in `answer`: the option label alone for multiple choice ("c"), otherwise the value. Never work out or guess an answer that is not written in the source.
2. Only if the source contains a worked solution or explanation, put it in `solution`, keeping every step and the same math rules. Never write a solution yourself.
3. Leave `answer` and `solution` empty when the source does not provide them.
Raw text:
{source_text}"""

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=list[SlideSchema],
            )
        )
        
        # Safely strip markdown block wrappers if present
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()
        
        raw_data = json.loads(raw_text)
        
        processed_data = []
        for i, slide in enumerate(raw_data):
            slide["badge"] = f"Q.{i + 1}"
            slide["tag"] = slide.get("tag") or "PRACTICE"
            slide["qText"] = sanitize_math(slide.get("qText") or "")
            slide["qText"] = re.sub(
                r'^\s*(?:Q(?:uestion)?\.?\s*\d+|Question\s+\d+)\s*[:.)-]?\s*(?:MCQ\b\s*)?',
                '',
                slide["qText"],
                flags=re.IGNORECASE,
            )
            slide["context"] = sanitize_math(slide.get("context") or "")
            slide["topic"] = slide.get("topic") or "General Practice"
            
            options = []
            for opt in slide.get("options") or []:
                opt_label = re.sub(r'[()]', '', str(opt.get("label") or ""))
                options.append({
                    "label": opt_label,
                    "text": sanitize_math(opt.get("text") or "")
                })
            slide["options"] = options
            answer = str(slide.get("answer") or "").strip()
            label = re.fullmatch(r"\(([A-Fa-f1-6])\)", answer) if options else None
            slide["answer"] = label[1] if label else sanitize_math(answer)
            slide["solution"] = sanitize_math(slide.get("solution") or "")
            processed_data.append(slide)

        return {"data": processed_data}

    except Exception as e:
        print(f"Error during generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/export-beamer")
async def export_beamer(request: BeamerRequest, user=Depends(verify_token)):
    # Structure placeholder for Beamer Export
    return {"message": "Beamer export coming soon!"}
