from fastapi import FastAPI, UploadFile, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
import tempfile
from pathlib import Path
import os
import uuid
from typing import Dict

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
GO_BACKEND_URL = os.getenv("GO_BACKEND_URL", "http://localhost:8080")

class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        credentials = await super().__call__(request)
        if not credentials:
            raise HTTPException(403, "Missing token")
        return credentials.credentials

    @staticmethod
    async def verify_jwt(token: str) -> bool:
        async with httpx.AsyncClient() as client:
            try:
                r = await client.get(
                    f"{GO_BACKEND_URL}/api/v1/auth/validate",
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=5.0
                )
                return r.status_code == 200 and r.json().get("valid", False)
            except Exception as e:
                print(f"JWT validation error: {e}")
                return False

security = JWTBearer()

@app.post("/analyze")
async def analyze_cv_endpoint(
    request: Request,
    file: UploadFile,
    token: str = Depends(security)
):
    """Endpoint for CV analysis"""
    try:
        # Validate token
        async with httpx.AsyncClient() as client:
            validation = await client.get(
                f"{GO_BACKEND_URL}/api/v1/auth/validate",
                headers={"Authorization": f"Bearer {token}"}
            )
            user_id = validation.json().get("user_id")
            if not user_id:
                raise HTTPException(403, "Invalid user")

        # Process file
        file_ext = Path(file.filename).suffix.lower()
        with tempfile.NamedTemporaryFile(suffix=file_ext, delete=False) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        try:
            skills = analyze_cv_file(tmp_path)
            return {
                "status": "success",
                "results": {
                    "skills": skills,
                    "analysis_id": str(uuid.uuid4()),
                    "user_id": user_id
                }
            }
        finally:
            os.unlink(tmp_path)
            
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, f"Processing error: {str(e)}")

def analyze_cv_file(filepath: str) -> Dict[str, list]:
    """Wrapper for CV processor"""
    from cv_processor import analyze_cv
    return analyze_cv(filepath)  # Directly use the simplified interface

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)