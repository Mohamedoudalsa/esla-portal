import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db, BASE_DIR
from app.models import User, Application, Document, ApplicationStatus, UserRole
from app.schemas import DocumentResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/documents", tags=["Documents"])

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_MIME_TYPES = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/jpg": ".jpg",
}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB max

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check user application
    app = db.query(Application).filter(Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="يرجى اختيار فئة العضوية أولاً / Please select a membership tier first"
        )
    
    if app.status == ApplicationStatus.APPROVED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="تم اعتماد العضوية بالفعل، لا يمكن تعديل المستندات / Membership already approved"
        )

    # Validate MIME type
    content_type = file.content_type.lower() if file.content_type else ""
    original_ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
    
    # Check mime type or extension
    matched_ext = None
    for mime, ext in ALLOWED_MIME_TYPES.items():
        if content_type == mime or original_ext == ext:
            matched_ext = ext
            break

    if not matched_ext:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="نوع الملف غير مدعوم. الأنواع المدعومة: PDF, JPG, PNG فقط / Unsupported file type"
        )

    # Read content and validate size
    content = await file.read()
    file_size = len(content)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="حجم الملف يتجاوز الحد المسموح به (الحد الأقصى 20 ميجابايت) / File size exceeds limit"
        )
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="الملف فارغ / Empty file uploaded"
        )

    # Prepare user-specific directory
    user_upload_dir = os.path.join(UPLOAD_DIR, str(current_user.id))
    os.makedirs(user_upload_dir, exist_ok=True)

    unique_filename = f"{doc_type}_{uuid.uuid4().hex[:8]}{matched_ext}"
    saved_file_path = os.path.join(user_upload_dir, unique_filename)

    # Write file to disk
    with open(saved_file_path, "wb") as f:
        f.write(content)

    # Check if a document of the same doc_type already exists
    existing_doc = db.query(Document).filter(
        Document.application_id == app.id,
        Document.doc_type == doc_type
    ).first()

    if existing_doc:
        # Delete old file from disk if exists
        try:
            if os.path.exists(existing_doc.file_path):
                os.remove(existing_doc.file_path)
        except Exception:
            pass

        existing_doc.original_filename = file.filename
        existing_doc.stored_filename = unique_filename
        existing_doc.file_path = saved_file_path
        existing_doc.file_size = file_size
        existing_doc.mime_type = content_type or f"application/{matched_ext.replace('.', '')}"
        existing_doc.status = "pending"
        existing_doc.rejection_reason = None
        db.commit()
        db.refresh(existing_doc)
        doc_record = existing_doc
    else:
        doc_record = Document(
            application_id=app.id,
            doc_type=doc_type,
            original_filename=file.filename,
            stored_filename=unique_filename,
            file_path=saved_file_path,
            file_size=file_size,
            mime_type=content_type or f"application/{matched_ext.replace('.', '')}",
            status="pending"
        )
        db.add(doc_record)
        db.commit()
        db.refresh(doc_record)

    return {
        "id": doc_record.id,
        "application_id": doc_record.application_id,
        "doc_type": doc_record.doc_type,
        "original_filename": doc_record.original_filename,
        "file_size": doc_record.file_size,
        "mime_type": doc_record.mime_type,
        "status": doc_record.status,
        "rejection_reason": doc_record.rejection_reason,
        "uploaded_at": doc_record.uploaded_at,
        "preview_url": f"/api/documents/{doc_record.id}/preview"
    }

@router.get("/{doc_id}/preview")
def preview_document(
    doc_id: int,
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="المستند غير موجود / Document not found")

    return FileResponse(
        path=doc.file_path,
        media_type=doc.mime_type,
        headers={"Content-Disposition": f'inline; filename="{doc.original_filename}"'}
    )

@router.get("/{doc_id}/download")
def download_document(
    doc_id: int,
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="المستند غير موجود / Document not found")

    return FileResponse(
        path=doc.file_path,
        media_type=doc.mime_type,
        filename=doc.original_filename
    )

@router.delete("/{doc_id}")
def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    app = db.query(Application).filter(Application.id == doc.application_id).first()
    if app.user_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Unauthorized")

    try:
        if os.path.exists(doc.file_path):
            os.remove(doc.file_path)
    except Exception:
        pass

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}
