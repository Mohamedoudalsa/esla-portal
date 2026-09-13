from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models import User, Application, Document, ApplicationStatus, DocumentStatus
from app.schemas import ApplicationResponse, ApplicationStatusUpdateRequest, AdminStatsResponse
from app.auth import get_current_admin
from app.routers.application_routes import serialize_application

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"], dependencies=[Depends(get_current_admin)])

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(db: Session = Depends(get_db)):
    total = db.query(Application).count()
    pending = db.query(Application).filter(Application.status == ApplicationStatus.PENDING_REVIEW.value).count()
    under_verif = db.query(Application).filter(Application.status == ApplicationStatus.UNDER_VERIFICATION.value).count()
    approved = db.query(Application).filter(Application.status == ApplicationStatus.APPROVED.value).count()
    needs_action = db.query(Application).filter(Application.status == ApplicationStatus.NEEDS_ACTION.value).count()
    rejected = db.query(Application).filter(Application.status == ApplicationStatus.REJECTED.value).count()

    return AdminStatsResponse(
        total_applications=total,
        pending_review=pending,
        under_verification=under_verif,
        approved=approved,
        needs_action=needs_action,
        rejected=rejected
    )

@router.get("/applications", response_model=List[ApplicationResponse])
def get_applications(
    q: Optional[str] = Query(None, description="Search by name, email or phone"),
    category: Optional[str] = Query(None, description="Filter by membership tier"),
    status: Optional[str] = Query(None, description="Filter by application status"),
    db: Session = Depends(get_db)
):
    query = db.query(Application).join(User)

    if category and category != "all":
        query = query.filter(Application.category == category.lower())

    if status and status != "all":
        query = query.filter(Application.status == status.lower())

    if q:
        search = f"%{q.strip()}%"
        query = query.filter(
            (User.full_name_ar.ilike(search)) |
            (User.full_name_en.ilike(search)) |
            (User.email.ilike(search)) |
            (User.phone_whatsapp.ilike(search))
        )

    # Order newest first
    applications = query.order_by(Application.created_at.desc()).all()
    return [serialize_application(app) for app in applications]

@router.get("/applications/{app_id}", response_model=ApplicationResponse)
def get_application_details(app_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return serialize_application(app)

@router.put("/applications/{app_id}/status", response_model=ApplicationResponse)
def update_application_status(
    app_id: int,
    req: ApplicationStatusUpdateRequest,
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    valid_statuses = [s.value for s in ApplicationStatus]
    if req.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"حالة غير صالحة. الحالات المتاحة: {', '.join(valid_statuses)}"
        )

    app.status = req.status
    if req.admin_notes is not None:
        app.admin_notes = req.admin_notes
    app.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(app)
    return serialize_application(app)

@router.put("/documents/{doc_id}/status")
def update_document_status(
    doc_id: int,
    status_val: str = Query(..., regex="^(verified|rejected)$"),
    rejection_reason: Optional[str] = None,
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.status = status_val
    doc.rejection_reason = rejection_reason if status_val == "rejected" else None
    db.commit()
    db.refresh(doc)
    return {"message": "Document status updated", "doc_id": doc.id, "status": doc.status}
