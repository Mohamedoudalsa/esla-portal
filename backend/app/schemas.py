from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name_ar: str = Field(..., min_length=3)
    full_name_en: str = Field(..., min_length=3)
    phone_whatsapp: str = Field(..., min_length=8)

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name_ar: str
    full_name_en: str
    phone_whatsapp: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Document Requirement Schema
class DocRequirement(BaseModel):
    id: str
    name_ar: str
    name_en: str
    description_ar: str
    description_en: str
    is_required: bool = True
    accepted_formats: List[str] = ["pdf", "jpg", "jpeg", "png"]
    max_size_mb: int = 10

class MembershipTierInfo(BaseModel):
    id: str
    title_ar: str
    title_en: str
    subtitle_ar: str
    subtitle_en: str
    description_ar: str
    description_en: str
    annual_fee_egp: int
    required_documents: List[DocRequirement]

# Document Schemas
class DocumentResponse(BaseModel):
    id: int
    application_id: int
    doc_type: str
    original_filename: str
    file_size: int
    mime_type: str
    status: str
    rejection_reason: Optional[str] = None
    uploaded_at: datetime
    preview_url: str

    class Config:
        from_attributes = True

# Application Schemas
class ApplicationCreateRequest(BaseModel):
    category: str

class ApplicationStatusUpdateRequest(BaseModel):
    status: str
    admin_notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    category: str
    status: str
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    user: Optional[UserResponse] = None
    documents: List[DocumentResponse] = []

    class Config:
        from_attributes = True

# Admin Stats Schema
class AdminStatsResponse(BaseModel):
    total_applications: int
    pending_review: int
    under_verification: int
    approved: int
    needs_action: int
    rejected: int
