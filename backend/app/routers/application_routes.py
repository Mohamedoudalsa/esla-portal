from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models import User, Application, Document, ApplicationStatus
from app.schemas import ApplicationCreateRequest, ApplicationResponse, DocumentResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/applications", tags=["Applications"])

def serialize_document(doc: Document) -> dict:
    return {
        "id": doc.id,
        "application_id": doc.application_id,
        "doc_type": doc.doc_type,
        "original_filename": doc.original_filename,
        "file_size": doc.file_size,
        "mime_type": doc.mime_type,
        "status": doc.status,
        "rejection_reason": doc.rejection_reason,
        "uploaded_at": doc.uploaded_at,
        "preview_url": f"/api/documents/{doc.id}/preview"
    }

def serialize_application(app: Application) -> dict:
    return {
        "id": app.id,
        "user_id": app.user_id,
        "category": app.category,
        "status": app.status,
        "admin_notes": app.admin_notes,
        "created_at": app.created_at,
        "updated_at": app.updated_at,
        "user": app.user,
        "documents": [serialize_document(d) for d in app.documents]
    }

@router.post("/", response_model=ApplicationResponse)
def create_or_update_application(req: ApplicationCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if user already has an application
    app = db.query(Application).filter(Application.user_id == current_user.id).first()
    
    valid_categories = ["student", "graduate", "professional", "consultant"]
    if req.category.lower() not in valid_categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"فئة عضوية غير صالحة. الفئات المتاحة: {', '.join(valid_categories)}"
        )

    if app:
        # If approved, cannot change tier
        if app.status == ApplicationStatus.APPROVED.value:
            raise HTTPException(status_code=400, detail="تم اعتماد عضويتك بالفعل ولا يمكن تعديل الفئة / Membership is already approved")
        
        # Update existing application category
        app.category = req.category.lower()
        app.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(app)
        return serialize_application(app)
    else:
        # Create new application
        app = Application(
            user_id=current_user.id,
            category=req.category.lower(),
            status=ApplicationStatus.PENDING_REVIEW.value,
        )
        db.add(app)
        db.commit()
        db.refresh(app)
        return serialize_application(app)

@router.get("/my", response_model=Optional[ApplicationResponse])
def get_my_application(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.user_id == current_user.id).first()
    if not app:
        return None
    return serialize_application(app)

@router.post("/my/submit-for-review", response_model=ApplicationResponse)
def submit_for_review(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="لم يتم العثور على طلب عضوية / Application not found")
    
    if len(app.documents) == 0:
        raise HTTPException(status_code=400, detail="يرجى رفع المستندات المطلوبة أولاً / Please upload required documents first")
    
    # If application was in needs_action or pending_review, advance or refresh to under_verification
    app.status = ApplicationStatus.UNDER_VERIFICATION.value
    app.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(app)
    return serialize_application(app)
