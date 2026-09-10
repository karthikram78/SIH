import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas import FileUploadResponse

router = APIRouter(prefix="/upload", tags=["File & Document Uploads"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads", "documents")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".pdf", ".gif"}

@router.post("/document", response_model=FileUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Check extension
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed: JPG, PNG, WEBP, PDF"
        )
    
    unique_name = f"doc_{uuid.uuid4().hex[:10]}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, unique_name)
    
    try:
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = os.path.getsize(dest_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")
    finally:
        await file.close()

    # Publicly accessible URL via FastAPI static files mount
    file_url = f"/uploads/documents/{unique_name}"
    
    return FileUploadResponse(
        url=file_url,
        filename=file.filename,
        size=file_size,
        mimeType=file.content_type or "application/octet-stream",
        message="Aadhaar / Document uploaded successfully"
    )
