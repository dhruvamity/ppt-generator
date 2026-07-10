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
    if not text or not isinstance(text, str):
        return text
    
    s = text

    # 1. ERADICATE NESTING
    s = s.replace('{$', '{').replace('$}', '}')
    s = s.replace('$\\sqrt', '\\sqrt')

    # 2. NORMALIZE BLOCK MATH
    s = s.replace('$$', '$')

    # 2.5 FIX AI HALLUCINATIONS
    s = re.sub(r'\\angle([A-Za-z])', r'\\angle \1', s)
    s = re.sub(r'\\triangle([A-Za-z])', r'\\triangle \1', s)
    s = re.sub(r'(?:\^)?(?:\{)?(?:\\)?(?:c?irc)(?:\})?(?!\w)', r'^{\\circ}', s)
    s = re.sub(r'\\text\{\^([^}]+)\}', r'^{\1}', s)

    # 3. COMBINE ADJACENT MATH
    s = re.sub(r'\$\s+\$', ' ', s)

    # 4. WRAP NAKED LATEX & FIX MATRIX ROW BREAKS
    def fix_matrix(match):
        return re.sub(r'\\\s', r'\\cr ', match.group(1))
    
    s = re.sub(r'(\\begin{[^}]+}[\s\S]*?\\end{[^}]+})', fix_matrix, s)

    def apply_outside_math(text_val, regex):
        parts = text_val.split('$')
        for i in range(len(parts)):
            if i % 2 == 0: # outside math block
                parts[i] = re.sub(regex, r'$\1$', parts[i])
        return '$'.join(parts)

    s = apply_outside_math(s, r'(\\frac{(?:[^{}]|{[^{}]*})*}{(?:[^{}]|{[^{}]*})*})')
    s = apply_outside_math(s, r'(\\sqrt{(?:[^{}]|{[^{}]*})*})')
    s = apply_outside_math(s, r'(\\triangle\s*[A-Z]*)')
    s = apply_outside_math(s, r'(\\angle\s*[A-Z]*)')
    s = apply_outside_math(s, r'(\\begin{[^}]+}[\s\S]*?\\end{[^}]+})')

    # 5. BALANCE DOLLAR SIGNS
    dollar_count = s.count('$')
    if dollar_count % 2 != 0:
        s += '$'

    s = s.replace('$$', '$')
    s = re.sub(r'\$\s+\$', ' ', s)

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
    options: Optional[List[OptionSchema]] = None
    topic: Optional[str] = None

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
    user_metadata = user.get("public_metadata", {})
    is_pro = user_metadata.get("plan") == "pro"

    if not is_pro:
        raise HTTPException(status_code=403, detail="Payment required. Please upgrade to Pro to generate AI slides.")

    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing on backend")

    client = genai.Client(api_key=api_key)
    
    prompt = f"""You are an elite educational data formatter. Parse the text into a JSON array.

CRITICAL MATH RULES:
1. USE ONLY ONE PAIR OF DOLLAR SIGNS per equation/expression. Combine adjacent numbers and math!
   - BAD: 4($\\sqrt{{2}}$ - 1) cm
   - GOOD: $4(\\sqrt{{2}} - 1)$ cm
2. NEVER NEST DOLLAR SIGNS. DO NOT put $ inside fractions or roots!
   - BAD: $\\frac{{500}}{{\$\\sqrt{{3}}\\$}}$
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

For each question, identify the specific mathematical or subject topic (e.g., 'Trigonometry', 'Algebra', 'HCF & LCM'). Keep it concise (1-4 words). Add this to the `topic` key in the JSON.
Additionally, assign a short tag (e.g., 'MCQ', 'Concept', 'Hard', 'Easy') to the `tag` key.

Extract all choices (1, 2, 3, 4) or (A, B, C, D) into the "options" array.
Raw text:
{request.rawText}"""

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
            slide["topic"] = slide.get("topic") or "General Practice"
            
            options = []
            for opt in slide.get("options") or []:
                opt_label = re.sub(r'[()]', '', str(opt.get("label") or ""))
                options.append({
                    "label": opt_label,
                    "text": sanitize_math(opt.get("text") or "")
                })
            slide["options"] = options
            processed_data.append(slide)

        return {"data": processed_data}

    except Exception as e:
        print(f"Error during generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/export-beamer")
async def export_beamer(request: BeamerRequest, user=Depends(verify_token)):
    # Structure placeholder for Beamer Export
    return {"message": "Beamer export coming soon!"}
